try { require('dotenv').config(); } catch (_) {}

const { createClient } = require('@supabase/supabase-js');

const DEBUG_MODE = process.env.NODE_ENV !== 'production';

function debugLog(...args) {
    if (DEBUG_MODE) console.log(...args);
}

function debugError(...args) {
    if (DEBUG_MODE) console.error(...args);
}

const config = {
    port: process.env.SHE_CAN_PORT || 4000,
    env: process.env.NODE_ENV || 'development',
    debug: DEBUG_MODE
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    debugError('Missing Supabase environment variables.');
    debugError('Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'X-Client-Info': 'she-can-foundation' } }
});

debugLog('Supabase client ready.');

module.exports = { config, supabase, debugLog, debugError };
