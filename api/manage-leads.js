import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

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

const isMissingTable = (error) =>
  error?.code === "42P01" ||
  error?.code === "PGRST205" ||
  /does not exist/i.test(error?.message || "");

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (req.method === "POST") {
      // Anyone can submit a lead
      const { name, contact_info, message } = req.body;
      if (!message) return res.status(400).json({ error: "Message is required" });

      const { data, error } = await supabase
        .from("chatbot_leads")
        .insert([{ name, contact_info, message }])
        .select();
        
      if (error) {
        if (isMissingTable(error)) {
          return res.status(503).json({
            error: "Leads table not set up yet. Run migrations/2026_08_chatbot_leads.sql in Supabase.",
            code: "TABLE_MISSING",
          });
        }
        throw error;
      }
      return res.status(201).json({ success: true, lead: data[0] });
    }

    // Owner only for GET and PUT
    const auth = verifyOwner(req);
    if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("chatbot_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (isMissingTable(error)) return res.status(200).json([]);
        throw error;
      }
      return res.status(200).json(data || []);
    }

    if (req.method === "PUT") {
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: "ID and status are required" });

      const { data, error } = await supabase
        .from("chatbot_leads")
        .update({ status })
        .eq("id", id)
        .select();
        
      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(`Error in manage-leads (${req.method}):`, err);
    return res.status(500).json({ error: err.message || "Database operation failed" });
  }
}
