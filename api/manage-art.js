import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    // Only allow POST, PUT, DELETE
    if (!["POST", "PUT", "DELETE"].includes(req.method)) {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // 1. Authenticate Request
    const cookies = req.headers.cookie;
    const token = cookies?.split(";").find(c => c.trim().startsWith("owner_token="))?.split("=")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!token || !jwtSecret) {
        return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.role !== "owner") {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }

    // 2. Initialize Supabase with Service Role (Bypasses RLS)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing Supabase Service Role configuration");
        return res.status(500).json({ error: "Server configuration error" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        if (req.method === "POST") {
            const { title, description, category, image_url, user_id } = req.body;
            const { data, error } = await supabase
                .from("artworks")
                .insert([{ title, description, category, image_url, user_id }])
                .select();

            if (error) throw error;
            return res.status(201).json(data[0]);
        }

        if (req.method === "PUT") {
            const { id, title, description, category, image_url } = req.body;
            if (!id) return res.status(400).json({ error: "ID is required for updates" });

            const { data, error } = await supabase
                .from("artworks")
                .update({ title, description, category, image_url })
                .eq("id", id)
                .select();

            if (error) throw error;
            return res.status(200).json(data[0]);
        }

        if (req.method === "DELETE") {
            const { id } = req.body;
            if (!id) return res.status(400).json({ error: "ID is required for deletion" });

            const { error } = await supabase
                .from("artworks")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return res.status(200).json({ success: true });
        }

    } catch (err) {
        console.error(`Error in manage-art (${req.method}):`, err);
        return res.status(500).json({ error: err.message || "Database operation failed" });
    }
}
