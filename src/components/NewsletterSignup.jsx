import { useState } from 'react';

const NewsletterSignup = ({ className = '', variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not subscribe');
      setStatus('success');
      setEmail('');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
      setStatus('idle');
    }
  };

  const isFooter = variant === 'footer';

  if (status === 'success') {
    return (
      <p className={`text-sm font-medium text-ghibli-wood ${className}`}>
        You&apos;re on the list — thank you!
      </p>
    );
  }

  if (isFooter) {
    return (
      <form onSubmit={handleSubmit} className={className}>
        <p className="text-sm text-ghibli-charcoal/55 mb-4 leading-relaxed">
          New pieces &amp; festive drops — no spam.
        </p>
        <label htmlFor="footer-newsletter-email" className="sr-only">Email for newsletter</label>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === 'sending'}
          className="w-full px-0 py-2.5 bg-transparent border-b border-ghibli-wood/25 text-sm text-ghibli-charcoal placeholder:text-ghibli-charcoal/30 focus:outline-none focus:border-ghibli-wood transition-colors mb-4"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-ghibli-wood hover:text-ghibli-charcoal transition-colors disabled:opacity-50"
        >
          {status === 'sending' ? 'Joining…' : 'Join the list →'}
        </button>
        {errorMsg && <p className="text-red-600/80 text-xs mt-3 font-medium">{errorMsg}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <p className="text-sm text-ghibli-charcoal/55 mb-3 leading-relaxed">
        New pieces &amp; festive drops — no spam.
      </p>
      <div className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === 'sending'}
          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-ghibli-wood/15 text-sm text-ghibli-charcoal placeholder:text-ghibli-charcoal/35 focus:outline-none focus:border-ghibli-wood/40 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3 rounded-full bg-ghibli-charcoal text-white text-[11px] font-bold uppercase tracking-widest hover:bg-ghibli-wood transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? 'Joining…' : 'Subscribe'}
        </button>
      </div>
      {errorMsg && <p className="text-red-500 text-xs mt-2 font-medium">{errorMsg}</p>}
    </form>
  );
};

export default NewsletterSignup;
