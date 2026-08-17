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
    <div className="upload-dropzone-wrap">
      <div
        className={`upload-dropzone ${dragOver ? 'is-dragover' : ''} ${previewUrl ? 'has-preview' : ''}`}
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
            <img src={previewUrl} alt="" className="upload-dropzone-preview" />
            <div className="upload-dropzone-overlay">
              <span>Click or drop to replace</span>
            </div>
          </>
        ) : (
          <div className="upload-dropzone-empty">
            <div className="upload-dropzone-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 16V4m0 0 8 4m-8-4-8 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20h16a1 1 0 0 0 1-1v-5.5a1 1 0 0 0-.3-.7l-5.4-4.5a1 1 0 0 0-1.4.1L9.6 13 7.3 11.2A1 1 0 0 0 6 11.5V19a1 1 0 0 0 1 1Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="upload-dropzone-title">Drop your photo here</p>
            <p className="upload-dropzone-hint">or click to browse · JPG, PNG, WebP · max 10 MB</p>
          </div>
        )}
      </div>

      {previewUrl && onClear && (
        <button type="button" className="upload-dropzone-remove" onClick={(e) => { e.stopPropagation(); onClear(); }}>
          Remove photo
        </button>
      )}

      {editing && !required && (
        <p className="upload-dropzone-note">Leave unchanged to keep the current image.</p>
      )}
    </div>
  );
};

export default ImageDropzone;
