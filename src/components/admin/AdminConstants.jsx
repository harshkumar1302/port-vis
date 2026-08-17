export const dashboardTabs = [
  { id: 'overview', label: 'Home', shortLabel: 'Home', icon: 'home', description: 'Quick overview and shortcuts to manage your studio.' },
  { id: 'gallery', label: 'Gallery', shortLabel: 'Gallery', icon: 'grid', description: 'Portfolio for /gallery — add piece, browse, or manage categories.' },
  { id: 'shop', label: 'Shop', shortLabel: 'Shop', icon: 'bag', description: 'Products for /shop — add product, browse, or manage categories.' },
  { id: 'reviews', label: 'Testimonials', shortLabel: 'Reviews', icon: 'heart', description: 'Collector stories and testimonials.' },
  { id: 'leads', label: 'Inquiries', shortLabel: 'Leads', icon: 'message', description: 'Contact form, cart orders, chatbot, and newsletter.' },
  { id: 'site', label: 'Settings', shortLabel: 'Settings', icon: 'settings', description: 'Announcement bar, WhatsApp, and hero stats.' },
];

export const DashboardIcon = ({ name, className = 'w-5 h-5' }) => {
  const paths = {
      grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
      home: <><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" /></>,
      bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
      heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
      message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.3 8.3 0 0 1-3.6-.8L4 20l1.4-3.5A7.3 7.3 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
      settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
      arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  };

  return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {paths[name]}
      </svg>
  );
};
