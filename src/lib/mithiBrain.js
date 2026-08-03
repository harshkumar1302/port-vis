/** Mithi — warm studio guide logic (no external AI) */

export const MITHI_NAME = 'Mithi';
export const MITHI_TAGLINE = 'your friend from the studio';

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const TOPICS = {
  browse: {
    id: 'browse',
    label: '🎨 Browse the collections',
    reply: "We have mandalas, miniatures, gift pieces, and DIY art — each made by hand. Tap a collection below, or scroll to Shop on the home page.",
    actions: [
      { type: 'link', label: 'See all categories', href: '/shop' },
      { type: 'link', label: 'Featured pieces', href: '#featured' },
    ],
  },
  custom: {
    id: 'custom',
    label: '✨ A custom piece for me',
    reply: "We'd love to make something just for you — a mandala, a miniature set, or a gift for someone special. Share a few details and Vishakha will get back to you personally.",
    actions: [{ type: 'form', label: 'Tell us your idea', topic: 'custom' }],
  },
  shipping: {
    id: 'shipping',
    label: '🎁 Gifts & delivery',
    reply: "Every order comes with a little gift from us. Free delivery on orders above ₹799. Each piece is packed with care so it reaches you safely.",
    actions: [
      { type: 'topic', label: 'How do I place an order?', topic: 'order' },
      { type: 'link', label: 'Browse gift ideas', href: '/shop?category=gift' },
    ],
  },
  order: {
    id: 'order',
    label: '💬 How to order',
    reply: "Pick a piece you like, then tap WhatsApp or Instagram on the card — we'll share price, availability, and delivery details there. Simple and personal.",
    actions: [
      { type: 'link', label: 'See featured picks', href: '#featured' },
      { type: 'whatsapp', label: 'Message on WhatsApp' },
    ],
  },
  price: {
    id: 'price',
    label: '💛 Prices & offers',
    reply: "Prices vary by piece — you'll see them on featured items, or we can share details on WhatsApp. Look out for seasonal offers and a free gift with every order.",
    actions: [
      { type: 'link', label: 'View featured picks', href: '#featured' },
      { type: 'whatsapp', label: 'Ask on WhatsApp' },
    ],
  },
  note: {
    id: 'note',
    label: '📝 Leave a note for Vishakha',
    reply: "Drop your name and message below — Vishakha reads every note herself and replies as soon as she can.",
    actions: [{ type: 'form', label: 'Write your message', topic: 'note' }],
  },
};

export const FORM_PRESETS = {
  custom: {
    message: "Hi Vishakha! I'm interested in a custom piece. ",
  },
  note: {
    message: '',
  },
};

export const MAIN_MENU = [
  TOPICS.browse,
  TOPICS.custom,
  TOPICS.shipping,
  TOPICS.order,
  TOPICS.note,
];

export const getTopicReply = (topicId) => TOPICS[topicId]?.reply || TOPICS.browse.reply;

export const getTopicActions = (topicId) => TOPICS[topicId]?.actions || [];
