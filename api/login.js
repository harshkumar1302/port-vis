import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body || {};
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("Missing JWT_SECRET environment variable.");
        return res.status(500).json({ error: "Server configuration error (JWT_SECRET missng). Please set it in Vercel." });
    }

    // 0. Initialize Supabase with Service Role for secure backend access
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
        return res.status(500).json({
            error: "Server configuration missing. Please ensure SUPABASE_SERVICE_ROLE_KEY is set in Vercel."
        });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Fetch user from Supabase
        const { data: user, error } = await supabase
            .from("admin_auth")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !user) {
            // Generic error to prevent account enumeration
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 2. Compare passwords
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Sign Token with email and role
        const token = jwt.sign(
            {
                email: user.email,
                role: "owner"
            },
            jwtSecret,
            { expiresIn: "12h" }
        );

        res.setHeader(
            "Set-Cookie",
            `owner_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`
        );

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Login crash:", err);
        return res.status(500).json({ error: `Internal Server Error: ${err.message || 'Unknown error'}` });
    }
}
