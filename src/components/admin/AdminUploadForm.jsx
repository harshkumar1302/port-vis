import ImageDropzone from './ImageDropzone';

const Field = ({ label, hint, children, required }) => (
  <div className="upload-field">
    <label className="upload-label">
      {label}
      {required && <span className="upload-required">*</span>}
    </label>
    {children}
    {hint && <p className="upload-hint">{hint}</p>}
  </div>
);

const TypeCard = ({ active, onClick, title, desc, emoji }) => (
  <button type="button" onClick={onClick} className={`upload-type-card ${active ? 'is-active' : ''}`}>
    <span className="upload-type-emoji" aria-hidden>{emoji}</span>
    <span className="upload-type-title">{title}</span>
    <span className="upload-type-desc">{desc}</span>
  </button>
);

const BadgeToggle = ({ active, onClick, label }) => (
  <button type="button" onClick={onClick} className={`upload-badge-toggle ${active ? 'is-active' : ''}`}>
    {label}
  </button>
);

/**
 * Polished upload form for gallery & shop admin.
 * @param {{ mode: 'gallery'|'shop', upload: object, categoryDefinitions: array, onCancel?: () => void }} props
 */
const AdminUploadForm = ({ mode, upload, categoryDefinitions, onCancel }) => {
  const isGallery = mode === 'gallery';
  const isEditing = Boolean(upload.editingId);

  const subCategory =
    upload.subCategory || upload.subCategoryOverrideRef?.current || '';

  const catDef = categoryDefinitions.find(
    (c) =>
      c.label?.trim().toLowerCase() === upload.category?.trim().toLowerCase() ||
      c.id?.trim().toLowerCase() === upload.category?.trim().toLowerCase()
  );

  const handleFile = (file) => {
    upload.handleFileChange({ target: { files: [file] } });
  };

  const submitLabel = upload.uploading
    ? 'Saving…'
    : upload.success
      ? 'Saved ✓'
      : isEditing
        ? isGallery
          ? 'Save changes'
          : 'Update product'
        : isGallery
          ? 'Publish to gallery'
          : 'Publish to shop';

  return (
    <div className="upload-shell card-ghibli">
      <header className="upload-header">
        <div>
          <p className="upload-header-eyebrow">{isGallery ? 'Gallery' : 'Shop'}</p>
          <h2 className="upload-header-title">
            {isEditing
              ? isGallery
                ? 'Edit gallery piece'
                : 'Edit product'
              : isGallery
                ? 'New gallery piece'
                : 'New product'}
          </h2>
        </div>
        {isEditing && onCancel && (
          <button type="button" onClick={onCancel} className="upload-cancel-btn">
            Cancel edit
          </button>
        )}
      </header>

      <form onSubmit={upload.handleUpload} className="upload-form">
        <div className="upload-layout">
          {/* ── Left: photo ── */}
          <aside className="upload-photo-col">
            <Field label="Cover photo" required={!isEditing}>
              <ImageDropzone
                previewUrl={upload.previewUrl}
                onFile={handleFile}
                onClear={upload.previewUrl ? upload.clearImage : null}
                required={!isEditing}
                editing={isEditing}
              />
            </Field>

            {(upload.previewUrl || upload.title) && (
              <div className="upload-live-preview" aria-hidden>
                <p className="upload-live-label">Preview</p>
                <div className="upload-live-card">
                  {upload.previewUrl && (
                    <div className="upload-live-thumb">
                      <img src={upload.previewUrl} alt="" />
                    </div>
                  )}
                  <div className="upload-live-body">
                    <p className="upload-live-title">{upload.title || 'Untitled'}</p>
                    <p className="upload-live-meta">
                      {upload.category || (isGallery && upload.uploadType === 'upcoming' ? 'Upcoming' : 'Category')}
                      {!isGallery && upload.price ? ` · ₹${Number(upload.price).toLocaleString('en-IN')}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* ── Right: fields ── */}
          <div className="upload-fields-col">
            {isGallery && (
              <section className="upload-section">
                <h3 className="upload-section-title">Piece type</h3>
                <div className="upload-type-grid">
                  <TypeCard
                    active={upload.uploadType === 'gallery'}
                    onClick={() => upload.setUploadType('gallery')}
                    emoji="🏞️"
                    title="Gallery"
                    desc="Shows in your portfolio"
                  />
                  <TypeCard
                    active={upload.uploadType === 'featured'}
                    onClick={() => upload.setUploadType('featured')}
                    emoji="⭐"
                    title="Featured"
                    desc="Highlighted in gallery"
                  />
                  <TypeCard
                    active={upload.uploadType === 'upcoming'}
                    onClick={() => upload.setUploadType('upcoming')}
                    emoji="⏳"
                    title="Upcoming"
                    desc="Coming soon teaser"
                  />
                </div>
              </section>
            )}

            <section className="upload-section">
              <h3 className="upload-section-title">Details</h3>
              <div className="upload-fields-stack">
                <Field label={isGallery ? 'Title' : 'Product name'} hint={isGallery ? 'Optional but recommended' : undefined}>
                  <input
                    type="text"
                    value={upload.title}
                    onChange={(e) => upload.setTitle(e.target.value)}
                    className="upload-input"
                    placeholder={isGallery ? 'e.g. Radha Krishna Madhubani' : 'e.g. Mandala wall plate'}
                  />
                </Field>

                <Field label={isGallery ? 'Story' : 'Description'} hint="Shown on the detail page">
                  <textarea
                    value={upload.desc}
                    onChange={(e) => upload.setDesc(e.target.value)}
                    className="upload-textarea"
                    rows={4}
                    placeholder="Materials, size, inspiration…"
                  />
                </Field>
              </div>
            </section>

            {(isGallery ? upload.uploadType !== 'upcoming' : true) && (
              <section className="upload-section">
                <h3 className="upload-section-title">Category</h3>
                <div className="upload-row-2">
                  <Field label="Main category" required>
                    <select
                      value={upload.category}
                      onChange={(e) => upload.setCategory(e.target.value)}
                      className="upload-select"
                      required
                    >
                      <option value="" disabled>Select category</option>
                      {categoryDefinitions.map((cat) => (
                        <option key={cat.id} value={cat.label}>{cat.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Sub-category">
                    <select
                      value={subCategory}
                      onChange={(e) => upload.setSubCategory(e.target.value)}
                      className="upload-select"
                    >
                      <option value="">None</option>
                      {catDef?.subCategories?.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </section>
            )}

            {!isGallery && (
              <>
                <section className="upload-section">
                  <h3 className="upload-section-title">Pricing & inventory</h3>
                  <div className="upload-row-3">
                    <Field label="Sale price (₹)" required>
                      <input
                        type="number"
                        min="0"
                        value={upload.price}
                        onChange={(e) => upload.setPrice(e.target.value)}
                        className="upload-input"
                        placeholder="799"
                        required
                      />
                    </Field>
                    <Field label="Original price (₹)" hint="Shows discount if higher">
                      <input
                        type="number"
                        min="0"
                        value={upload.originalPrice}
                        onChange={(e) => upload.setOriginalPrice(e.target.value)}
                        className="upload-input"
                        placeholder="999"
                      />
                    </Field>
                    <Field label="Stock" hint="Empty = unlimited">
                      <input
                        type="number"
                        min="0"
                        value={upload.stock}
                        onChange={(e) => upload.setStock(e.target.value)}
                        className="upload-input"
                        placeholder="∞"
                      />
                    </Field>
                  </div>
                </section>

                <section className="upload-section">
                  <h3 className="upload-section-title">Shop badges</h3>
                  <div className="upload-badge-row">
                    <BadgeToggle
                      label="Featured"
                      active={upload.isFeatured}
                      onClick={() => upload.setIsFeatured(!upload.isFeatured)}
                    />
                    <BadgeToggle
                      label="Bestseller"
                      active={upload.isBestseller}
                      onClick={() => upload.setIsBestseller(!upload.isBestseller)}
                    />
                    <BadgeToggle
                      label="New launch"
                      active={upload.isNew}
                      onClick={() => upload.setIsNew(!upload.isNew)}
                    />
                  </div>
                </section>
              </>
            )}
          </div>
        </div>

        <footer className="upload-footer">
          <p className="upload-footer-note">
            {isGallery
              ? 'Publishes to /gallery · separate from shop products'
              : 'Publishes to /shop · requires a price'}
          </p>
          <button
            type="submit"
            disabled={upload.uploading}
            className={`upload-submit ${upload.success ? 'is-success' : ''}`}
          >
            {submitLabel}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AdminUploadForm;
