import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                error: 'Missing environment variables',
                details: 'Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) in Vercel settings.'
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Run a lightweight query to wake up the database
        const { data, error } = await supabase
            .from('artworks')
            .select('id')
            .limit(1);

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: 'Supabase keep-alive ping successful',
            timestamp: new Date().toISOString(),
            data
        });
    } catch (error) {
        console.error('Keep-alive error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
