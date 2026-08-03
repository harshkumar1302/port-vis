import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const SHOP_FIELDS = [
  "title", "description", "category", "image_url", "user_id",
  "price", "original_price", "is_active", "stock"
];

const pickShopFields = (body) => {
  const payload = {};
  for (const key of SHOP_FIELDS) {
    if (body[key] !== undefined) payload[key] = body[key];
  }
  return payload;
};

const verifyOwner = (req) => {
  const cookies = req.headers.cookie;
  const token = cookies?.split(";").find(c => c.trim().startsWith("owner_token="))?.split("=")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!token || !jwtSecret) return { error: "Unauthorized: Missing authentication token", status: 401 };
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== "owner") return { error: "Forbidden: Insufficient permissions", status: 403 };
    return { ok: true };
  } catch {
    return { error: "Unauthorized: Invalid or expired token", status: 401 };
  }
};

export default async function handler(req, res) {
  if (!["POST", "PUT", "DELETE"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = verifyOwner(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (req.method === "POST") {
      const payload = pickShopFields(req.body);
      const { data, error } = await supabase.from("shop_products").insert([payload]).select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    if (req.method === "PUT") {
      const { id, ...rest } = req.body;
      if (!id) return res.status(400).json({ error: "ID is required for updates" });

      const payload = pickShopFields(rest);
      const { data, error } = await supabase
        .from("shop_products")
        .update(payload)
        .eq("id", id)
        .select();
      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "ID is required for deletion" });
      const { error } = await supabase.from("shop_products").delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(`Error in manage-shop (${req.method}):`, err);
    return res.status(500).json({ error: err.message || "Database operation failed" });
  }
}
