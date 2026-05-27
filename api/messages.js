const { createClient } = require('@supabase/supabase-js');

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token || token !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('she_can_contacts')
            .select('id, name, email, message, submitted_at')
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Messages fetch failed:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
        }

        return res.status(200).json({ success: true, data });

    } catch (err) {
        console.error('Messages handler error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
};
