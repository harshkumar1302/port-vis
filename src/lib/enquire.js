import {
  SITE_WHATSAPP_NUMBER,
  SITE_WHATSAPP_DISPLAY,
} from '../constants/site';
import { formatPriceShop, getSubCategory } from './artwork';
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

const cleanLabel = (value) =>
  (value || '')
    .replace(/\[FEATURED\]/g, '')
    .replace(/\[SubCategory:\s*.*?\]/g, '')
    .trim();

const isPieceEnquiry = (source) =>
  Boolean(source) &&
  !GENERIC_ONLY_SOURCES.has(source) &&
  (source.includes('gallery') ||
    source.includes('wishlist') ||
    source.includes('shop') ||
    source === 'product' ||
    source === 'cart' ||
    source === 'checkout');

const titleFromSlug = (slug) =>
  (slug || '')
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** Merge admin settings with site defaults so WhatsApp stays live */
export const resolveContactChannels = (channels = {}) => {
  const merged = { ...DEFAULT_CHANNELS, ...channels };
  const number = digitsOnly(channels.whatsapp_number) || DEFAULT_CHANNELS.whatsapp_number;
  return { ...merged, whatsapp_number: number };
};

/** Build a detailed WhatsApp message with piece + page context */
export const buildEnquireMessage = (artwork, options = {}) => {
  const art = artwork ?? {};
  const { source = 'site', sourceLabel, pageUrl: pageUrlOverride, slug } = options;
  const fromLabel = sourceLabel || ENQUIRE_SOURCES[source] || 'Visheshkala website';
  const pageUrl =
    pageUrlOverride ||
    getAbsolutePieceUrl(art) ||
    (slug ? buildCanonical(source.includes('shop') || source === 'product' ? `/shop/${slug}` : `/gallery/piece/${slug}`) : null);

  let title = cleanLabel(art.title);
  if (!title && slug) title = titleFromSlug(slug);
  if (!title && pageUrl) title = 'this piece';

  const category = cleanLabel(art.category);
  const subCategory = getSubCategory(art);
  const price = formatPriceShop(art.price);
  const listingType = art.listing_type;

  const isGalleryPiece =
    source.includes('gallery') ||
    listingType === 'gallery' ||
    source === 'wishlist-gallery';
  const isShopPiece =
    source.includes('shop') ||
    source === 'product' ||
    listingType === 'shop';

  if (GENERIC_ONLY_SOURCES.has(source) || (!isPieceEnquiry(source) && !title)) {
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
  if (pageUrl) lines.push(`Link: ${pageUrl}`);

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
    (options.source || isPieceEnquiry(options.source)
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
