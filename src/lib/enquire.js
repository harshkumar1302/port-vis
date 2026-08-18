import {
  SITE_WHATSAPP_NUMBER,
  SITE_WHATSAPP_DISPLAY,
} from '../constants/site';
import { getAbsolutePieceUrl } from './pieceUrls';
import { buildCanonical } from './seo';

export { SITE_WHATSAPP_NUMBER, SITE_WHATSAPP_DISPLAY };

export const WHATSAPP_ENABLED = true;

export const DEFAULT_CHANNELS = {
  instagram_url: 'https://www.instagram.com/visheshkalaa/',
  whatsapp_number: SITE_WHATSAPP_NUMBER,
  whatsapp_message_template: 'Hi! I saw {title} on Visheshkala and would love to know more.',
};

/** Where the enquire button was tapped */
export const ENQUIRE_SOURCES = {
  'gallery-home': 'Homepage Gallery',
  gallery: 'Gallery category',
  'gallery-piece': 'Gallery piece page',
  'wishlist-gallery': 'Wishlist (gallery piece)',
  'wishlist-shop': 'Wishlist (shop product)',
  shop: 'Shop',
  product: 'Shop product page',
  contact: 'Contact page',
  chatbot: 'Website chat',
  cart: 'Cart',
  checkout: 'Checkout',
};

const GENERIC_ONLY_SOURCES = new Set(['contact', 'chatbot']);

const digitsOnly = (value) => (value || '').replace(/\D/g, '');

const isPieceEnquiry = (source) =>
  Boolean(source) &&
  !GENERIC_ONLY_SOURCES.has(source) &&
  (source.includes('gallery') ||
    source.includes('wishlist') ||
    source.includes('shop') ||
    source === 'product' ||
    source === 'cart' ||
    source === 'checkout');

/** Merge admin settings with site defaults so WhatsApp stays live */
export const resolveContactChannels = (channels = {}) => {
  const merged = { ...DEFAULT_CHANNELS, ...channels };
  const number = digitsOnly(channels.whatsapp_number) || DEFAULT_CHANNELS.whatsapp_number;
  return { ...merged, whatsapp_number: number };
};

const resolvePageUrl = (art, options = {}) => {
  const { pageUrl: pageUrlOverride, slug, source = 'site' } = options;
  if (pageUrlOverride) return pageUrlOverride;
  const fromArt = getAbsolutePieceUrl(art);
  if (fromArt) return fromArt;
  if (!slug) return null;
  const path =
    source.includes('shop') || source === 'product'
      ? `/shop/${slug}`
      : `/gallery/piece/${slug}`;
  return buildCanonical(path);
};

/** Short WhatsApp message — greeting, piece link, and ask */
export const buildEnquireMessage = (artwork, options = {}) => {
  const art = artwork ?? {};
  const { source = 'site', sourceLabel } = options;
  const fromLabel = sourceLabel || ENQUIRE_SOURCES[source] || 'Visheshkala website';
  const pageUrl = resolvePageUrl(art, options);

  if (GENERIC_ONLY_SOURCES.has(source)) {
    return `Hi Visheshkala!\n\nI reached out from your ${fromLabel} and would love to connect.\n\nThank you!`;
  }

  if (isPieceEnquiry(source)) {
    const lines = [
      'Hi Visheshkala!',
      '',
      "I'd love to know more about this piece:",
      '',
    ];
    if (pageUrl) lines.push(`Link: ${pageUrl}`);
    lines.push('', 'Could you share price, availability, and delivery details?', '', 'Thank you!');
    return lines.join('\n');
  }

  const template = DEFAULT_CHANNELS.whatsapp_message_template;
  return template.replace('{title}', art.title || 'your artwork');
};

export const buildWhatsAppUrl = (artwork, channels = {}, options = {}) => {
  if (!WHATSAPP_ENABLED) return null;
  const merged = resolveContactChannels(channels);
  const number = digitsOnly(merged.whatsapp_number);
  if (!number) return null;

  const message =
    options.message ||
    (options.source || isPieceEnquiry(options.source)
      ? buildEnquireMessage(artwork, options)
      : DEFAULT_CHANNELS.whatsapp_message_template.replace(
          '{title}',
          artwork?.title || 'your artwork'
        ));

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const buildInstagramUrl = (channels = {}) =>
  resolveContactChannels(channels).instagram_url || DEFAULT_CHANNELS.instagram_url;

export const hasWhatsApp = (channels = {}) =>
  WHATSAPP_ENABLED && Boolean(digitsOnly(resolveContactChannels(channels).whatsapp_number));

export default {
  buildWhatsAppUrl,
  buildEnquireMessage,
  buildInstagramUrl,
  hasWhatsApp,
  resolveContactChannels,
  DEFAULT_CHANNELS,
  ENQUIRE_SOURCES,
};
