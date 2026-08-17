import { getSupabase, verifyOwner, isMissingTable, tableMissingResponse } from "../lib/apiUtils.js";

const adminOnly = (req, res) => {
  const auth = verifyOwner(req);
  if (!auth.ok) {
    res.status(auth.status).json({ error: auth.error });
    return null;
  }
  return auth;
};

const adminList = async (req, res, supabase, table, tableLabel) => {
  if (!adminOnly(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
  if (error) {
    if (isMissingTable(error)) return tableMissingResponse(res, tableLabel);
    throw error;
  }
  return res.status(200).json(data || []);
};

const adminMarkRead = async (req, res, supabase, table) => {
  if (!adminOnly(req, res)) return;
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });
  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ error: "ID and status are required" });
  const { data, error } = await supabase.from(table).update({ status }).eq("id", id).select();
  if (error) throw error;
  return res.status(200).json(data[0]);
};

const handleLeads = async (req, res, supabase) => {
  if (req.method === "POST") {
    const { name, contact_info, message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    const { data, error } = await supabase.from("chatbot_leads").insert([{ name, contact_info, message }]).select();
    if (error) {
      if (isMissingTable(error)) return tableMissingResponse(res, "chatbot_leads");
      throw error;
    }
    return res.status(201).json({ success: true, lead: data[0] });
  }

  if (req.method === "GET") return adminList(req, res, supabase, "chatbot_leads", "chatbot_leads");
  if (req.method === "PUT") return adminMarkRead(req, res, supabase, "chatbot_leads");
  return res.status(405).json({ error: "Method not allowed" });
};

const handleContact = async (req, res, supabase) => {
  if (req.method === "GET") return adminList(req, res, supabase, "contact_enquiries", "contact_enquiries");
  if (req.method === "PUT") return adminMarkRead(req, res, supabase, "contact_enquiries");
  return res.status(405).json({ error: "Method not allowed" });
};

const handleCart = async (req, res, supabase) => {
  if (req.method === "GET") return adminList(req, res, supabase, "cart_enquiries", "cart_enquiries");
  if (req.method === "PUT") return adminMarkRead(req, res, supabase, "cart_enquiries");
  return res.status(405).json({ error: "Method not allowed" });
};

const handleNewsletter = async (req, res, supabase) => {
  if (req.method === "GET") return adminList(req, res, supabase, "newsletter_subscribers", "newsletter_subscribers");
  return res.status(405).json({ error: "Method not allowed" });
};

const handleReviews = async (req, res, supabase) => {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      if (isMissingTable(error)) return res.status(200).json([]);
      throw error;
    }
    return res.status(200).json(data || []);
  }

  if (!["POST", "PUT", "DELETE"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!adminOnly(req, res)) return;

  if (req.method === "POST") {
    const { name, message, rating, avatar_url, verified, sort_order, time_ago, review_image_url } = req.body;
    if (!name || !message) return res.status(400).json({ error: "Name and message required" });
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ name, message, rating: rating ?? 5, avatar_url, verified: verified ?? true, sort_order: sort_order ?? 0, time_ago, review_image_url }])
      .select();
    if (error) throw error;
    return res.status(201).json(data[0]);
  }

  if (req.method === "PUT") {
    const { id, name, message, rating, avatar_url, verified, sort_order, time_ago, review_image_url } = req.body;
    if (!id) return res.status(400).json({ error: "ID required" });
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (message !== undefined) payload.message = message;
    if (rating !== undefined) payload.rating = rating;
    if (avatar_url !== undefined) payload.avatar_url = avatar_url;
    if (verified !== undefined) payload.verified = verified;
    if (sort_order !== undefined) payload.sort_order = sort_order;
    if (time_ago !== undefined) payload.time_ago = time_ago;
    if (review_image_url !== undefined) payload.review_image_url = review_image_url;
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
};

const RESOURCES = {
  leads: handleLeads,
  reviews: handleReviews,
  contact: handleContact,
  cart: handleCart,
  newsletter: handleNewsletter,
};

export default async function handler(req, res) {
  const resource = req.query?.resource || req.body?._resource;
  if (!resource || !RESOURCES[resource]) {
    return res.status(400).json({ error: "Unknown resource. Use ?resource=leads|reviews|contact|cart|newsletter" });
  }

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration error" });

  try {
    return RESOURCES[resource](req, res, supabase);
  } catch (err) {
    console.error(`Error in manage-content (${resource}, ${req.method}):`, err);
    return res.status(500).json({ error: err.message || "Database operation failed" });
  }
}
