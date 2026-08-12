import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_DATABASE_STATE } from './src/data/seedMenu';
import { DatabaseState, MenuItem, BookingRequest } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure data and upload directories exist for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'pizzadon.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_UPLOADS_DIR)) {
  fs.mkdirSync(DATA_UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
  fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(PUBLIC_UPLOADS_DIR));
app.use('/uploads', express.static(DATA_UPLOADS_DIR));

// Password Hashing Helpers
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function verifyPassword(inputPassword: string, storedHash?: string, storedSalt?: string): boolean {
  if (!inputPassword) return false;
  // Allow explicit ADMIN_PASSWORD env var override if set
  if (process.env.ADMIN_PASSWORD) {
    return inputPassword === process.env.ADMIN_PASSWORD;
  }
  if (!storedHash || !storedSalt) {
    return false;
  }
  const inputHash = hashPassword(inputPassword, storedSalt);
  try {
    const inputBuf = Buffer.from(inputHash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (inputBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(inputBuf, storedBuf);
  } catch {
    return false;
  }
}

function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DatabaseState = JSON.parse(raw);

      // Ensure admin password hash is initialized if missing
      if (!parsed.adminSalt || !parsed.adminPasswordHash) {
        const salt = crypto.randomBytes(16).toString('hex');
        parsed.adminSalt = salt;
        parsed.adminPasswordHash = hashPassword('PizzaDon#2026!SecurePass', salt);
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading DB file, using seed state:', err);
  }

  // Initialize with seed data and save
  const initialState = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE)) as DatabaseState;
  const salt = crypto.randomBytes(16).toString('hex');
  initialState.adminSalt = salt;
  initialState.adminPasswordHash = hashPassword('PizzaDon#2026!SecurePass', salt);
  saveDatabase(initialState);
  return initialState;
}

function saveDatabase(state: DatabaseState): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

let db: DatabaseState = loadDatabase();

// --- API ENDPOINTS ---

// Runtime environment config for frontend dynamic sync
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_KEY || '',
    firebaseConfig: {
      apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || ''
    },
    hasAdminPasswordEnv: Boolean(process.env.ADMIN_PASSWORD)
  });
});

// 1. Get entire state for frontend initialization
app.get('/api/state', (req, res) => {
  res.json(db);
});

// 1b. Put/update entire state from frontend (admin dish changes, settings, etc.)
app.put('/api/state', (req, res) => {
  if (req.body && typeof req.body === 'object') {
    db = {
      ...db,
      ...req.body
    };
    saveDatabase(db);
    return res.json({ success: true, message: 'State saved to server', db });
  }
  res.status(400).json({ error: 'Invalid state payload' });
});

// 2. Menu CRUD
app.get('/api/menu', (req, res) => {
  res.json({ categories: db.categories, items: db.items });
});

app.post('/api/menu/items', (req, res) => {
  const newItem: MenuItem = {
    id: `item-${Date.now()}`,
    name: req.body.name || 'New Item',
    category: req.body.category || 'Regular Pizza',
    description: req.body.description || '',
    ingredients: req.body.ingredients || '',
    price: req.body.price || 200,
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
    tags: req.body.tags || [],
    soldOut: req.body.soldOut || false,
    note: req.body.note || undefined,
    orderIndex: db.items.length + 1
  };
  db.items.push(newItem);
  saveDatabase(db);
  res.json(newItem);
});

app.put('/api/menu/items/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.items.findIndex(item => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  db.items[idx] = {
    ...db.items[idx],
    ...req.body,
    id // protect id
  };
  saveDatabase(db);
  res.json(db.items[idx]);
});

