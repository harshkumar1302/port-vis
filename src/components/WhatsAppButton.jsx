const WhatsAppButton = ({ children, className = '', href, onClick, disabled = false }) => {
  if (href && !disabled) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        <span className="flex items-center justify-center gap-2">
          <span aria-hidden className="text-sm leading-none">💬</span>
          {children}
        </span>
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled ? 'true' : undefined}
      aria-label={disabled ? `${children} — coming soon` : undefined}
      onClick={onClick}
      className={`relative group ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
    >
      <span className={`flex items-center justify-center gap-2 ${disabled ? 'pointer-events-none opacity-80' : ''}`}>
        {disabled && <span aria-hidden className="text-sm leading-none">🔒</span>}
        {children}
      </span>
      {disabled && (
        <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-ghibli-charcoal/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Coming soon
        </span>
      )}
    </button>
  );
};

export default WhatsAppButton;
