/** WhatsApp is enabled when a number is configured in admin Site Settings */
export const WHATSAPP_ENABLED = true;

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

export const hasWhatsApp = (channels = DEFAULT_CHANNELS) =>
  Boolean((channels.whatsapp_number || '').replace(/\D/g, ''));

export default { buildWhatsAppUrl, buildInstagramUrl, hasWhatsApp, DEFAULT_CHANNELS };
