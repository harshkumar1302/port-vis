import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const jwtSecret = process.env.JWT_SECRET;

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: "Server configuration missing" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // GET is public
    if (req.method === "GET") {
        try {
            const { id } = req.query;
            if (!id) {
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*");
                if (error) throw error;
                return res.status(200).json(data);
            }

            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .eq("id", id)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
            return res.status(200).json(data || { id, value: {} });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // POST/PUT require authentication
    if (["POST", "PUT"].includes(req.method)) {
        const cookies = req.headers.cookie;
        const token = cookies?.split(";").find(c => c.trim().startsWith("owner_token="))?.split("=")[1];

        if (!token || !jwtSecret) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, jwtSecret);
            if (decoded.role !== "owner") {
                return res.status(403).json({ error: "Forbidden" });
            }
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }

        try {
            const { id, value } = req.body;
            if (!id || value === undefined) {
                return res.status(400).json({ error: "ID and value are required" });
            }

            const { data, error } = await supabase
                .from("site_settings")
                .upsert({ id, value, updated_at: new Date().toISOString() })
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
