import React, { useState, useEffect } from 'react';

const FontSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState('');
  const [fontUrl, setFontUrl] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [fontStyle, setFontStyle] = useState('normal');
  const [letterSpacing, setLetterSpacing] = useState('');
  const [lineHeight, setLineHeight] = useState('');

  const handleApply = (e) => {
    e.preventDefault();

    // 1. Inject the font link if provided
    if (fontUrl) {
      const linkId = 'font-switcher-link';
      let link = document.getElementById(linkId);

      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      // Update href only if changed
      if (link.href !== fontUrl) {
        link.href = fontUrl;
      }
    }

    // 2. Apply font properties to the body
    // Always assign the value (even if empty) to ensure changes/clearing are reflected
    document.body.style.fontFamily = fontFamily ? `"${fontFamily}", sans-serif` : '';
    document.body.style.fontWeight = fontWeight;
    document.body.style.fontStyle = fontStyle;
    document.body.style.letterSpacing = letterSpacing;
    document.body.style.lineHeight = lineHeight;

    // Optional: Force apply to all elements
    const styleId = 'font-switcher-style';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = `
      * {
        ${fontFamily ? `font-family: "${fontFamily}", sans-serif !important;` : ''}
        ${fontWeight ? `font-weight: ${fontWeight} !important;` : ''}
        ${fontStyle ? `font-style: ${fontStyle} !important;` : ''}
        ${letterSpacing ? `letter-spacing: ${letterSpacing} !important;` : ''}
        ${lineHeight ? `line-height: ${lineHeight} !important;` : ''}
      }

      /* Protect Font Switcher UI */
      #font-switcher-container *, #font-switcher-button {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          font-weight: normal !important;
          font-style: normal !important;
          letter-spacing: normal !important;
          line-height: normal !important;
          text-transform: none !important;
      }
      
      #font-switcher-container h3 {
          font-weight: 700 !important;
      }
      
      #font-switcher-container label {
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
      }
      
      #font-switcher-container button {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      }
      
      #font-switcher-button {
          font-weight: 700 !important;
      }
    `;
  };

  const handleReset = () => {
    setFontFamily('');
    setFontUrl('');
    setFontWeight('');
    setFontStyle('normal');
    setLetterSpacing('');
    setLineHeight('');

    // Clear inline styles
    document.body.style.fontFamily = '';
    document.body.style.fontWeight = '';
    document.body.style.fontStyle = '';
    document.body.style.letterSpacing = '';
    document.body.style.lineHeight = '';

    // Remove injected style tag
    const style = document.getElementById('font-switcher-style');
    if (style) style.remove();

    // Remove injected link tag
    const link = document.getElementById('font-switcher-link');
    if (link) link.remove();
  }

  if (!isOpen) {
    return (
      <button
        id="font-switcher-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-ghibli-charcoal text-ghibli-cream px-4 py-2 rounded-full shadow-lg hover:bg-ghibli-gold/20 hover:text-ghibli-gold transition-all duration-300 font-bold border border-ghibli-gold/30 backdrop-blur-sm"
        title="Test a different font"
      >
        Aa
      </button>
    );
  }

  return (
    <div id="font-switcher-container" className="fixed bottom-4 right-4 z-[9999] bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-ghibli-charcoal/10 w-80 text-left animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-ghibli-charcoal font-bold text-lg">Font Tester</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-ghibli-charcoal/50 hover:text-ghibli-salmon transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-ghibli-charcoal/60 uppercase tracking-wider mb-2">
            Font Family Name
          </label>
          <input
            type="text"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            placeholder="e.g. Lobster"
            className="w-full bg-white border border-ghibli-charcoal/20 rounded-lg px-3 py-2 text-ghibli-charcoal focus:outline-none focus:border-ghibli-gold transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-ghibli-charcoal/60 uppercase tracking-wider mb-2">
            Font URL / Script (Optional)
          </label>
          <input
            type="text"
            value={fontUrl}
            onChange={(e) => setFontUrl(e.target.value)}
            placeholder="https://fonts.googleapis.com/..."
            className="w-full bg-white border border-ghibli-charcoal/20 rounded-lg px-3 py-2 text-ghibli-charcoal focus:outline-none focus:border-ghibli-gold transition-colors text-xs"
          />
          <p className="text-[10px] text-ghibli-charcoal/40 mt-1">
            Paste the 'href' from Google Fonts
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-ghibli-charcoal/60 uppercase tracking-wider mb-2">
              Weight (100-900)
            </label>
            <input
              type="text"
              value={fontWeight}
              onChange={(e) => setFontWeight(e.target.value)}
              placeholder="e.g. 700"
              className="w-full bg-white border border-ghibli-charcoal/20 rounded-lg px-3 py-2 text-ghibli-charcoal focus:outline-none focus:border-ghibli-gold transition-colors text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ghibli-charcoal/60 uppercase tracking-wider mb-2">
              Style
            </label>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              className="w-full bg-white border border-ghibli-charcoal/20 rounded-lg px-3 py-2 text-ghibli-charcoal focus:outline-none focus:border-ghibli-gold transition-colors text-xs"
            >
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-ghibli-charcoal/60 uppercase tracking-wider mb-2">
              Letter Spacing
            </label>
            <input
              type="text"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(e.target.value)}
              placeholder="e.g. 2px"
              className="w-full bg-white border border-ghibli-charcoal/20 rounded-lg px-3 py-2 text-ghibli-charcoal focus:outline-none focus:border-ghibli-gold transition-colors text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-ghibli-charcoal/60 uppercase tracking-wider mb-2">
              Line Height
            </label>
            <input
              type="text"
              value={lineHeight}
              onChange={(e) => setLineHeight(e.target.value)}
              placeholder="e.g. 1.5"
              className="w-full bg-white border border-ghibli-charcoal/20 rounded-lg px-3 py-2 text-ghibli-charcoal focus:outline-none focus:border-ghibli-gold transition-colors text-xs"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-ghibli-charcoal text-ghibli-cream py-2 rounded-lg font-bold hover:bg-ghibli-charcoal/80 transition-all text-sm"
          >
            Apply Font
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-lg font-bold border border-ghibli-charcoal/20 text-ghibli-charcoal/60 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-sm"
            title="Reset"
          >
            ↺
          </button>
        </div>
      </form>
    </div>
  );
};

export default FontSwitcher;
