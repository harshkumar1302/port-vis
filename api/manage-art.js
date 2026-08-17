import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const ARTWORK_FIELDS = [
  "title", "description", "category", "image_url", "user_id",
  "price", "original_price", "is_bestseller", "is_new", "is_featured",
  "sub_category", "sort_order", "stock", "listing_type",
];

const SHOP_FIELDS = [
  "title", "description", "category", "image_url", "user_id",
  "price", "original_price", "is_active", "stock",
];

const pickFields = (body, fields) => {
  const payload = {};
  for (const key of fields) {
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
  const isShop = req.body?._resource === "shop";
  const table = isShop ? "shop_products" : "artworks";
  const fields = isShop ? SHOP_FIELDS : ARTWORK_FIELDS;

  try {
    if (req.method === "POST") {
      const payload = pickFields(req.body, fields);
      const { data, error } = await supabase.from(table).insert([payload]).select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    if (req.method === "PUT") {
      const { action, oldCategory, newCategory, id, _resource, ...rest } = req.body;

      if (!isShop && action === "rename_category") {
        if (!oldCategory || !newCategory) {
          return res.status(400).json({ error: "oldCategory and newCategory required" });
        }
        const { error } = await supabase
          .from("artworks")
          .update({ category: newCategory })
          .eq("category", oldCategory);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      if (!id) return res.status(400).json({ error: "ID is required for updates" });

      const payload = pickFields(rest, fields);
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq("id", id)
        .select();
      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "ID is required for deletion" });
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(`Error in manage-art (${req.method}):`, err);
    return res.status(500).json({ error: err.message || "Database operation failed" });
  }
}
