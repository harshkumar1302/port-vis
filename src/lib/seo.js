/** Canonical site URL — use www to match live domain */
import { titleToSlug } from './categoryUtils';

export const SITE_URL = 'https://www.visheshkala.com';
export const SITE_NAME = 'Visheshkala';
export const SITE_TAGLINE = 'Handmade Mandalas, Miniatures & Gifts by Vishakha Garg';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-preview.jpg`;

/** Brand + product keywords including common user misspellings & search variants */
export const SEO_KEYWORDS = [
  // Brand
  'Visheshkala', 'Vishesh Kala', 'Visheshkala art', 'Visheshkalaa', 'Vishesh Kala studio',
  'Vishakha Garg', 'Vishakha Garg artist', 'Vishaka Garg', 'Vishakha Garg handmade art',
  // Categories
  'handmade mandala art', 'mandala wall art', 'dot mandala', 'Gopi dot art', 'Gopi dots',
  'handmade miniatures', 'clay miniatures', 'miniature art India',
  'handmade gifts India', 'Indian handmade gifts', 'personalized handmade gifts',
  'vintage frame art', 'handmade fridge magnets', 'clay bookmarks', 'wooden bookmarks',
  'handmade keychains', 'handmade brooch', 'handmade garlands', 'bottle art',
  'handmade tote bags', 'car hanging decor', 'MDF board DIY', 'handmade backdrops',
  // Intent
  'custom mandala commission', 'handmade art for home decor', 'handmade art shop India',
  'meaningful handmade gifting', 'slow made art', 'handcrafted art gifts',
  // Misspellings users type
  'hand made art', 'hand-crafted gifts', 'mandla art', 'minitures clay',
  'broach handmade', 'book marks clay', 'vishesh kala art',
].join(', ');

export const CATEGORY_SEO = {
  mandala: {
    title: 'Mandala Art — Handmade Dot & Wall Mandalas',
    description:
      'Shop handmade mandala art by Vishakha Garg — flower mandalas, creative mandalas, wall mandalas & Gopi dot work. Slow-made, one-of-a-kind pieces from Visheshkala, India.',
    keywords: 'mandala art, dot mandala, Gopi dots, wall mandala, handmade mandala India, mandla art',
  },
  miniature: {
    title: 'Handmade Miniatures & Clay Sets',
    description:
      'Discover handmade miniatures and clay art sets by Visheshkala. Detailed small-scale art and clay collections crafted by Vishakha Garg — perfect for gifting and display.',
    keywords: 'handmade miniatures, clay miniatures, miniature art India, minitures, clay sets',
  },
  gift: {
    title: 'Handmade Gifts — Frames, Magnets, Keychains & More',
    description:
      'Unique handmade gifts from Visheshkala: vintage frames, fridge magnets, keychains, brooches, garlands, Gopi dots, bottle art, tote bags & car hangings. Made in India with love.',
    keywords: 'handmade gifts India, vintage frames, fridge magnets, keychains, brooch handmade, broach',
  },
  diy: {
    title: 'DIY Art — Bookmarks, MDF Boards & Backdrops',
    description:
      'DIY art supplies and handmade blanks from Visheshkala — clay bookmarks, wooden bookmarks, stick bookmarks, MDF boards and backdrops for your creative projects.',
    keywords: 'DIY art India, clay bookmarks, wooden bookmarks, MDF boards, book marks clay',
  },
};

export const GALLERY_CATEGORY_SEO = {
  mandala: 'Mandala Art Gallery — Handmade Masterpieces',
  miniature: 'Miniatures Gallery — Clay & Small-Scale Art',
  gift: 'Gift Art Gallery — Handmade Decor & Keepsakes',
  diy: 'DIY Art Gallery — Bookmarks & Craft Blanks',
};

export const PAGE_SEO = {
  home: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      'Visheshkala by Vishakha Garg — handmade mandala art, miniatures, vintage frames, Gopi dots, clay gifts & DIY art. Slow-made pieces for homes and meaningful gifting across India.',
    path: '/',
  },
  shop: {
    title: `Shop Handmade Art | ${SITE_NAME}`,
    description:
      'Browse the Visheshkala shop — handmade mandalas, miniatures, gift materials and DIY art by visual artist Vishakha Garg. Every piece shaped slowly by hand.',
    path: '/shop',
  },
  gallery: {
    title: `Art Gallery — Handmade Portfolio | ${SITE_NAME}`,
    description:
      'Explore the Visheshkala gallery — a curated showcase of mandala art, miniatures, gifts and DIY pieces handmade by Vishakha Garg. Devotion meets detail in every work.',
    path: '/gallery',
  },
  about: {
    title: `About Vishakha Garg — The ${SITE_NAME} Story`,
    description:
      'Meet Vishakha Garg, visual artist and founder of Visheshkala. Specializing in paintings, handmade miniatures, mandala art and custom clay works — art made slowly, with intention.',
    path: '/about',
  },
  contact: {
    title: `Contact ${SITE_NAME} — Custom Commissions & Inquiries`,
    description:
      'Get in touch with Visheshkala for custom mandala commissions, handmade gifts, order questions and collaborations. Reach Vishakha Garg via Instagram or our contact form.',
    path: '/contact',
  },
  privacy: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'How Visheshkala collects and protects your personal information when you browse, enquire, or order handmade art.',
    path: '/privacy',
  },
  notFound: {
    title: `Page Not Found | ${SITE_NAME}`,
    description: 'The page you are looking for could not be found. Browse handmade art at Visheshkala.',
    path: '/404',
    noindex: true,
  },
};

export const NOINDEX_PATHS = ['/admin', '/cart', '/wishlist', '/reset-password'];

export function buildCanonical(path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${clean}`;
}

