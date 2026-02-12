import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "./utils/email";

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // 1. Check if an owner already exists (we only want ONE owner)
        const { count, error: countError } = await supabase
            .from("admin_auth")
            .select("*", { count: "exact", head: true });

        if (countError) throw countError;

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

        if (insertError) throw insertError;

        // 4. Send Welcome Email
        await sendWelcomeEmail(email);

        return res.status(200).json({ ok: true, message: "Owner registered successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ error: "Failed to register owner" });
    }
}
