import { useRef, useState, useCallback } from 'react';

const ImageDropzone = ({ previewUrl, onFile, onClear, required, editing }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const pickFile = (file) => {
    if (!file?.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10 MB');
      return;
    }
    onFile(file);
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      pickFile(e.dataTransfer.files?.[0]);
    },
    [onFile]
  );

  const onInputChange = (e) => {
    pickFile(e.target.files?.[0]);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`aspect-[4/5] rounded-xl cursor-pointer overflow-hidden relative transition-all duration-300 flex items-center justify-center
          ${dragOver ? 'bg-white border-2 border-dashed border-ghibli-wood shadow-sm scale-[0.98]' : ''}
          ${!dragOver && !previewUrl ? 'bg-white/40 border-2 border-dashed border-ghibli-wood/20 hover:bg-white hover:border-ghibli-wood/40' : ''}
          ${previewUrl && !dragOver ? 'border-2 border-solid border-white/60 shadow-sm' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={onInputChange}
          required={required && !previewUrl}
        />

        {previewUrl ? (
          <>
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-ghibli-navy/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
              <span className="text-white text-xs font-bold tracking-wide">Click or drop to replace</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="text-ghibli-wood w-10 h-10 mb-3 opacity-40 transition-transform group-hover:scale-110" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 16V4m0 0 8 4m-8-4-8 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20h16a1 1 0 0 0 1-1v-5.5a1 1 0 0 0-.3-.7l-5.4-4.5a1 1 0 0 0-1.4.1L9.6 13 7.3 11.2A1 1 0 0 0 6 11.5V19a1 1 0 0 0 1 1Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-bold text-ghibli-charcoal mb-1">Drop your photo here</p>
            <p className="text-[0.65rem] font-bold text-ghibli-charcoal/40 uppercase tracking-widest leading-relaxed">or click to browse<br/>JPG, PNG, WebP · max 10 MB</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1">
        {previewUrl && onClear ? (
          <button type="button" className="text-[0.65rem] font-extrabold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors" onClick={(e) => { e.stopPropagation(); onClear(); }}>
            Remove photo
          </button>
        ) : <div />}

        {editing && !required && (
          <p className="text-[0.65rem] font-medium text-ghibli-charcoal/50 text-right">Leave unchanged to keep current.</p>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
