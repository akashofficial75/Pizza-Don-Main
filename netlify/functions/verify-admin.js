import { createClient } from '@supabase/supabase-js';

export const handler = async (event, context) => {
  // CORS Headers
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
    const password = body.password;

    if (!password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Password is required' })
      };
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    let expectedPassword = process.env.ADMIN_PASSWORD || 'PizzaDon#2026!SecurePass';

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'admin_password')
          .maybeSingle();

        if (data && data.value) {
          expectedPassword = data.value;
        }
      } catch (err) {
        console.warn('[Netlify Function] Error reading password from Supabase:', err);
      }
    }

    if (process.env.ADMIN_PASSWORD) {
      return {
        statusCode: password === process.env.ADMIN_PASSWORD ? 200 : 401,
        headers,
        body: JSON.stringify(
          password === process.env.ADMIN_PASSWORD
            ? { success: true, token: `pizzadon_admin_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`, message: 'Authentication successful' }
            : { success: false, error: 'Incorrect password.' }
        )
      };
    }

    if (password === expectedPassword) {
      // Generate session token
      const token = `pizzadon_admin_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          token,
          message: 'Authentication successful'
        })
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Incorrect password.'
        })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Invalid request body or server error'
      })
    };
  }
};
