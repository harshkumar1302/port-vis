import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const NewsletterModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setEmail('');
            }, 3000);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-ghibli-charcoal/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-ghibli-cream rounded-[2.5rem] p-6 md:p-12 shadow-2xl overflow-hidden border border-ghibli-wood/10"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-ghibli-gold/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-ghibli-wood/5 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-ghibli-wood/5 hover:bg-ghibli-wood/10 flex items-center justify-center text-ghibli-wood transition-colors"
                        >
                            ✕
                        </button>

                        {status === 'success' ? (
                            <div className="text-center py-8 animate-fade-in">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-6xl mb-6 block"
                                >
                                    🕊️
                                </motion.div>
                                <h3 className="text-2xl font-bold text-ghibli-wood font-serif mb-2">
                                    Letter Sent!
                                </h3>
                                <p className="text-ghibli-charcoal/70">
                                    We've sent a carrier pigeon your way. <br />Keep an eye on the horizon.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center relative z-10">
                                <span className="text-4xl mb-6 block animate-bounce-slow">📜</span>
                                <h3 className="text-3xl font-bold text-ghibli-wood font-serif mb-3">
                                    Join the Journey
                                </h3>
                                <p className="text-ghibli-charcoal/70 mb-8 leading-relaxed">
                                    Leave your address, and we shall send word when new creations arrive in the garden.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="w-full px-6 py-4 bg-white/60 border-2 border-ghibli-wood/10 rounded-2xl focus:outline-none focus:border-ghibli-wood/30 focus:bg-white transition-all text-ghibli-wood placeholder:text-ghibli-wood/30 font-medium text-center shadow-inner"
                                            disabled={status === 'sending'}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-2xl font-bold tracking-widest text-xs md:text-sm hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>SEALING LETTER...</span>
                                            </>
                                        ) : (
                                            <span>SEND CARRIER PIGEON 🕊️</span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterModal;
