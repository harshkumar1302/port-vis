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
      onClick={onClick}
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
