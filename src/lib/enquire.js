/** Flip to true when your WhatsApp number is ready */
export const WHATSAPP_ENABLED = false;

const DEFAULT_CHANNELS = {
  instagram_url: 'https://www.instagram.com/visheshkalaa/',
  whatsapp_number: '',
  whatsapp_message_template: 'Hi! I saw {title} on Visheshkala and would love to know more.',
};

export const buildWhatsAppUrl = (artwork, channels = DEFAULT_CHANNELS) => {
  const number = (channels.whatsapp_number || '').replace(/\D/g, '');
  if (!number) return null;
  const template = channels.whatsapp_message_template || DEFAULT_CHANNELS.whatsapp_message_template;
  const message = template.replace('{title}', artwork?.title || 'your artwork');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const buildInstagramUrl = (channels = DEFAULT_CHANNELS) =>
  channels.instagram_url || DEFAULT_CHANNELS.instagram_url;

export default { buildWhatsAppUrl, buildInstagramUrl, DEFAULT_CHANNELS };
