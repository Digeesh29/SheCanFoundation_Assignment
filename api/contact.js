const { createClient } = require('@supabase/supabase-js');

const DEBUG_MODE = process.env.NODE_ENV !== 'production';
function debugLog(...args) { if (DEBUG_MODE) console.log(...args); }
function debugError(...args) { if (DEBUG_MODE) console.error(...args); }

function getSupabase() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing Supabase environment variables');
    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { 'X-Client-Info': 'she-can-foundation' } }
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    if (name.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'Name must be at least 2 characters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }
    if (message.trim().length < 10) {
        return res.status(400).json({ success: false, error: 'Message must be at least 10 characters.' });
    }

    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('she_can_contacts')
            .insert([{
                name: name.trim(),
                email: email.trim().toLowerCase(),
                message: message.trim()
            }])
            .select('id, submitted_at')
            .single();

        if (error) {
            debugError('Contact insert failed:', error);
            return res.status(500).json({ success: false, error: 'Failed to save your message. Please try again.' });
        }

        debugLog('Contact saved:', data.id);
        return res.status(201).json({ success: true, id: data.id, submitted_at: data.submitted_at });

    } catch (err) {
        debugError('Contact handler error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
};
