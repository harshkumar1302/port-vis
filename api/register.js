import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "./utils/email.js";



export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // 0. Initialize Supabase with Service Role
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({
            error: "Server configuration missing (Supabase keys)."
        });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Check if an owner already exists (we only want ONE owner)
        const { count, error: countError } = await supabase
            .from("admin_auth")
            .select("*", { count: "exact", head: true });

        if (countError) {
            return res.status(500).json({
                error: `Supabase error: ${countError.message}. Have you created the 'admin_auth' table using the SQL script?`
            });
        }

        if (count > 0) {
            return res.status(403).json({
                error: "Registration closed. An owner account already exists."
            });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Save to Supabase
        const { error: insertError } = await supabase
            .from("admin_auth")
            .insert([{ email, password_hash: passwordHash }]);

        if (insertError) {
            return res.status(500).json({ error: `Failed to save user: ${insertError.message}` });
        }

        // 4. Send Welcome Email (Non-blocking)
        try {
            await sendWelcomeEmail(email);
        } catch (emailErr) {
            console.error("Welcome email failed but registration succeeded:", emailErr);
        }

        return res.status(200).json({ ok: true, message: "Owner registered successfully" });
    } catch (err) {
        console.error("Registration crash:", err);
        return res.status(500).json({ error: `Internal Server Error: ${err.message || 'Unknown error'}` });
    }
}
