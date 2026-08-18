const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  destructive = true,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-ghibli-charcoal/45 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close dialog"
        disabled={loading}
      />
      <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl border border-white/40 rounded-[1.5rem] shadow-[0_20px_60px_rgba(44,36,32,0.18)] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-serif text-xl font-bold text-ghibli-charcoal mb-2">{title}</h3>
        <p className="text-sm text-ghibli-charcoal/70 leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest text-ghibli-charcoal/70 bg-white border border-ghibli-wood/15 hover:bg-ghibli-cream transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest text-white transition-colors disabled:opacity-50 ${
              destructive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-ghibli-wood hover:bg-[#8B6048]'
            }`}
          >
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