app.delete('/api/menu/items/:id', (req, res) => {
  const { id } = req.params;
  db.items = db.items.filter(item => item.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// 3. Reorder menu items (drag & drop support)
app.post('/api/menu/reorder', (req, res) => {
  const { orderedIds } = req.body;
  if (Array.isArray(orderedIds)) {
    const map = new Map(db.items.map(item => [item.id, item]));
    const reordered: MenuItem[] = [];
    orderedIds.forEach((id, index) => {
      const found = map.get(id);
      if (found) {
        found.orderIndex = index + 1;
        reordered.push(found);
      }
    });
    // Append any missing items
    db.items.forEach(item => {
      if (!orderedIds.includes(item.id)) {
        item.orderIndex = reordered.length + 1;
        reordered.push(item);
      }
    });
    db.items = reordered;
    saveDatabase(db);
  }
  res.json({ success: true, items: db.items });
});

// 4. Bookings CRUD & Date blocking
app.get('/api/bookings', (req, res) => {
  res.json({
    bookings: db.bookings,
    blockedDates: db.blockedDates
  });
});

app.post('/api/bookings', (req, res) => {
  const newBooking: BookingRequest = {
    id: `book-${Date.now()}`,
    bookingType: req.body.bookingType || 'table',
    name: req.body.name || 'Guest',
    phone: req.body.phone || '',
    date: req.body.date || new Date().toISOString().split('T')[0],
    timeSlot: req.body.timeSlot || '18:00',
    guests: Number(req.body.guests) || 2,
    occasion: req.body.occasion || '',
    eventThemeRequest: req.body.eventThemeRequest || '',
    notes: req.body.notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  db.bookings.unshift(newBooking);
  saveDatabase(db);
  res.json(newBooking);
});

app.put('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const idx = db.bookings.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  db.bookings[idx].status = status;
  saveDatabase(db);
  res.json(db.bookings[idx]);
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const initialCount = db.bookings.length;
  db.bookings = db.bookings.filter(b => b.id !== id);
  if (db.bookings.length === initialCount) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  saveDatabase(db);
  res.json({ success: true, remainingCount: db.bookings.length });
});

app.post('/api/bookings/block-date', (req, res) => {
  const { date, reason } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  if (!db.blockedDates.some(bd => bd.date === date)) {
    db.blockedDates.push({ date, reason: reason || 'Fully Booked' });
    saveDatabase(db);
  }
  res.json({ success: true, blockedDates: db.blockedDates });
});

app.delete('/api/bookings/block-date/:date', (req, res) => {
  const { date } = req.params;
  db.blockedDates = db.blockedDates.filter(bd => bd.date !== date);
  saveDatabase(db);
  res.json({ success: true, blockedDates: db.blockedDates });
});

// 5. Settings CRUD
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDatabase(db);
  res.json(db.settings);
});

// 6. Admin Auth
const handleAdminLogin = (req: express.Request, res: express.Response) => {
  const { password } = req.body;
  if (verifyPassword(password, db.adminPasswordHash, db.adminSalt)) {
    const token = `pizzadon-admin-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    db.adminToken = token;
    saveDatabase(db);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password.' });
  }
};

app.post('/api/admin/login', handleAdminLogin);
app.post('/.netlify/functions/verify-admin', handleAdminLogin);

// 6b. Admin Change Password
const handleAdminChangePassword = (req: express.Request, res: express.Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ success: false, error: 'Current password is required.' });
  }

  // 1. Verify current password
  if (!verifyPassword(currentPassword, db.adminPasswordHash, db.adminSalt)) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
  }

  // 2. Validate new password length
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  }

  // 3. Confirm matching passwords
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, error: 'Passwords do not match.' });
  }

  // 4. Update stored password with fresh salt & PBKDF2 hash
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);
  db.adminSalt = newSalt;
  db.adminPasswordHash = newHash;

  // 5. Update session token so current session remains valid
  const newToken = `pizzadon-admin-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  db.adminToken = newToken;
  saveDatabase(db);

  res.json({ success: true, message: 'Password updated successfully', token: newToken });
};

app.post('/api/admin/change-password', handleAdminChangePassword);
app.post('/.netlify/functions/change-admin-password', handleAdminChangePassword);

// 6b. Admin Image Upload (Supabase Storage with automatic Local Storage fallback)
app.post('/api/admin/upload-image', async (req, res) => {
  try {
    const { filename, contentType, base64Data, bucket = 'menu-images' } = req.body;
    if (!base64Data || !filename) {
      return res.status(400).json({ success: false, error: 'Missing image data or filename' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const rawSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    const supabaseUrl = (rawSupabaseUrl && typeof rawSupabaseUrl === 'string' && /^https?:\/\//i.test(rawSupabaseUrl.trim())) ? rawSupabaseUrl.trim() : null;
    const supabaseKey = (rawSupabaseKey && typeof rawSupabaseKey === 'string' && rawSupabaseKey.trim().length > 5) ? rawSupabaseKey.trim() : null;

    // 1. Attempt upload to Supabase Storage if credentials are validly configured
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filename, buffer, {
            contentType: contentType || 'image/jpeg',
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);
          return res.json({ success: true, publicUrl });
        } else {
          console.warn('[Upload] Supabase upload failed, falling back to local upload storage:', uploadError.message);
        }
      } catch (sbErr: any) {
        console.warn('[Upload] Supabase client error, falling back to local storage:', sbErr?.message);
      }
    }

    // 2. Reliable local storage fallback (so admin panel upload works 100% in AI Studio preview)
    const ext = path.extname(filename) || '.jpg';
    const safeName = `${path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '')}-${Date.now()}${ext}`;
    const targetPublic = path.join(PUBLIC_UPLOADS_DIR, safeName);
    const targetData = path.join(DATA_UPLOADS_DIR, safeName);

    fs.writeFileSync(targetPublic, buffer);
    fs.writeFileSync(targetData, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ success: true, publicUrl });
  } catch (err: any) {
    console.error('Error uploading image:', err);
    res.status(500).json({ success: false, error: err?.message || 'Upload failed' });
  }
});

// 6c. Admin Image Delete (Supabase Storage or local /uploads/)
app.post('/api/admin/delete-image', async (req, res) => {
  try {
    const { imageUrl, bucket = 'menu-images' } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Missing imageUrl' });
    }

    const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const rawSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    const supabaseUrl = (rawSupabaseUrl && typeof rawSupabaseUrl === 'string' && /^https?:\/\//i.test(rawSupabaseUrl.trim())) ? rawSupabaseUrl.trim() : null;
    const supabaseKey = (rawSupabaseKey && typeof rawSupabaseKey === 'string' && rawSupabaseKey.trim().length > 5) ? rawSupabaseKey.trim() : null;

    // 1. Delete from Supabase if it's a Supabase URL and credentials are valid
    if (supabaseUrl && supabaseKey && imageUrl.includes('supabase')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1]?.split('?')[0];
        if (filename) {
          await supabase.storage.from(bucket).remove([filename]);
        }
      } catch (sbErr: any) {
        console.warn('[Delete Image] Supabase remove error:', sbErr?.message);
      }
    }

    // 2. Delete from local uploads if local URL
    if (typeof imageUrl === 'string' && imageUrl.startsWith('/uploads/')) {
      const filename = path.basename(imageUrl);
      const targetPublic = path.join(PUBLIC_UPLOADS_DIR, filename);
      const targetData = path.join(DATA_UPLOADS_DIR, filename);
      if (fs.existsSync(targetPublic)) {
        try { fs.unlinkSync(targetPublic); } catch {}
      }
      if (fs.existsSync(targetData)) {
        try { fs.unlinkSync(targetData); } catch {}
      }
    }

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting image:', err);
    res.status(500).json({ success: false, error: err?.message || 'Delete failed' });
  }
});


