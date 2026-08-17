import ImageDropzone from './ImageDropzone';

const Field = ({ label, hint, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-ghibli-charcoal">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs font-medium text-ghibli-charcoal/50 mt-1">{hint}</p>}
  </div>
);

const TypeCard = ({ active, onClick, title, desc, emoji }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-300 ${
      active
        ? 'bg-white border-ghibli-gold shadow-[0_8px_20px_rgba(0,0,0,0.04)] scale-[1.02]'
        : 'bg-white/40 border-transparent hover:bg-white hover:border-ghibli-gold/30 hover:shadow-sm'
    }`}
  >
    <span className="text-3xl mb-2" aria-hidden>{emoji}</span>
    <span className={`text-sm font-bold mb-1 ${active ? 'text-ghibli-charcoal' : 'text-ghibli-charcoal/70'}`}>{title}</span>
    <span className={`text-[10px] uppercase tracking-wider font-extrabold ${active ? 'text-ghibli-wood' : 'text-ghibli-charcoal/40'}`}>{desc}</span>
  </button>
);

const BadgeToggle = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
      active
        ? 'bg-ghibli-wood border-ghibli-wood text-white shadow-sm'
        : 'bg-white/50 border-white/80 text-ghibli-charcoal/60 hover:bg-white hover:border-ghibli-wood/30'
    }`}
  >
    {label}
  </button>
);

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

  const inputClass = "w-full p-3 bg-white/50 border border-white/80 rounded-xl text-ghibli-charcoal placeholder-ghibli-charcoal/30 focus:outline-none focus:ring-2 focus:ring-ghibli-gold/40 focus:bg-white transition-all shadow-sm font-medium";

  return (
    <div className="card-ghibli bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-[2rem] overflow-hidden">
      <header className="p-6 sm:p-8 border-b border-white/60 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] font-extrabold uppercase tracking-widest text-ghibli-wood mb-1">
            {isGallery ? 'Gallery' : 'Shop'}
          </p>
          <h2 className="text-2xl font-serif font-bold text-ghibli-charcoal tracking-tight">
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
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-white/60 hover:bg-white text-ghibli-charcoal font-bold text-sm rounded-xl border border-white/80 hover:border-ghibli-wood/30 transition-all shadow-sm">
            Cancel edit
          </button>
        )}
      </header>

      <form onSubmit={upload.handleUpload} className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── Left: photo ── */}
          <aside className="w-full lg:w-[320px] xl:w-[380px] shrink-0 space-y-6">
            <Field label="Cover photo" required={!isEditing}>
              <div className="bg-white/50 border border-white/80 rounded-2xl p-2 shadow-sm">
                <ImageDropzone
                  previewUrl={upload.previewUrl}
                  onFile={handleFile}
                  onClear={upload.previewUrl ? upload.clearImage : null}
                  required={!isEditing}
                  editing={isEditing}
                />
              </div>
            </Field>

            {(upload.previewUrl || upload.title) && (
              <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                <p className="text-xs font-bold text-ghibli-charcoal/50 uppercase tracking-widest">Preview</p>
                <div className="flex items-center gap-4 p-3 bg-white/60 rounded-2xl border border-white/80 shadow-sm">
                  {upload.previewUrl ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/80 shadow-sm">
                      <img src={upload.previewUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-ghibli-paper/50 flex items-center justify-center shrink-0 border border-white/80">
                      <span className="opacity-30">🖼</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ghibli-charcoal truncate">
                      {upload.title || 'Untitled'}
                    </p>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-widest text-ghibli-charcoal/40 truncate mt-0.5">
                      {upload.category || (isGallery && upload.uploadType === 'upcoming' ? 'Upcoming' : 'Category')}
                      {!isGallery && upload.price ? ` · ₹${Number(upload.price).toLocaleString('en-IN')}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* ── Right: fields ── */}
          <div className="flex-1 space-y-10 min-w-0">
            {isGallery && (
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-ghibli-charcoal/50 uppercase tracking-widest">Piece type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-ghibli-charcoal/50 uppercase tracking-widest">Details</h3>
              <div className="space-y-5">
                <Field label={isGallery ? 'Title' : 'Product name'} hint={isGallery ? 'Optional but recommended' : undefined}>
                  <input
                    type="text"
                    value={upload.title}
                    onChange={(e) => upload.setTitle(e.target.value)}
                    className={inputClass}
                    placeholder={isGallery ? 'e.g. Radha Krishna Madhubani' : 'e.g. Mandala wall plate'}
                  />
                </Field>

                <Field label={isGallery ? 'Story' : 'Description'} hint="Shown on the detail page">
                  <textarea
                    value={upload.desc}
                    onChange={(e) => upload.setDesc(e.target.value)}
                    className={`${inputClass} min-h-[100px] resize-y`}
                    rows={4}
                    placeholder="Materials, size, inspiration…"
                  />
                </Field>
              </div>
            </section>

            {(isGallery ? upload.uploadType !== 'upcoming' : true) && (
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-ghibli-charcoal/50 uppercase tracking-widest">Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Main category" required>
                    <select
                      value={upload.category}
                      onChange={(e) => upload.setCategory(e.target.value)}
                      className={inputClass}
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
                      className={inputClass}
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
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-ghibli-charcoal/50 uppercase tracking-widest">Pricing & inventory</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Sale price (₹)" required>
                      <input
                        type="number"
                        min="0"
                        value={upload.price}
                        onChange={(e) => upload.setPrice(e.target.value)}
                        className={inputClass}
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
                        className={inputClass}
                        placeholder="999"
                      />
                    </Field>
                    <Field label="Stock" hint="Empty = unlimited">
                      <input
                        type="number"
                        min="0"
                        value={upload.stock}
                        onChange={(e) => upload.setStock(e.target.value)}
                        className={inputClass}
                        placeholder="∞"
                      />
                    </Field>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-ghibli-charcoal/50 uppercase tracking-widest">Shop badges</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
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

        <footer className="mt-10 pt-6 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.7rem] font-medium text-ghibli-charcoal/50">
            {isGallery
              ? 'Publishes to /gallery · separate from shop products'
              : 'Publishes to /shop · requires a price'}
          </p>
          <button
            type="submit"
            disabled={upload.uploading}
            className={`px-8 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 w-full sm:w-auto ${
              upload.success
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-ghibli-wood text-ghibli-cream hover:bg-ghibli-navy hover:shadow-ghibli-navy/20'
            }`}
          >
            {submitLabel}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AdminUploadForm;
