import {
  SITE_WHATSAPP_NUMBER,
  SITE_WHATSAPP_DISPLAY,
} from '../constants/site';

export { SITE_WHATSAPP_NUMBER, SITE_WHATSAPP_DISPLAY };

export const WHATSAPP_ENABLED = true;

export const DEFAULT_CHANNELS = {
  instagram_url: 'https://www.instagram.com/visheshkalaa/',
  whatsapp_number: SITE_WHATSAPP_NUMBER,
  whatsapp_message_template: 'Hi! I saw {title} on Visheshkala and would love to know more.',
};

const digitsOnly = (value) => (value || '').replace(/\D/g, '');

/** Merge admin settings with site defaults so WhatsApp stays live */
export const resolveContactChannels = (channels = {}) => {
  const merged = { ...DEFAULT_CHANNELS, ...channels };
  const number = digitsOnly(channels.whatsapp_number) || DEFAULT_CHANNELS.whatsapp_number;
  return { ...merged, whatsapp_number: number };
};

export const buildWhatsAppUrl = (artwork, channels = {}) => {
  if (!WHATSAPP_ENABLED) return null;
  const merged = resolveContactChannels(channels);
  const number = digitsOnly(merged.whatsapp_number);
  if (!number) return null;
  const template = merged.whatsapp_message_template || DEFAULT_CHANNELS.whatsapp_message_template;
  const message = template.replace('{title}', artwork?.title || 'your artwork');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const buildInstagramUrl = (channels = {}) =>
  resolveContactChannels(channels).instagram_url || DEFAULT_CHANNELS.instagram_url;

export const hasWhatsApp = (channels = {}) =>
  WHATSAPP_ENABLED && Boolean(digitsOnly(resolveContactChannels(channels).whatsapp_number));

export default {
  buildWhatsAppUrl,
  buildInstagramUrl,
  hasWhatsApp,
  resolveContactChannels,
  DEFAULT_CHANNELS,
};
