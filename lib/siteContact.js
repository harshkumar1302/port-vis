/** Primary studio contact — used in API notification emails */
export const SITE_EMAIL = 'visheshkalaofficial@gmail.com';

export const SITE_WHATSAPP_NUMBER = '917310956254';

export const DEFAULT_CONTACT_CHANNELS = {
  instagram_url: 'https://www.instagram.com/visheshkalaa/',
  whatsapp_number: SITE_WHATSAPP_NUMBER,
  whatsapp_message_template: 'Hi! I saw {title} on Visheshkala and would love to know more.',
};

export const siteEmailFrom = () => `Visheshkala <${SITE_EMAIL}>`;
