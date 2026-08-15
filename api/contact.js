import { Resend } from "resend";
import { getSupabase, isMissingTable, tableMissingResponse } from "../lib/apiUtils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, subject, message } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration error" });

  try {
    const { data, error } = await supabase
      .from("contact_enquiries")
      .insert([{ name: name.trim(), email: email.trim(), subject: subject?.trim() || null, message: message.trim() }])
      .select();

    if (error) {
      if (isMissingTable(error)) return tableMissingResponse(res, "contact_enquiries");
      throw error;
    }

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Visheshkala <studio@vishakhagarg.com>",
          to: "hello@visheshkala.com",
          replyTo: email.trim(),
          subject: `[Contact] ${subject?.trim() || "New message"} — ${name.trim()}`,
          html: `<p><strong>From:</strong> ${name.trim()} (${email.trim()})</p><p>${message.trim().replace(/\n/g, "<br>")}</p>`,
        });
      } catch (e) { console.error("Contact notification email failed:", e); }
    }

    return res.status(201).json({ success: true, enquiry: data[0] });
  } catch (err) {
    console.error("Contact error:", err);
    return res.status(500).json({ error: "Could not send message. Please try WhatsApp or email instead." });
  }
}
