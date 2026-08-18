import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import {
  MITHI_NAME,
  MITHI_TAGLINE,
  FORM_PRESETS,
  getTopicReply,
  getTopicActions,
  getTopicLabel,
  matchIntent,
  formatLeadMessage,
  getQuickChips,
} from '../lib/mithiBrain';
import { FALLBACK_CATEGORIES } from '../constants/categories';
import { fetchSiteSetting } from '../lib/fetchSettings';
import { buildWhatsAppUrl, hasWhatsApp, DEFAULT_CHANNELS } from '../lib/enquire';
import { fetchJson } from '../lib/fetchJson';
import { useStore } from '../context/StoreContext';

const TypingDots = () => (
  <div className="flex gap-1 px-1 py-2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-ghibli-wood/40 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const Bubble = ({ from, children }) => (
  <div className={`flex ${from === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${
        from === 'user'
          ? 'bg-ghibli-wood text-ghibli-cream rounded-tr-sm'
          : 'bg-white text-ghibli-charcoal rounded-tl-sm border border-ghibli-wood/8'
      }`}
    >
      {children}
    </div>
  </div>
);

const ActionButton = ({ action, onAction, waUrl, channels, onClose }) => {
  if (action.type === 'link') {
    const isExternal = action.href.startsWith('http');
    const className =
      'p-2.5 text-[13px] bg-white border border-ghibli-wood/15 rounded-xl hover:bg-ghibli-wood hover:text-white transition-colors text-left font-medium block w-full';

    if (isExternal) {
      return (
        <a href={action.href} target="_blank" rel="noopener noreferrer" onClick={onClose} className={className}>
          → {action.label}
        </a>
      );
    }

    return (
      <Link to={action.href} onClick={onClose} className={className}>
        → {action.label}
      </Link>
    );
  }

  if (action.type === 'whatsapp') {
    return (
      <WhatsAppButton
        href={waUrl}
        disabled={!hasWhatsApp(channels)}
        onClick={onClose}
        className="p-2.5 text-[13px] border rounded-xl bg-green-50/80 border-green-200/80 text-green-800 w-full text-left font-medium"
      >
        → {action.label}
      </WhatsAppButton>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onAction(action)}
      className="p-2.5 text-[13px] border rounded-xl transition-colors text-left font-medium bg-white border-ghibli-wood/15 hover:bg-ghibli-wood hover:text-white w-full"
    >
      → {action.label}
    </button>
  );
};

