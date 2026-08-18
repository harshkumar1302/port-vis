/** Mithi — warm studio guide (rule-based, no external AI) */

export const MITHI_NAME = 'Mithi';
export const MITHI_TAGLINE = 'your friend from the studio';

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/** Topic definitions — reply can be a string or (ctx) => string */
export const TOPICS = {
  intro: {
    id: 'intro',
    label: 'Menu',
    reply: (ctx) =>
      `${getGreeting()}! I'm ${MITHI_NAME} ${MITHI_TAGLINE}. 🌿\n\nWhat brings you here today?`,
    actions: () => MAIN_MENU.map((t) => ({ type: 'topic', topic: t.id, label: t.label })),
  },
  browse: {
    id: 'browse',
    label: '🎨 Browse collections',
    reply:
      'We have mandalas, miniatures, gift pieces, and DIY art — each made slowly by hand. Pick a collection below, or head to the shop.',
    actions: (ctx) => [
      { type: 'link', label: 'Open shop', href: '/shop' },
      { type: 'link', label: 'See gallery', href: '/gallery' },
      ...categoryLinks(ctx.categories),
    ],
  },
  custom: {
    id: 'custom',
    label: '✨ Custom piece',
    reply:
      "We'd love to make something just for you — a mandala, a miniature set, or a gift for someone special. Share a few details and Vishakha will reply personally.",
    actions: () => [
      { type: 'form', label: 'Tell us your idea', topic: 'custom' },
      { type: 'whatsapp', label: 'Chat on WhatsApp' },
    ],
  },
  shipping: {
    id: 'shipping',
    label: '🎁 Gifts & delivery',
    reply:
      'Every order comes with a little gift from us. Free delivery on orders above ₹799. Each piece is packed with care so it reaches you safely across India.',
    actions: () => [
      { type: 'topic', label: 'How do I place an order?', topic: 'order' },
      { type: 'link', label: 'Browse gift ideas', href: '/shop?category=gift' },
    ],
  },
  order: {
    id: 'order',
    label: '💬 How to order',
    reply:
      "Pick a piece you like, add it to your cart, and checkout — or tap WhatsApp on any card. We'll share price, availability, and delivery details there. Simple and personal.",
    actions: () => [
      { type: 'link', label: 'Go to shop', href: '/shop' },
      { type: 'link', label: 'View cart', href: '/cart' },
      { type: 'whatsapp', label: 'Message on WhatsApp' },
    ],
  },
  price: {
    id: 'price',
    label: '💛 Prices & offers',
    reply:
      "Prices vary by piece — you'll see them on shop items and featured picks. Look out for seasonal offers and a free gift with every order.",
    actions: () => [
      { type: 'link', label: 'Browse featured picks', href: '/shop' },
      { type: 'whatsapp', label: 'Ask on WhatsApp' },
    ],
  },
  cart: {
    id: 'cart',
    label: '🛒 Your cart',
    reply: (ctx) => {
      if (!ctx.cartCount) {
        return "Your cart is empty right now — browse the shop and tap the heart or cart icon on anything you love.";
      }
      const items = ctx.cartCount === 1 ? '1 item' : `${ctx.cartCount} items`;
      return `You have ${items} in your cart. Ready to checkout? I'll take you there, or you can keep browsing.`;
    },
    actions: (ctx) => {
      if (!ctx.cartCount) {
        return [
          { type: 'link', label: 'Browse shop', href: '/shop' },
          { type: 'topic', label: 'How do I order?', topic: 'order' },
        ];
      }
      return [
        { type: 'link', label: 'Go to checkout', href: '/checkout' },
        { type: 'link', label: 'View cart', href: '/cart' },
        { type: 'whatsapp', label: 'Order on WhatsApp' },
      ];
    },
  },
  wishlist: {
    id: 'wishlist',
    label: '💝 Saved pieces',
    reply: (ctx) => {
      if (!ctx.wishlistCount) {
        return "You haven't saved anything yet — tap the heart on any piece while you browse. I'll keep them here for you.";
      }
      const n = ctx.wishlistCount === 1 ? '1 saved piece' : `${ctx.wishlistCount} saved pieces`;
      return `You have ${n} on your wishlist. Move favourites to your cart whenever you're ready.`;
    },
    actions: (ctx) => [
      { type: 'link', label: ctx.wishlistCount ? 'Open wishlist' : 'Browse shop', href: ctx.wishlistCount ? '/wishlist' : '/shop' },
      { type: 'link', label: 'Go to shop', href: '/shop' },
    ],
  },
  contact: {
    id: 'contact',
    label: '📬 Contact the studio',
    reply:
      'You can write to us on the contact page, leave a note here, or message on WhatsApp — Vishakha reads everything herself.',
    actions: () => [
      { type: 'link', label: 'Contact page', href: '/contact' },
      { type: 'form', label: 'Leave a note', topic: 'note' },
      { type: 'whatsapp', label: 'WhatsApp' },
    ],
  },
  newsletter: {
    id: 'newsletter',
    label: '📧 Studio updates',
    reply:
      "Join our list for new collections, seasonal offers, and studio stories — no spam, just gentle updates from Vishakha.",
    actions: () => [
      { type: 'link', label: 'Join from footer', href: '/#contact' },
      { type: 'link', label: 'Browse shop', href: '/shop' },
    ],
  },
  note: {
    id: 'note',
    label: '📝 Leave a note',
    reply: 'Drop your name and message below — Vishakha reads every note herself and replies as soon as she can.',
    actions: () => [{ type: 'form', label: 'Write your message', topic: 'note' }],
  },
  thanks: {
    id: 'thanks',
    label: 'Thanks',
    reply: "You're so welcome. 🌸 If anything else comes to mind, I'm right here.",
    actions: () => [{ type: 'topic', label: 'Back to menu', topic: 'intro' }],
  },
  unknown: {
    id: 'unknown',
    label: 'Help',
    reply:
      "I'm not quite sure about that one — but I can help you browse, order, check your cart, or leave a note for Vishakha.",
    actions: () => [
      { type: 'topic', label: 'Browse collections', topic: 'browse' },
      { type: 'topic', label: 'How to order', topic: 'order' },
      { type: 'form', label: 'Leave a note', topic: 'note' },
    ],
  },
};

