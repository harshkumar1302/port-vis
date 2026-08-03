/** Flip to true when your WhatsApp number is ready */
export const WHATSAPP_ENABLED = false;

const WhatsAppButton = ({ children, className = '' }) => (
  <button
    type="button"
    disabled
    aria-disabled="true"
    aria-label={`${children} — coming soon`}
    className={`relative group cursor-not-allowed ${className}`}
  >
    <span className="flex items-center justify-center gap-2 pointer-events-none opacity-80">
      <span aria-hidden className="text-sm leading-none">🔒</span>
      {children}
    </span>
    <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-ghibli-charcoal/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      Coming soon
    </span>
  </button>
);

export default WhatsAppButton;
