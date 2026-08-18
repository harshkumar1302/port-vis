import {
  SITE_WHATSAPP_NUMBER,
  SITE_WHATSAPP_DISPLAY,
} from '../constants/site';
import { formatPriceShop, getSubCategory } from './artwork';

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
  gallery: 'Gallery',
  'wishlist-gallery': 'Wishlist (gallery piece)',
  'wishlist-shop': 'Wishlist (shop product)',
  shop: 'Shop',
  product: 'Shop product page',
  contact: 'Contact page',
  chatbot: 'Website chat',
  cart: 'Cart',
  checkout: 'Checkout',
};

const digitsOnly = (value) => (value || '').replace(/\D/g, '');

const cleanLabel = (value) =>
  (value || '')
    .replace(/\[FEATURED\]/g, '')
    .replace(/\[SubCategory:\s*.*?\]/g, '')
    .trim();

/** Merge admin settings with site defaults so WhatsApp stays live */
export const resolveContactChannels = (channels = {}) => {
  const merged = { ...DEFAULT_CHANNELS, ...channels };
  const number = digitsOnly(channels.whatsapp_number) || DEFAULT_CHANNELS.whatsapp_number;
  return { ...merged, whatsapp_number: number };
};

/** Build a detailed WhatsApp message with piece + page context */
export const buildEnquireMessage = (artwork = {}, options = {}) => {
  const { source = 'site', sourceLabel } = options;
  const fromLabel = sourceLabel || ENQUIRE_SOURCES[source] || 'Visheshkala website';
  const title = cleanLabel(artwork?.title);
  const category = cleanLabel(artwork?.category);
  const subCategory = getSubCategory(artwork);
  const price = formatPriceShop(artwork?.price);
  const listingType = artwork?.listing_type;

  const isGalleryPiece =
    source.includes('gallery') ||
    listingType === 'gallery' ||
    source === 'wishlist-gallery';
  const isShopPiece =
    source.includes('shop') ||
    source === 'product' ||
    listingType === 'shop';

  // General site enquiries (contact page, chatbot, etc.)
  if (!title || source === 'contact' || source === 'chatbot') {
    return `Hi Visheshkala!\n\nI reached out from your ${fromLabel} and would love to connect.\n\nThank you!`;
  }

  const lines = [
    'Hi Visheshkala!',
    '',
    "I'd love to know more about this piece:",
    '',
    `Piece: ${title}`,
  ];

  if (category) lines.push(`Category: ${category}`);
  if (subCategory) lines.push(`Style: ${subCategory}`);

  if (isGalleryPiece) {
    lines.push('Section: Gallery (portfolio piece)');
  } else if (isShopPiece) {
    lines.push('Section: Shop');
    if (price) lines.push(`Listed price: ${price}`);
  }

  lines.push(`Opened from: ${fromLabel}`);

  lines.push('');
  lines.push('Could you share price, availability, and delivery details?');
  lines.push('');
  lines.push('Thank you!');

  return lines.join('\n');
};

export const buildWhatsAppUrl = (artwork, channels = {}, options = {}) => {
  if (!WHATSAPP_ENABLED) return null;
  const merged = resolveContactChannels(channels);
  const number = digitsOnly(merged.whatsapp_number);
  if (!number) return null;

  const template = merged.whatsapp_message_template || DEFAULT_CHANNELS.whatsapp_message_template;
  const message =
    options.message ||
    (options.source
      ? buildEnquireMessage(artwork, options)
      : template.replace('{title}', artwork?.title || 'your artwork'));

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
