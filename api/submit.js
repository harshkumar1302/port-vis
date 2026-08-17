import { Resend } from "resend";
import { getSupabase, isMissingTable, tableMissingResponse } from "../lib/apiUtils.js";

const formatPrice = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "Price on request");

const buildCartMessage = (items, total, name, contactInfo) => {
  const lines = items.map((item) => {
    const qty = item.quantity || 1;
    const line = item.price ? formatPrice(item.price * qty) : "Enquire";
    return `• ${item.title}${qty > 1 ? ` ×${qty}` : ""} — ${line}`;
  });
  let msg = `Hi Visheshkala! I'd like to enquire about my cart:\n\n${lines.join("\n")}`;
  if (total) msg += `\n\nTotal: ${formatPrice(total)}`;
  if (name) msg += `\n\nName: ${name}`;
  if (contactInfo) msg += `\nContact: ${contactInfo}`;
  msg += "\n\nPlease share payment and delivery details. Thank you!";
  return msg;
};

const getWhatsAppChannels = async (supabase) => {
  const { data } = await supabase.from("site_settings").select("value").eq("id", "contact_channels").single();
  return data?.value || {};
};

const handleContact = async (req, res, supabase) => {
  const { name, email, subject, message } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

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
    } catch (e) {
      console.error("Contact notification email failed:", e);
    }
  }

  return res.status(201).json({ success: true, enquiry: data[0] });
};

const handleCart = async (req, res, supabase) => {
  const { name, contact_info, items, notes } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required" });
  }

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const { data, error } = await supabase
    .from("cart_enquiries")
    .insert([{
      name: name?.trim() || null,
      contact_info: contact_info?.trim() || null,
      items,
      total: total || null,
      notes: notes?.trim() || null,
    }])
    .select();

  if (error) {
    if (isMissingTable(error)) return tableMissingResponse(res, "cart_enquiries");
    throw error;
  }

  const channels = await getWhatsAppChannels(supabase);
  const number = (channels.whatsapp_number || "").replace(/\D/g, "");
  const message = buildCartMessage(items, total, name, contact_info);
  const whatsappUrl = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;

  return res.status(201).json({
    success: true,
    enquiryId: data[0]?.id,
    whatsappUrl,
    whatsappEnabled: Boolean(number),
    message: whatsappUrl
      ? "Order saved! Opening WhatsApp to complete your enquiry."
      : "Order saved! We'll reach out shortly — WhatsApp checkout is being set up.",
  });
};

const handleNewsletter = async (req, res, supabase) => {
  const { email } = req.body || {};
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert([{ email: email.trim().toLowerCase() }], { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    if (isMissingTable(error)) return tableMissingResponse(res, "newsletter_subscribers");
    throw error;
  }

  return res.status(201).json({ success: true, message: "You're on the list!" });
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const type = req.query?.type || req.body?.type;
  if (!type) return res.status(400).json({ error: "type is required (contact, cart, newsletter)" });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration error" });

  try {
    if (type === "contact") return handleContact(req, res, supabase);
    if (type === "cart") return handleCart(req, res, supabase);
    if (type === "newsletter") return handleNewsletter(req, res, supabase);
    return res.status(400).json({ error: "Unknown type. Use contact, cart, or newsletter." });
  } catch (err) {
    console.error(`Submit (${type}) error:`, err);
    const messages = {
      contact: "Could not send message. Please try WhatsApp or email instead.",
      cart: "Could not process enquiry. Please try contacting us directly.",
      newsletter: "Could not subscribe. Please try again.",
    };
    return res.status(500).json({ error: messages[type] || "Request failed" });
  }
}
