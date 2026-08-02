import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const verifyOwner = (req) => {
  const cookies = req.headers.cookie;
  const token = cookies?.split(";").find(c => c.trim().startsWith("owner_token="))?.split("=")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!token || !jwtSecret) return { error: "Unauthorized", status: 401 };
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== "owner") return { error: "Forbidden", status: 403 };
    return { ok: true };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
};

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) {
        const missing =
          error.code === "42P01" ||
          error.code === "PGRST205" ||
          /does not exist/i.test(error.message || "");
        if (missing) return res.status(200).json([]);
        throw error;
      }
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (!["POST", "PUT", "DELETE"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = verifyOwner(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  try {
    if (req.method === "POST") {
      const { name, message, rating, avatar_url, verified, sort_order } = req.body;
      if (!name || !message) return res.status(400).json({ error: "Name and message required" });
      const { data, error } = await supabase
        .from("reviews")
        .insert([{ name, message, rating: rating ?? 5, avatar_url, verified: verified ?? true, sort_order: sort_order ?? 0 }])
        .select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    if (req.method === "PUT") {
      const { id, name, message, rating, avatar_url, verified, sort_order } = req.body;
      if (!id) return res.status(400).json({ error: "ID required" });
      const payload = {};
      if (name !== undefined) payload.name = name;
      if (message !== undefined) payload.message = message;
      if (rating !== undefined) payload.rating = rating;
      if (avatar_url !== undefined) payload.avatar_url = avatar_url;
      if (verified !== undefined) payload.verified = verified;
      if (sort_order !== undefined) payload.sort_order = sort_order;
      const { data, error } = await supabase.from("reviews").update(payload).eq("id", id).select();
      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "ID required" });
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(`Error in manage-reviews (${req.method}):`, err);
    return res.status(500).json({ error: err.message || "Database operation failed" });
  }
}
