import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const NewsletterModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
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
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setEmail('');
            }, 3500);
        } catch (err) {
            setErrorMsg(err.message || 'Something went wrong. Try again.');
            setStatus('idle');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={status === 'sending' ? undefined : onClose}
                        className="absolute inset-0 bg-ghibli-navy/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-ghibli-gold/20 rounded-full blur-[100px] pointer-events-none animate-divine-pulse"
                    />
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-ghibli-wood/30 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30, transition: { duration: 0.4 } }}
                        className="relative w-full max-w-2xl bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-16 shadow-2xl border border-white/10 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-ghibli-gold/30 rounded-tl-3xl" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-ghibli-gold/30 rounded-br-3xl" />

                        {status !== 'sending' && status !== 'success' && (
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 z-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        )}

                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center py-12 relative z-10"
                                >
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                                        className="text-7xl mb-8 block text-ghibli-gold drop-shadow-[0_0_20px_rgba(250,205,96,0.6)]"
                                    >
                                        ✨
                                    </motion.div>
                                    <h3 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4 tracking-wide">
                                        You are on the list.
                                    </h3>
                                    <p className="text-white/60 text-lg md:text-xl font-light">
                                        The spirits will guide our next masterpiece to your inbox.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, filter: "blur(10px)" }}
                                    className="text-center relative z-10"
                                >
                                    <div className="text-ghibli-gold/70 text-sm font-bold tracking-[0.4em] uppercase mb-4 animate-pulse">
                                        The Inner Circle
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-black text-white font-serif mb-6 tracking-tight leading-tight drop-shadow-lg">
                                        Join the <br/> Waitlist
                                    </h3>
                                    <p className="text-white/60 mb-12 text-lg font-light max-w-md mx-auto leading-relaxed">
                                        Leave your whisper in the wind. We will notify you the moment the gallery doors open for new commissions and exclusive pieces.
                                    </p>

                                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                                        <div className="relative group mb-8">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your.email@ethereal.com"
                                                className="w-full px-4 py-4 bg-transparent border-b border-white/20 focus:outline-none focus:border-ghibli-gold text-white text-xl placeholder:text-white/20 font-serif text-center transition-colors duration-500"
                                                disabled={status === 'sending'}
                                            />
                                            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-ghibli-gold group-focus-within:w-full transition-all duration-700 ease-out shadow-[0_0_10px_#FACD60]" />
                                        </div>

                                        {errorMsg && (
                                            <p className="text-red-300 text-sm mb-4">{errorMsg}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === 'sending'}
                                            className="relative overflow-hidden w-full py-5 rounded-none border border-white/20 text-white font-bold tracking-[0.3em] text-xs uppercase hover:bg-white hover:text-ghibli-navy transition-all duration-500 disabled:opacity-50 disabled:cursor-wait group/btn"
                                        >
                                            <div className="absolute inset-0 bg-ghibli-gold translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-out z-0" />
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                {status === 'sending' ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Summoning...
                                                    </span>
                                                ) : (
                                                    <>
                                                        Request Access
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover/btn:translate-x-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterModal;
