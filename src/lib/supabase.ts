import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseState, BookingRequest, MenuItem, BusinessSettings } from '../types';
import { INITIAL_DATABASE_STATE } from '../data/seedMenu';

// Resolve Supabase URL and Key from Vite environment or process environment
const getEnvVar = (key: string): string => {
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] || '';
    }
  } catch {}
  return '';
};

const rawUrl =
  getEnvVar('VITE_SUPABASE_URL') ||
  getEnvVar('SUPABASE_URL') ||
  '';

const rawKey =
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  getEnvVar('VITE_SUPABASE_KEY') ||
  getEnvVar('SUPABASE_SERVICE_ROLE_KEY') ||
  getEnvVar('SUPABASE_KEY') ||
  '';

export let supabaseUrl =
  rawUrl && typeof rawUrl === 'string' && /^https?:\/\//i.test(rawUrl.trim())
    ? rawUrl.trim()
    : '';

export let supabaseKey =
  rawKey && typeof rawKey === 'string' && rawKey.trim().length > 5
    ? rawKey.trim()
    : '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey);
};

export let supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Dynamically re-initialize Supabase if backend /api/config supplies credentials at runtime
 */
export function initializeSupabaseWithRuntimeConfig(url?: string, key?: string) {
  if (url && key && /^https?:\/\//i.test(url) && key.length > 5) {
    try {
      supabaseUrl = url;
      supabaseKey = key;
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (err) {
      console.warn('[Supabase] Dynamic client init notice:', err);
    }
  }
}

/**
 * Fetch full database state across all available central server & DB layers.
 * 1. Checks /api/config runtime environment variables to initialize Supabase & Firebase
 * 2. Tries Supabase (pizzadon_site_state)
 * 3. Tries Firebase Firestore (site_state/config)
 * 4. Tries Express Server API (/api/state)
 * 5. Falls back to default seed data
 */
export async function fetchDatabaseState(): Promise<DatabaseState> {
  // A. Hydrate runtime environment variables from server if available
  try {
    const cfgRes = await fetch('/api/config');
    if (cfgRes.ok) {
      const cfg = await cfgRes.json();
      if (cfg.supabaseUrl && cfg.supabaseAnonKey && !supabase) {
        initializeSupabaseWithRuntimeConfig(cfg.supabaseUrl, cfg.supabaseAnonKey);
      }
      if (cfg.firebaseConfig && cfg.firebaseConfig.apiKey) {
        const { initializeFirebaseWithRuntimeConfig } = await import('./firebase');
        initializeFirebaseWithRuntimeConfig(cfg.firebaseConfig);
      }
    }
  } catch {}

  // B. Try fetching state from Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pizzadon_site_state')
        .select('state')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data && data.state) {
        const remoteState: DatabaseState = data.state;
        if (remoteState.items && Array.isArray(remoteState.items) && remoteState.items.length > 0) {
          return remoteState;
        }
      }
    } catch (err) {
      console.warn('[Supabase] Failed to load state from Supabase table:', err);
    }
  }

  // C. Try fetching state from Firebase Firestore
  try {
    const { db } = await import('./firebase');
    if (db) {
      const { doc, getDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'site_state', 'config');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const fbState = snap.data()?.state as DatabaseState;
        if (fbState && Array.isArray(fbState.items) && fbState.items.length > 0) {
          return fbState;
        }
      }
    }
  } catch (err) {
    console.warn('[Firebase Firestore] State fetch notice:', err);
  }

  // D. Try fetching state from Express Server API
  try {
    const apiRes = await fetch('/api/state');
    if (apiRes.ok) {
      const serverState = await apiRes.json();
      if (serverState && Array.isArray(serverState.items) && serverState.items.length > 0) {
        return serverState;
      }
    }
  } catch {}

  // E. Fallback to default initial database state
  return INITIAL_DATABASE_STATE;
}

/**
 * Save updated database state to Express server, Supabase, and Firebase.
 */
export async function saveDatabaseState(newState: DatabaseState): Promise<void> {
  // 1. Save to Express server API
  try {
    await fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newState)
    });
  } catch (err) {
    console.warn('[API] Failed to sync state to Express server:', err);
  }

  // 2. Save to Supabase if configured
  if (supabase) {
    try {
      const { error } = await supabase
        .from('pizzadon_site_state')
        .upsert(
          {
            id: 'default',
            state: newState,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.warn('[Supabase] Upsert pizzadon_site_state error:', error.message);
      }
    } catch (err) {
      console.warn('[Supabase] Failed to persist state to Supabase:', err);
    }
  }

  // 3. Save to Firebase Firestore if configured
  try {
    const { db } = await import('./firebase');
    if (db) {
      const { doc, setDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'site_state', 'config');
      await setDoc(docRef, {
        state: newState,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('[Firebase] Failed to persist state to Firestore:', err);
  }
}

/**
 * Upload an image file directly to Supabase Storage.
 * Falls back to Base64 Data URL if Supabase is not configured.
 */
export async function uploadImageToSupabase(
  file: File,
  filename: string,
  bucket: string = 'menu-images'
): Promise<{ success: boolean; publicUrl: string; error?: string }> {
  if (supabase) {
    try {
      // Ensure file path / name is safe
      const cleanName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const filePath = `${Date.now()}_${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg'
        });

      if (uploadError) {
        // If bucket doesn't exist, log helpful error message
        console.warn('[Supabase Storage] Upload error:', uploadError.message);
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      if (data && data.publicUrl) {
        return { success: true, publicUrl: data.publicUrl };
      }
    } catch (err: any) {
      console.warn('[Supabase Storage] Upload failed, falling back to client Data URL:', err?.message);
    }
  }

  // Fallback: Convert file to base64 Data URL for standalone client operation
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        success: true,
        publicUrl: reader.result as string
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        publicUrl: '',
        error: 'Failed to read image file'
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Delete an image from Supabase Storage if it's hosted on Supabase.
 */
export async function deleteImageFromSupabase(
  imageUrl: string,
  bucket: string = 'menu-images'
): Promise<void> {
  if (!supabase || !imageUrl || !imageUrl.includes('supabase')) return;

  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    if (fileName) {
      await supabase.storage.from(bucket).remove([fileName]);
    }
  } catch (err) {
    console.warn('[Supabase Storage] Failed to delete image:', err);
  }
}