const Chatbot = () => {
  const { cartCount, wishlistCount } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState('chat');
  const [activeTopic, setActiveTopic] = useState('intro');
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [formTopic, setFormTopic] = useState('note');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [channels, setChannels] = useState({});

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimer = useRef(null);

  const ctx = { cartCount, wishlistCount, categories };
  const waUrl = buildWhatsAppUrl({ title: 'Visheshkala' }, channels, { source: 'chatbot' });

  useEffect(() => {
    if (!isOpen) return;
    fetchSiteSetting('category_definitions', null).then((val) => {
      if (val?.length) setCategories(val);
    });
    fetchSiteSetting('contact_channels', DEFAULT_CHANNELS).then((val) => {
      if (val) setChannels(val);
    });
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, step]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const mithiSay = useCallback((text, topic = activeTopic) => {
    setTyping(true);
    const delay = Math.min(350 + text.length * 6, 1200);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: 'mithi', text, topic }]);
      setActiveTopic(topic);
    }, delay);
  }, [activeTopic]);

  const userSay = useCallback((text) => {
    setMessages((prev) => [...prev, { from: 'user', text }]);
  }, []);

  const showTopic = useCallback(
    (topicId, userLabel) => {
      const label = userLabel || getTopicLabel(topicId);
      if (userLabel !== null) userSay(label);
      mithiSay(getTopicReply(topicId, ctx), topicId);
    },
    [ctx, mithiSay, userSay]
  );

  useEffect(() => {
    if (isOpen && !hasGreeted && step === 'chat') {
      setHasGreeted(true);
      mithiSay(getTopicReply('intro', { cartCount, wishlistCount, categories }), 'intro');
    }
  }, [isOpen, hasGreeted, step, cartCount, wishlistCount, categories, mithiSay]);

  const openForm = (topic = 'note') => {
    const preset = FORM_PRESETS[topic] || FORM_PRESETS.note;
    setFormTopic(topic);
    setFormError('');
    setFormData((prev) => ({ ...prev, message: preset.message }));
    setStep('form');
  };

  const handleAction = (action) => {
    if (action.type === 'form') {
      userSay(action.label);
      mithiSay('Lovely — just fill in a few details below.', action.topic || 'note');
      setTimeout(() => openForm(action.topic || 'note'), 500);
    } else if (action.type === 'topic') {
      showTopic(action.topic);
    } else if (action.type === 'whatsapp') {
      userSay(action.label);
      if (waUrl) {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        mithiSay("Opening WhatsApp — we'll reply as soon as we can!", 'order');
      } else {
        mithiSay("WhatsApp isn't set up yet — leave a note below or find us on Instagram.", 'contact');
      }
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || typing) return;

    setInput('');
    userSay(text);

    const topicId = matchIntent(text, categories);
    mithiSay(getTopicReply(topicId, ctx), topicId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const phone = formData.phone.replace(/\D/g, '');
    const email = formData.email.trim();

    if (phone.length !== 10) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchJson('/api/manage-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone,
          email: email || undefined,
          message: formatLeadMessage(formTopic, formData.message),
        }),
      });
      setStep('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      setFormError(err.message || "Couldn't send — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetChat = () => {
    setStep('chat');
    setMessages([]);
    setHasGreeted(false);
    setActiveTopic('intro');
    setFormData({ name: '', phone: '', email: '', message: '' });
    setFormError('');
    setInput('');
  };

  const lastMithi = [...messages].reverse().find((m) => m.from === 'mithi');
  const showActions = step === 'chat' && !typing && lastMithi;
  const actions = showActions ? getTopicActions(lastMithi.topic, ctx) : [];
  const quickChips = getQuickChips(ctx);

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-sans">
      {!isOpen && (
        <div className="absolute bottom-[4.25rem] right-0 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-500 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-lg border border-ghibli-wood/10 text-xs font-semibold text-ghibli-charcoal whitespace-nowrap">
            Hi, I'm {MITHI_NAME}! 🌸
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : `Chat with ${MITHI_NAME}`}
        className="w-[3.25rem] h-[3.25rem] p-0 rounded-full bg-ghibli-wood text-ghibli-cream shadow-[0_8px_30px_rgba(92,64,51,0.35)] inline-flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="block shrink-0 pointer-events-none"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <span className="text-xl leading-none flex items-center justify-center pointer-events-none" aria-hidden="true">
            🌸
          </span>
        )}
        {!isOpen && cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] px-1 bg-ghibli-gold text-ghibli-charcoal text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-[4.75rem] right-0 w-[min(100vw-1.5rem,22rem)] bg-white rounded-[1.35rem] shadow-[0_20px_60px_rgba(44,36,32,0.18)] border border-ghibli-wood/10 overflow-hidden flex flex-col origin-bottom-right animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-br from-ghibli-wood to-[#8B6048] px-4 py-3.5 text-ghibli-cream flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0 ring-2 ring-white/20">
              🌸
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[15px] font-serif leading-tight">{MITHI_NAME}</h3>
              <p className="text-[10px] opacity-90 truncate">{MITHI_TAGLINE}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[9px] uppercase tracking-wider opacity-75">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="p-3.5 bg-[#faf7f2] flex-1 h-[22rem] overflow-y-auto space-y-2.5">
            {step === 'chat' && (
              <>
                {messages.map((msg, i) => (
                  <Bubble key={i} from={msg.from}>
                    {msg.text}
                  </Bubble>
                ))}

                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 shadow-sm border border-ghibli-wood/8">
                      <TypingDots />
                    </div>
                  </div>
                )}

                {showActions && actions.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    {actions.map((action, i) => (
                      <ActionButton
                        key={`${action.type}-${action.label}-${i}`}
                        action={action}
                        onAction={handleAction}
                        waUrl={waUrl}
                        channels={channels}
                        onClose={() => setIsOpen(false)}
                      />
                    ))}
                    {lastMithi.topic !== 'intro' && (
                      <button
                        type="button"
                        onClick={() => showTopic('intro', 'Back to menu')}
                        className="text-[11px] text-ghibli-wood/55 hover:text-ghibli-wood font-bold mt-0.5 text-left"
                      >
                        ← Back to menu
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {step === 'form' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <button
                  type="button"
                  onClick={() => setStep('chat')}
                  className="text-[11px] text-ghibli-wood font-bold flex items-center gap-1 hover:opacity-70"
                >
                  ← Back to chat
                </button>
                <Bubble from="mithi">Just a name and how to reach you — Vishakha will reply personally.</Bubble>
                <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 text-[13px] rounded-xl border border-ghibli-wood/15 bg-white focus:outline-none focus:border-ghibli-wood"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    placeholder="Phone (10 digits)"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    className="w-full p-2.5 text-[13px] rounded-xl border border-ghibli-wood/15 bg-white focus:outline-none focus:border-ghibli-wood"
                  />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="Email (optional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 text-[13px] rounded-xl border border-ghibli-wood/15 bg-white focus:outline-none focus:border-ghibli-wood"
                  />
                  <textarea
                    required
                    placeholder="Your message..."
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 text-[13px] rounded-xl border border-ghibli-wood/15 bg-white focus:outline-none focus:border-ghibli-wood resize-none"
                  />
                  {formError && (
                    <p className="text-[12px] text-red-600 font-medium">{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ghibli-wood text-white py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#8B6048] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send to Vishakha'}
                  </button>
                </form>
              </div>
            )}

            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in duration-300 py-6">
                <img
                  src="/logo.png"
                  alt="Visheshkala"
                  className="w-20 h-20 object-contain"
                />
                <h4 className="font-bold text-ghibli-charcoal font-serif text-lg">Message sent!</h4>
                <p className="text-[13px] text-ghibli-charcoal/70 px-2">
                  Vishakha will read your note and get back to you soon. Thank you for reaching out.
                </p>
                <button
                  type="button"
                  onClick={resetChat}
                  className="mt-1 text-[11px] font-bold uppercase tracking-wider text-ghibli-wood hover:opacity-70"
                >
                  Chat with {MITHI_NAME} again
                </button>
              </div>
            )}
          </div>

          {/* Input bar */}
          {step === 'chat' && (
            <div className="border-t border-ghibli-wood/10 bg-white">
              {!typing && (
                <div className="px-2.5 pt-2 flex gap-1.5 overflow-x-auto scrollbar-none">
                  {quickChips.map((chip) => (
                    <button
                      key={chip.topic}
                      type="button"
                      onClick={() => showTopic(chip.topic)}
                      className="flex-shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-ghibli-paper/80 text-ghibli-wood border border-ghibli-wood/12 hover:bg-ghibli-wood hover:text-white transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={handleSend} className="p-2.5 flex gap-2 items-end">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${MITHI_NAME} anything...`}
                  disabled={typing}
                  className="flex-1 min-w-0 px-3 py-2 text-[13px] rounded-xl border border-ghibli-wood/15 bg-ghibli-cream/30 focus:outline-none focus:border-ghibli-wood disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="flex-shrink-0 w-9 h-9 rounded-xl bg-ghibli-wood text-white flex items-center justify-center hover:bg-[#8B6048] transition-colors disabled:opacity-40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
