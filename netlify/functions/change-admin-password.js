import { createClient } from '@supabase/supabase-js';

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Current password is required.' })
      };
    }

    if (!newPassword || newPassword.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Password must be at least 8 characters.' })
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'New passwords do not match.' })
      };
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    let storedPassword = process.env.ADMIN_PASSWORD || 'PizzaDon#2026!SecurePass';
    let supabase = null;

    if (supabaseUrl && supabaseKey) {
      try {
        supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'admin_password')
          .maybeSingle();

        if (data && data.value) {
          storedPassword = data.value;
        }
      } catch (sbErr) {
        console.warn('[Netlify Function] Supabase connection error:', sbErr);
      }
    }

    const isCurrentValid = currentPassword === storedPassword;

    if (!isCurrentValid) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Incorrect current password.' })
      };
    }

    // Save new password
    if (supabase) {
      try {
        await supabase
          .from('admin_settings')
          .upsert({ key: 'admin_password', value: newPassword, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      } catch (err) {
        console.warn('[Netlify Function] Error persisting new password to Supabase:', err);
      }
    }

    // Also set process.env for current runtime fallback
    process.env.ADMIN_PASSWORD = newPassword;

    const token = `pizzadon_admin_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Password updated successfully and active on site!',
        token
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to process password change request.'
      })
    };
  }
};
