import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import {
  MITHI_NAME,
  MITHI_TAGLINE,
  getGreeting,
  MAIN_MENU,
  TOPICS,
  FORM_PRESETS,
  getTopicReply,
  getTopicActions,
} from '../lib/mithiBrain';
import { FALLBACK_CATEGORIES } from '../constants/categories';
import { fetchSiteSetting } from '../lib/fetchSettings';
import { buildWhatsAppUrl, hasWhatsApp } from '../lib/enquire';
import { getProductsUrl } from '../lib/categoryUtils';

const TypingDots = () => (
  <div className="flex gap-1 px-1 py-2">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-ghibli-wood/40 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const Bubble = ({ from, children }) => (
  <div className={`flex ${from === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[88%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
        from === 'user'
          ? 'bg-ghibli-wood text-ghibli-cream rounded-tr-sm'
          : 'bg-white text-ghibli-charcoal rounded-tl-sm border border-ghibli-wood/5'
      }`}
    >
      {children}
    </div>
  </div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState('chat');
  const [formData, setFormData] = useState({ name: '', contact_info: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [channels, setChannels] = useState({});
  const scrollRef = useRef(null);
  const waUrl = buildWhatsAppUrl({ title: 'Visheshkala' }, channels);

  useEffect(() => {
    if (!isOpen) return;

    fetchSiteSetting('category_definitions', null).then((catValue) => {
      if (catValue?.length) setCategories(catValue);
    });
    fetchSiteSetting('contact_channels', null).then((val) => {
      if (val) setChannels(val);
    });
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, step]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      mithiSay(
        `${getGreeting()}! I'm ${MITHI_NAME} ${MITHI_TAGLINE}. 🌿\n\nWhat brings you here today?`,
        'intro'
      );
    }
  }, [isOpen, hasGreeted]);

  const mithiSay = (text, context = 'reply') => {
    setTyping(true);
    const delay = Math.min(400 + text.length * 8, 1400);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'mithi', text, context }]);
    }, delay);
  };

  const userSay = (text) => {
    setMessages(prev => [...prev, { from: 'user', text }]);
  };

  const handleTopic = (topic) => {
    userSay(topic.label.replace(/^[^\s]+\s/, ''));
    mithiSay(getTopicReply(topic.id), topic.id);
  };

  const openForm = (topic = 'note') => {
    const preset = FORM_PRESETS[topic] || FORM_PRESETS.note;
    setFormData(prev => ({ ...prev, message: preset.message }));
    setStep('form');
  };

  const handleAction = (action) => {
    if (action.type === 'form') {
      userSay(action.label);
      mithiSay("Lovely — just fill in a few details below.", 'form');
      setTimeout(() => openForm(action.topic), 600);
    } else if (action.type === 'topic') {
      handleTopic(TOPICS[action.topic]);
    } else if (action.type === 'whatsapp') {
      userSay(action.label);
      const waUrl = buildWhatsAppUrl({ title: 'Visheshkala' }, channels);
      if (waUrl) {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        mithiSay("Opening WhatsApp for you — we'll reply as soon as we can!");
      } else {
        mithiSay("WhatsApp isn't set up yet — leave a note below or DM us on Instagram!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/manage-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Could not send');
      setStep('success');
      setFormData({ name: '', contact_info: '', message: '' });
      setMessages([]);
      setHasGreeted(false);
    } catch {
      mithiSay("Hmm, that didn't go through — try WhatsApp instead, or give it another go in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetChat = () => {
    setStep('chat');
    setMessages([]);
    setHasGreeted(false);
    setFormData({ name: '', contact_info: '', message: '' });
  };

  const lastMithiContext = [...messages].reverse().find(m => m.from === 'mithi')?.context;
  const showMenu = step === 'chat' && !typing && (lastMithiContext === 'intro' || messages.length === 0);
  const showTopicActions = step === 'chat' && !typing && lastMithiContext && lastMithiContext !== 'intro' && TOPICS[lastMithiContext];

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 pointer-events-none">
          <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-ghibli-wood/10 text-xs font-medium text-ghibli-charcoal whitespace-nowrap">
            Hi, I'm {MITHI_NAME}! 🌸
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : `Chat with ${MITHI_NAME}`}
        className="w-14 h-14 rounded-full bg-ghibli-wood text-ghibli-cream shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <span className="text-2xl">🌸</span>
        )}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-ghibli-gold rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-ghibli-wood/10 overflow-hidden flex flex-col origin-bottom-right animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-ghibli-wood to-[#A0704F] p-4 text-ghibli-cream flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">🌸</div>
            <div>
              <h3 className="font-bold text-base font-serif">{MITHI_NAME}</h3>
              <p className="text-[11px] opacity-90">{MITHI_TAGLINE}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-[10px] opacity-80">here to help</span>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="p-4 bg-ghibli-cream/40 flex-1 h-[360px] overflow-y-auto space-y-3">
            {step === 'chat' && (
              <>
                {messages.map((msg, i) => (
                  <Bubble key={i} from={msg.from}>{msg.text}</Bubble>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 shadow-sm border border-ghibli-wood/5">
                      <TypingDots />
                    </div>
                  </div>
                )}

                {showMenu && (
                  <div className="flex flex-col gap-2 pt-1">
                    {MAIN_MENU.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => handleTopic(topic)}
                        className="p-2.5 text-sm bg-white border border-ghibli-wood/15 rounded-xl hover:bg-ghibli-wood hover:text-white transition-colors text-left font-medium"
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                )}

                {showTopicActions && (
                  <div className="flex flex-col gap-2 pt-1">
                    {getTopicActions(lastMithiContext).map((action, i) =>
                      action.type === 'link' ? (
                        <a
                          key={i}
                          href={action.href}
                          onClick={() => setIsOpen(false)}
                          className="p-2.5 text-sm bg-ghibli-paper/50 border border-ghibli-wood/15 rounded-xl hover:bg-ghibli-wood hover:text-white transition-colors text-left font-medium block"
                        >
                          → {action.label}
                        </a>
                      ) : action.type === 'whatsapp' ? (
                        <WhatsAppButton
                          key={i}
                          href={waUrl}
                          disabled={!hasWhatsApp(channels)}
                          onClick={() => setIsOpen(false)}
                          className="p-2.5 text-sm border rounded-xl bg-green-50/80 border-green-200 text-green-800 w-full text-left font-medium"
                        >
                          {action.label}
                        </WhatsAppButton>
                      ) : (
                        <button
                          key={i}
                          onClick={() => handleAction(action)}
                          className="p-2.5 text-sm border rounded-xl transition-colors text-left font-medium bg-white border-ghibli-wood/15 hover:bg-ghibli-wood hover:text-white"
                        >
                          → {action.label}
                        </button>
                      )
                    )}
                    {lastMithiContext === 'browse' && (
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {categories.slice(0, 4).map(cat => (
                          <Link
                            key={cat.id}
                            to={getProductsUrl(cat.id)}
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-xs bg-white border border-ghibli-wood/10 rounded-lg hover:border-ghibli-gold text-center font-medium text-ghibli-charcoal hover:text-ghibli-wood transition-colors"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => mithiSay("What else can I help with?", 'intro')}
                      className="text-xs text-ghibli-wood/60 hover:text-ghibli-wood font-bold mt-1"
                    >
                      ← Back to menu
                    </button>
                  </div>
                )}
              </>
            )}

            {step === 'form' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <button onClick={() => setStep('chat')} className="text-xs text-ghibli-wood font-bold flex items-center gap-1 hover:opacity-70">
                  ← Back
                </button>
                <Bubble from="mithi">Just a name and how to reach you — Vishakha will reply personally.</Bubble>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-ghibli-wood/15 bg-white focus:outline-none focus:border-ghibli-wood"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone or email"
                    value={formData.contact_info}
                    onChange={e => setFormData({ ...formData, contact_info: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-ghibli-wood/15 bg-white focus:outline-none focus:border-ghibli-wood"
                  />
                  <textarea
                    required
                    placeholder="Your message..."
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 text-sm rounded-xl border border-ghibli-wood/15 bg-white focus:outline-none focus:border-ghibli-wood resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ghibli-wood text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#A0704F] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send to Vishakha'}
                  </button>
                </form>
              </div>
            )}

            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in duration-300 py-8">
                <div className="text-4xl">🌿</div>
                <h4 className="font-bold text-ghibli-charcoal font-serif text-lg">Message sent!</h4>
                <p className="text-sm text-ghibli-charcoal/70 px-4">
                  Vishakha will read your note and get back to you soon. Thank you for reaching out.
                </p>
                <button onClick={resetChat} className="mt-2 text-xs font-bold uppercase tracking-wider text-ghibli-wood hover:opacity-70">
                  Chat with {MITHI_NAME} again
                </button>
              </div>
            )}
          </div>

          {/* Footer quick bar */}
          {step === 'chat' && !typing && (
            <div className="px-3 py-2 bg-white border-t border-ghibli-wood/10 flex gap-2">
              <WhatsAppButton
                href={waUrl}
                disabled={!hasWhatsApp(channels)}
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-1.5 text-[11px] font-bold bg-green-50/80 text-green-700 rounded-lg"
              >
                WhatsApp
              </WhatsAppButton>
              <button
                onClick={() => openForm('note')}
                className="flex-1 text-center py-1.5 text-[11px] font-bold bg-ghibli-paper text-ghibli-wood rounded-lg hover:bg-ghibli-wood hover:text-white transition-colors"
              >
                Leave a note
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
