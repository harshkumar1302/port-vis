const WhatsAppButton = ({ children, className = '', href, onClick, disabled = false }) => {
  const openWhatsApp = (e) => {
    e.stopPropagation();
    onClick?.(e);
    if (!href || disabled || e.defaultPrevented) return;
    window.open(href, '_blank', 'noopener,noreferrer');
    e.preventDefault();
  };

  if (href && !disabled) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={openWhatsApp}
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
      onClick={openWhatsApp}
      className={`${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      <span className="flex items-center justify-center gap-2">
        <span aria-hidden className="text-sm leading-none">💬</span>
        {children}
      </span>
    </button>
  );
};

export default WhatsAppButton;
