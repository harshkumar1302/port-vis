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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, contact_info, items, notes } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart items are required" });
  }

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration error" });

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  try {
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
  } catch (err) {
    console.error("Enquire error:", err);
    return res.status(500).json({ error: "Could not process enquiry. Please try contacting us directly." });
  }
}
