import { getSupabase, isMissingTable, tableMissingResponse } from "../lib/apiUtils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body || {};
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration error" });

  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert([{ email: email.trim().toLowerCase() }], { onConflict: "email", ignoreDuplicates: true });

    if (error) {
      if (isMissingTable(error)) return tableMissingResponse(res, "newsletter_subscribers");
      throw error;
    }

    return res.status(201).json({ success: true, message: "You're on the list!" });
  } catch (err) {
    console.error("Newsletter error:", err);
    return res.status(500).json({ error: "Could not subscribe. Please try again." });
  }
}