// 7. Gemini AI helper for Admin: Suggest Italian-American Don description
app.post('/api/ai/suggest-description', async (req, res) => {
  try {
    const { dishName, category, ingredients } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server.' });
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the culinary brand director for "Pizza Don Dhamrai", an upscale boutique pizzeria in Dhamrai, Bangladesh with an Italian-American 'mob boss' Don branding twist (classy, cinematic, tailored elegance, gold trim, moody lighting—not cartoonish or violent).
Write a mouth-watering, 1-2 sentence description for a menu item with:
- Name: ${dishName || 'Special Dish'}
- Category: ${category || 'Pizza'}
- Ingredients: ${ingredients || 'Cheese, herbs, secret sauce'}

Make it sound rich, cinematic, and irresistible. Do not include quotes or conversational filler.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const suggestion = response.text?.trim() || 'An exquisite signature dish prepared with hand-selected ingredients and secret house spices.';
    res.json({ suggestion });
  } catch (error: any) {
    console.error('Gemini AI error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate AI description' });
  }
});

// 8. Reset database to initial seed (useful for testing)
app.post('/api/admin/reset-seed', (req, res) => {
  db = JSON.parse(JSON.stringify(INITIAL_DATABASE_STATE));
  saveDatabase(db);
  res.json({ success: true, message: 'Database reset to initial Dhamrai seed.' });
});

// --- VITE / STATIC PRODUCTION SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pizza Don Dhamrai] Server running on http://localhost:${PORT}`);
  });
}

startServer();
