const express = require('express');
const router = express.Router();
const { supabase, debugLog, debugError } = require('./config');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

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
        debugError('Contact route error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

module.exports = router;