export const FORM_PRESETS = {
  custom: { message: "Hi Vishakha! I'm interested in a custom piece. " },
  note: { message: '' },
};

export const MAIN_MENU = [
  { id: 'browse', label: TOPICS.browse.label },
  { id: 'custom', label: TOPICS.custom.label },
  { id: 'order', label: TOPICS.order.label },
  { id: 'cart', label: TOPICS.cart.label },
  { id: 'note', label: TOPICS.note.label },
];

const INTENT_RULES = [
  { topic: 'thanks', patterns: [/\b(thank|thanks|thankyou|dhanyavad|shukriya)\b/i] },
  { topic: 'cart', patterns: [/\b(cart|checkout|bag|basket|place order|my order)\b/i] },
  { topic: 'wishlist', patterns: [/\b(wishlist|saved|favourite|favorite|heart)\b/i] },
  { topic: 'custom', patterns: [/\b(custom|personalised|personalized|commission|nameplate|bespoke|made for me)\b/i] },
  { topic: 'shipping', patterns: [/\b(ship|shipping|deliver|delivery|dispatch|courier|packaging|gift wrap)\b/i] },
  { topic: 'price', patterns: [/\b(price|prices|cost|how much|₹|rs\.?\s*\d|offer|discount)\b/i] },
  { topic: 'order', patterns: [/\b(how (do i|to) order|how can i buy|purchase|buy|enquire|inquire)\b/i] },
  { topic: 'newsletter', patterns: [/\b(newsletter|subscribe|mailing list|email updates|studio updates)\b/i] },
  { topic: 'contact', patterns: [/\b(contact|email|reach|call|vishakha|studio email)\b/i] },
  { topic: 'browse', patterns: [/\b(browse|shop|collection|gallery|mandala|miniature|gopi|frame|magnet|keychain|brooch|garland|bottle|tote|diy)\b/i] },
  { topic: 'intro', patterns: [/^(hi|hello|hey|hii|namaste|good morning|good afternoon|good evening|howdy)\b/i] },
];

const categoryLinks = (categories = []) =>
  categories.slice(0, 4).map((cat) => ({
    type: 'link',
    label: cat.label,
    href: `/shop?category=${cat.id}`,
  }));

const resolveReply = (topicId, ctx = {}) => {
  const topic = TOPICS[topicId] || TOPICS.unknown;
  const reply = topic.reply;
  return typeof reply === 'function' ? reply(ctx) : reply;
};

const resolveActions = (topicId, ctx = {}) => {
  const topic = TOPICS[topicId] || TOPICS.unknown;
  const actions = topic.actions;
  return typeof actions === 'function' ? actions(ctx) : actions || [];
};

/** Match free-text to a topic id */
export const matchIntent = (text, categories = []) => {
  const trimmed = text.trim();
  if (!trimmed) return 'unknown';

  for (const rule of INTENT_RULES) {
    if (rule.patterns.some((p) => p.test(trimmed))) return rule.topic;
  }

  // Category name in message → browse with hint
  const lower = trimmed.toLowerCase();
  const matchedCat = categories.find(
    (c) =>
      lower.includes(c.id?.toLowerCase()) ||
      lower.includes(c.label?.toLowerCase())
  );
  if (matchedCat) return 'browse';

  return 'unknown';
};

export const getTopicReply = (topicId, ctx = {}) => resolveReply(topicId, ctx);

export const getTopicActions = (topicId, ctx = {}) => resolveActions(topicId, ctx);

export const getTopicLabel = (topicId) => TOPICS[topicId]?.label?.replace(/^[^\s]+\s/, '') || 'General';

/** Build lead message with topic tag for admin */
export const formatLeadMessage = (topicId, message) => {
  const tag = getTopicLabel(topicId);
  const body = message.trim();
  if (!body) return `[${tag}]`;
  return body.startsWith('[') ? body : `[${tag}]\n${body}`;
};

/** Suggested quick chips shown above the input */
export const getQuickChips = (ctx = {}) => {
  const chips = [];
  if (ctx.cartCount > 0) chips.push({ topic: 'cart', label: `Cart (${ctx.cartCount})` });
  if (ctx.wishlistCount > 0) chips.push({ topic: 'wishlist', label: 'Wishlist' });
  chips.push(
    { topic: 'browse', label: 'Shop' },
    { topic: 'order', label: 'How to order' },
    { topic: 'custom', label: 'Custom piece' },
  );
  return chips.slice(0, 4);
};
