import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
// Note: Firebase Storage is NOT used to avoid Blaze paid plan requirement.
// All images/logos are converted to Base64 and stored directly in Firestore.

// --------------------------------------------------------------------------
// FIREBASE CONFIGURATION
// --------------------------------------------------------------------------
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

/**
 * Checks if Firebase configuration has been provided with real credentials.
 */
export const isFirebaseConfigured = (): boolean => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    !firebaseConfig.apiKey.includes("YOUR_") &&
    Boolean(firebaseConfig.projectId) &&
    !firebaseConfig.projectId.includes("YOUR_")
  );
};

// Mutable references so dynamic config from /api/config can initialize them if needed
export let auth = isFirebaseConfigured() ? getAuth(getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()) : null;
export let db = isFirebaseConfigured() ? getFirestore(getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()) : null;
export const storage = null; // Storage disabled to avoid Blaze paid plan requirement

/**
 * Dynamically re-initialize Firebase if backend /api/config supplies credentials
 */
export function initializeFirebaseWithRuntimeConfig(cfg: any) {
  if (!cfg || !cfg.apiKey || cfg.apiKey.includes("YOUR_")) return;
  try {
    firebaseConfig.apiKey = cfg.apiKey;
    firebaseConfig.authDomain = cfg.authDomain || `${cfg.projectId}.firebaseapp.com`;
    firebaseConfig.projectId = cfg.projectId;
    firebaseConfig.storageBucket = cfg.storageBucket || `${cfg.projectId}.firebasestorage.app`;
    firebaseConfig.messagingSenderId = cfg.messagingSenderId || '';
    firebaseConfig.appId = cfg.appId || '';

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('[Firebase] Dynamic initialization notice:', err);
  }
}

// --------------------------------------------------------------------------
// PASSWORD HASHING HELPER (SHA-256)
// --------------------------------------------------------------------------
async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "_pizzadon_salt_2026");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple string transform if crypto API is unavailable
    return `hashed_${password}_2026`;
  }
}

// --------------------------------------------------------------------------
// ADMIN AUTHENTICATION & PASSWORD MANAGEMENT
// --------------------------------------------------------------------------

/**
 * Verify admin password against stored hash in Firebase Firestore.
 * Returns false if Firebase is not connected (server endpoints handle primary auth).
 */
export async function verifyAdminPasswordFirebase(passwordInput: string): Promise<boolean> {
  if (!passwordInput || !db) return false;
  const inputHash = await hashPassword(passwordInput);

  try {
    const docRef = doc(db, 'admin_settings', 'config');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.passwordHash) {
        return data.passwordHash === inputHash;
      }
    }
  } catch (err) {
    console.warn('[Firebase Auth] Could not query Firestore password:', err);
  }

  return false;
}

/**
 * Change admin password securely and store SHA-256 hash in Firebase Firestore if connected.
 */
export async function changeAdminPasswordFirebase(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!db) return { success: false, error: 'Firebase not configured' };

  // 1. Verify current password in Firestore
  const isValid = await verifyAdminPasswordFirebase(currentPassword);
  if (!isValid) {
    return { success: false, error: 'Incorrect current password.' };
  }

  const newHash = await hashPassword(newPassword);

  // 2. Persist to Firebase Firestore
  try {
    const docRef = doc(db, 'admin_settings', 'config');
    await setDoc(docRef, {
      passwordHash: newHash,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.warn('[Firebase Auth] Failed to save password to Firestore:', err);
    return { success: false, error: 'Firebase Firestore error: ' + (err?.message || 'Failed to write to database.') };
  }
}

// --------------------------------------------------------------------------
// LOGO & IMAGE CONVERSION & FIRESTORE SAVING (NO FIREBASE STORAGE REQUIRED)
// --------------------------------------------------------------------------

/**
 * Converts image file to Base64 Data URL and saves directly to Firestore.
 * Avoids Firebase Storage completely so no Blaze (paid) plan is required.
 */
export async function uploadImageToFirebaseStorage(
  file: File,
  folderName: string = 'logos'
): Promise<{ success: boolean; url: string; error?: string }> {
  // Client-side file size check for Firestore document limit (750KB max)
  const MAX_FIRESTORE_IMAGE_SIZE = 750 * 1024; // 750 KB
  if (file.size > MAX_FIRESTORE_IMAGE_SIZE) {
    return {
      success: false,
      url: '',
      error: `Image size is ${(file.size / 1024).toFixed(0)}KB. Maximum allowed size is 750KB for direct Firestore storage. Please upload a smaller or compressed image.`
    };
  }

  // Convert file to base64 Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;

      if (db) {
        try {
          // Save directly to Firestore under site_settings/logo
          await setDoc(doc(db, 'site_settings', 'logo'), {
            siteLogoUrl: base64Url,
            updatedAt: new Date().toISOString()
          }, { merge: true });

          // Also update site_settings/config
          await setDoc(doc(db, 'site_settings', 'config'), {
            siteLogoUrl: base64Url,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (dbErr: any) {
          console.warn('[Firebase Firestore] Failed to save Base64 image to Firestore:', dbErr);
          resolve({
            success: false,
            url: '',
            error: 'Failed to save image to Firestore: ' + (dbErr?.message || 'Database write error')
          });
          return;
        }
      }

      resolve({ success: true, url: base64Url });
    };

    reader.onerror = () => {
      resolve({ success: false, url: '', error: 'Failed to read image file.' });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Fetch persistent logo URL from Firebase Firestore.
 */
export async function getPersistentLogoFromFirebase(): Promise<string | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'site_settings', 'logo');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data()?.siteLogoUrl || null;
    }
  } catch (err) {
    console.warn('[Firebase Firestore] Failed to fetch logo:', err);
  }
  return null;
}

/**
 * Save site settings and logo URL permanently to Firebase Firestore.
 */
export async function saveSiteSettingsToFirebase(settings: any): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'site_settings', 'config');
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (settings && settings.siteLogoUrl) {
      const logoRef = doc(db, 'site_settings', 'logo');
      await setDoc(logoRef, {
        siteLogoUrl: settings.siteLogoUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('[Firebase Firestore] Could not save site settings:', err);
  }
}