export function buildProductTitle(productTitle) {
  return `${productTitle} | Handmade Art | ${SITE_NAME}`;
}

export function buildProductDescription(art) {
  const category = art?.category ? ` ${art.category} —` : '';
  const title = art?.title || 'Handmade artwork';
  return `${title} —${category} handmade by Vishakha Garg at Visheshkala. Slow-made art for gifting and home decor. Enquire for price and availability.`;
}

export function buildProductJsonLd(art) {
  if (!art?.title) return null;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: art.title,
    brand: { '@type': 'Brand', name: SITE_NAME },
    manufacturer: { '@type': 'Person', name: 'Vishakha Garg' },
    url: buildCanonical(`/shop/${art.slug || titleToSlug(art.title, art.id)}`),
  };
  if (art.image_url) ld.image = art.image_url;
  if (art.description) {
    ld.description = art.description
      .replace(/\[FEATURED\]/g, '')
      .replace(/\[SubCategory:.*?\]/g, '')
      .trim()
      .slice(0, 500);
  }
  if (art.category) ld.category = art.category;
  if (art.price) {
    ld.offers = {
      '@type': 'Offer',
      price: String(art.price),
      priceCurrency: 'INR',
      availability: art.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: SITE_NAME },
    };
  }
  return ld;
}

export function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does Visheshkala sell?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Visheshkala offers handmade mandala art, miniatures, vintage frames, Gopi dots, clay bookmarks, keychains, brooches, garlands, tote bags, car hangings, and DIY art supplies — all crafted by Vishakha Garg.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Visheshkala accept custom orders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Vishakha Garg accepts custom mandala commissions and personalized handmade gifts. Contact Visheshkala via Instagram or the contact form to discuss your idea.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Visheshkala based?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Visheshkala is an Indian handmade art studio founded by visual artist Vishakha Garg, shipping thoughtful art and gifts across India.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I order from Visheshkala?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Browse the shop, add pieces to your cart, or enquire via Instagram. Visheshkala offers personal, slow-made art — not mass-produced shelf goods.',
        },
      },
    ],
  };
}
