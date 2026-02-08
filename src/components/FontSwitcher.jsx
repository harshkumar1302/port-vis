import React, { useState, useEffect } from 'react';

const FONT_PRESETS = [
    { name: 'Select a Preset...', url: '', family: '' },

    // --- Elegant Serifs (Luxury / Editorial) ---
    { name: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap', family: 'Playfair Display' },
    { name: 'Cormorant Garamond', url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap', family: 'Cormorant Garamond' },
    { name: 'Merriweather', url: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,700;1,300&display=swap', family: 'Merriweather' },
    { name: 'Lora', url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap', family: 'Lora' },
    { name: 'Cinzel (Classic)', url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap', family: 'Cinzel' },
    { name: 'Bodoni Moda', url: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&display=swap', family: 'Bodoni Moda' },
    { name: 'Prata', url: 'https://fonts.googleapis.com/css2?family=Prata&display=swap', family: 'Prata' },
    { name: 'DM Serif Display', url: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap', family: 'DM Serif Display' },

    // --- Modern Sans-Serifs (Clean / Minimal) ---
    { name: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap', family: 'Roboto' },
    { name: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap', family: 'Montserrat' },
    { name: 'Poppins', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap', family: 'Poppins' },
    { name: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap', family: 'Open Sans' },
    { name: 'Lato', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap', family: 'Lato' },
    { name: 'Raleway', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700&display=swap', family: 'Raleway' },
    { name: 'Nunito (Rounded)', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&display=swap', family: 'Nunito' },
    { name: 'Quicksand (Rounded)', url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;700&display=swap', family: 'Quicksand' },
    { name: 'Josefin Sans', url: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;700&display=swap', family: 'Josefin Sans' },
    { name: 'Work Sans', url: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;600&display=swap', family: 'Work Sans' },
    { name: 'Oswald (Condensed)', url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;700&display=swap', family: 'Oswald' },

    // --- Scripts & Handwriting (Artistic / Ghibli Vibes) ---
    { name: 'Great Vibes', url: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap', family: 'Great Vibes' },
    { name: 'Dancing Script', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap', family: 'Dancing Script' },
    { name: 'Pacifico', url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap', family: 'Pacifico' },
    { name: 'Sacramento', url: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap', family: 'Sacramento' },
    { name: 'Parisienne', url: 'https://fonts.googleapis.com/css2?family=Parisienne&display=swap', family: 'Parisienne' },
    { name: 'Pinyon Script', url: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap', family: 'Pinyon Script' },
    { name: 'Tangerine', url: 'https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap', family: 'Tangerine' },
    { name: 'Allura', url: 'https://fonts.googleapis.com/css2?family=Allura&display=swap', family: 'Allura' },
    { name: 'Alex Brush', url: 'https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap', family: 'Alex Brush' },
    { name: 'Satisfy', url: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap', family: 'Satisfy' },
    { name: 'Courgette', url: 'https://fonts.googleapis.com/css2?family=Courgette&display=swap', family: 'Courgette' },
    { name: 'Cookie', url: 'https://fonts.googleapis.com/css2?family=Cookie&display=swap', family: 'Cookie' },
    { name: 'Kaushan Script', url: 'https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap', family: 'Kaushan Script' },
    { name: 'Gloria Hallelujah', url: 'https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap', family: 'Gloria Hallelujah' },
    { name: 'Indie Flower', url: 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap', family: 'Indie Flower' },
    { name: 'Caveat', url: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap', family: 'Caveat' },
    { name: 'Shadows Into Light', url: 'https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap', family: 'Shadows Into Light' },
    { name: 'Amatic SC', url: 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap', family: 'Amatic SC' },

    // --- Display & Retro (Unique) ---
    { name: 'Lobster', url: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap', family: 'Lobster' },
    { name: 'Abril Fatface', url: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap', family: 'Abril Fatface' },
    { name: 'Righteous', url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap', family: 'Righteous' },
    { name: 'Comfortaa', url: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap', family: 'Comfortaa' },
    { name: 'Special Elite (Typewriter)', url: 'https://fonts.googleapis.com/css2?family=Special+Elite&display=swap', family: 'Special Elite' },
    { name: 'Rye (Western)', url: 'https://fonts.googleapis.com/css2?family=Rye&display=swap', family: 'Rye' },
    { name: 'Limelight (Art Deco)', url: 'https://fonts.googleapis.com/css2?family=Limelight&display=swap', family: 'Limelight' },
    { name: 'Monoton', url: 'https://fonts.googleapis.com/css2?family=Monoton&display=swap', family: 'Monoton' },
];

const FontSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fontFamily, setFontFamily] = useState('');
    const [fontUrl, setFontUrl] = useState('');
    const [fontWeight, setFontWeight] = useState('');
    const [fontStyle, setFontStyle] = useState('normal');
    const [letterSpacing, setLetterSpacing] = useState('');
    const [lineHeight, setLineHeight] = useState('');

    const handleApply = (e) => {
        if (e) e.preventDefault();

        // REMOVE existing tags first to force a clean apply
        const existingLink = document.getElementById('font-switcher-link');
        if (existingLink) existingLink.remove();

        const existingStyle = document.getElementById('font-switcher-style');
        if (existingStyle) existingStyle.remove();

        // 1. Inject the font link if provided
        if (fontUrl) {
            const link = document.createElement('link');
            link.id = 'font-switcher-link';
            link.rel = 'stylesheet';
            link.href = fontUrl;
            document.head.appendChild(link);
        }

        // 2. Apply font properties to the body
        document.body.style.fontFamily = fontFamily ? `"${fontFamily}", sans-serif` : '';
        document.body.style.fontWeight = fontWeight;
        document.body.style.fontStyle = fontStyle;
        document.body.style.letterSpacing = letterSpacing;
        document.body.style.lineHeight = lineHeight;

        // 3. Force apply to all elements with new style tag
        const style = document.createElement('style');
        style.id = 'font-switcher-style';

        style.innerHTML = `
      * {
        ${fontFamily ? `font-family: "${fontFamily}", sans-serif !important;` : ''}
        ${fontWeight ? `font-weight: ${fontWeight} !important;` : ''}
        ${fontStyle ? `font-style: ${fontStyle} !important;` : ''}
        ${letterSpacing ? `letter-spacing: ${letterSpacing} !important;` : ''}
        ${lineHeight ? `line-height: ${lineHeight} !important;` : ''}
      }

      /* Protect Font Switcher UI - explicit override */
      #font-switcher-container, #font-switcher-container *, #font-switcher-button {
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
        document.head.appendChild(style);
    };

    const handlePresetChange = (e) => {
        const selectedName = e.target.value;
        const preset = FONT_PRESETS.find(p => p.name === selectedName);

        if (preset) {
            setFontFamily(preset.family);
            setFontUrl(preset.url);
            // Optional: Auto-apply when creating preset, or let user click apply
            // Let's just fill fields for now so user can adjust weight etc.
        }
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

                {/* PRESETS DROPDOWN */}
                <div>
                    <label className="block text-xs font-bold text-ghibli-charcoal/60 uppercase tracking-wider mb-2">
                        Quick Select (Popular Fonts)
                    </label>
                    <select
                        onChange={handlePresetChange}
                        className="w-full bg-ghibli-gold/10 border border-ghibli-gold/30 rounded-lg px-3 py-2 text-ghibli-charcoal focus:outline-none focus:border-ghibli-gold transition-colors text-xs font-bold"
                    >
                        {FONT_PRESETS.map((preset) => (
                            <option key={preset.name} value={preset.name}>
                                {preset.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="border-t border-ghibli-charcoal/10 my-2"></div>

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
