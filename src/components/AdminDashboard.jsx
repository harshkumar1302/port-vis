import { useState, useEffect } from 'react';
import ReviewsTab from './admin/tabs/ReviewsTab';
import LeadsTab from './admin/tabs/LeadsTab';
import SiteTab from './admin/tabs/SiteTab';
import ShopTab from './admin/tabs/ShopTab';
import GalleryTab from './admin/tabs/GalleryTab';

const dashboardTabs = [
    { id: 'gallery', label: 'Gallery', shortLabel: 'Gallery', icon: 'grid', description: 'Upload portfolio pieces for /gallery — categories, stories, featured & upcoming.' },
    { id: 'shop', label: 'Shop', shortLabel: 'Shop', icon: 'bag', description: 'Upload items for sale on /shop — price, stock, and badges.' },
    { id: 'reviews', label: 'Testimonials', shortLabel: 'Reviews', icon: 'heart', description: 'Keep your collector stories up to date.' },
    { id: 'leads', label: 'Inquiries', shortLabel: 'Leads', icon: 'message', description: 'Chatbot, contact form, cart orders, and newsletter.' },
    { id: 'site', label: 'Site settings', shortLabel: 'Settings', icon: 'settings', description: 'Fine-tune the public studio experience.' },
];

const DashboardIcon = ({ name, className = 'w-5 h-5' }) => {
    const paths = {
        grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
        bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
        heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
        message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.3 8.3 0 0 1-3.6-.8L4 20l1.4-3.5A7.3 7.3 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
        settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
        arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    };

    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[name]}
        </svg>
    );
};

const AdminDashboard = () => {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [adminTab, setAdminTab] = useState('gallery');

    // Setup mode state
    const [loginMode, setLoginMode] = useState('login'); // 'login' or 'register'
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const res = await fetch('/api/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setSession({ user: { id: 'admin-master', email: data.email || 'owner' } });
            } else {
                setSession(null);
            }
        } catch (err) {
            console.error('Session check failed:', err);
            setSession(null);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                setSession({ user: { id: 'admin-master', email: 'owner' } });
            } else {
                let errorMsg = 'Invalid credentials';
                try {
                    const data = await res.json();
                    errorMsg = data.error || errorMsg;
                } catch (jsonErr) {
                    errorMsg = `Server error (${res.status})`;
                }
                alert(`🔒 Access Denied: ${errorMsg}`);
            }
        } catch (err) {
            console.error('Login error:', err);
            alert(`🔒 Connection error. 
            
If you are developing locally, please use "vercel dev" to start the server. 

If this is production, please check your Vercel logs and ensure you have run the Supabase SQL setup.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch('/api/logout', { method: 'POST', credentials: 'include' });
            setSession(null);
            window.location.href = '/';
        } catch (err) {
            console.error('Logout failed:', err);
            setSession(null);
            window.location.href = '/';
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regPassword !== regConfirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setIsRegistering(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: regEmail, password: regPassword }),
            });

            if (res.ok) {
                alert('✨ Owner account registered successfully! You can now log in.');
                setLoginMode('login');
                setEmail(regEmail);
                setPassword(''); // Clear passwords
            } else {
                let errorMsg = 'Failed to register';
                try {
                    const data = await res.json();
                    errorMsg = data.error || errorMsg;
                } catch (jsonErr) {
                    errorMsg = `Server error (${res.status})`;
                }
                alert(`❌ Registration failed: ${errorMsg}`);
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert(`❌ Connection error. 
            
Check your internet connection. If this is on Vercel, please ensure you have run the Supabase SQL setup and configured your environment variables.`);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setIsSendingReset(true);
        try {
            const res = await fetch('/api/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });

            if (res.ok) {
                setResetSuccess(true);
                setTimeout(() => {
                    setShowForgotModal(false);
                    setResetSuccess(false);
                    setResetEmail('');
                }, 3000);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to send reset link');
            }
        } catch (err) {
            console.error('Reset request error:', err);
            alert('Connection error. Please try again.');
        } finally {
            setIsSendingReset(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ghibli-cream p-4 sm:p-6">
                <div className="max-w-md w-full">
                    <a href="/" className="inline-flex items-center gap-2 text-ghibli-wood hover:text-ghibli-navy mb-8 font-bold transition-all group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Studio
                    </a>
                    <div className="card-ghibli p-10 bg-white/40 backdrop-blur-xl border border-white/20 text-center shadow-2xl rounded-[2rem]">
                        <h1 className="text-3xl font-bold text-ghibli-navy font-serif mb-2">Admin Dashboard</h1>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-ghibli-wood/60 uppercase block mb-8">🔒 Secure Authentication System</span>

                        {/* Login/Setup Tabs */}
                        <div className="flex bg-ghibli-paper/20 p-1 rounded-xl mb-8">
                            <button
                                onClick={() => setLoginMode('login')}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${loginMode === 'login' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    setLoginMode('register');
                                    setRegPassword('');
                                    setRegConfirmPassword('');
                                }}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${loginMode === 'register' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                            >
                                Register
                            </button>
                        </div>

                        {loginMode === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-6 text-left">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors rounded-full hover:bg-white/50"
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold text-lg hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4 active:scale-95 disabled:opacity-50">
                                    {loading ? 'Logging in...' : 'Enter Studio'}
                                </button>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-sm text-ghibli-wood hover:text-ghibli-navy underline font-bold transition-colors active:scale-95"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6 text-left">
                                <p className="text-xs text-ghibli-charcoal/60 leading-relaxed italic mb-2 text-center">
                                    Create your master owner account. <br /> (Only one account is allowed)
                                </p>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Registration Email</label>
                                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" placeholder="e.g. art@studio.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Create Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                            placeholder="Choose a strong password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors rounded-full hover:bg-white/50"
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={regConfirmPassword}
                                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                                            className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                            placeholder="Repeat your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors rounded-full hover:bg-white/50"
                                            title={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={isRegistering} className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold text-lg hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4 active:scale-95">
                                    {isRegistering ? 'Registering...' : 'Register Owner account'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Forgot Password Modal */}
                {showForgotModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full relative border border-white/20">
                            <button
                                onClick={() => {
                                    setShowForgotModal(false);
                                    setResetEmail('');
                                    setResetSuccess(false);
                                }}
                                className="absolute top-6 right-6 text-ghibli-charcoal/40 hover:text-ghibli-charcoal text-2xl transition-colors"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-ghibli-navy font-serif mb-3">Reset Password</h2>
                                <p className="text-ghibli-charcoal/60 text-sm leading-relaxed">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {resetSuccess ? (
                                <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                        ✨
                                    </div>
                                    <h3 className="text-xl font-bold text-ghibli-navy mb-2">Check Your Email</h3>
                                    <p className="text-ghibli-charcoal/60 text-sm">
                                        If that email exists, a reset link has been sent. This window will close shortly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleRequestReset} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Studio Email</label>
                                        <input
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="w-full p-4 rounded-2xl border border-ghibli-wood/10 bg-ghibli-paper/10 focus:bg-white transition-all text-ghibli-wood font-bold placeholder:text-ghibli-wood/30 shadow-inner focus:ring-2 focus:ring-ghibli-wood/20 outline-none"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSendingReset}
                                        className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-2xl font-bold text-lg hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSendingReset ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : 'Send Reset Link'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(false)}
                                        className="w-full text-center text-sm font-bold text-ghibli-wood/50 hover:text-ghibli-wood transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const activeTab = dashboardTabs.find((tab) => tab.id === adminTab) || dashboardTabs[0];

    return (
        <div className="admin-shell min-h-screen bg-ghibli-cream">
            <aside className="admin-sidebar">
                <a href="/" className="admin-brand" aria-label="Return to Visheshkala website">
                    <span className="admin-brand-mark">V</span>
                    <span><strong>Visheshkala</strong><small>Artist studio</small></span>
                </a>

                <nav className="admin-navigation" aria-label="Dashboard navigation">
                    <span className="admin-nav-label">Workspace</span>
                    {dashboardTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setAdminTab(tab.id)}
                            className={`admin-nav-item ${adminTab === tab.id ? 'is-active' : ''}`}
                        >
                            <DashboardIcon name={tab.icon} />
                            <span>{tab.label}</span>

                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <a href="/" className="admin-site-link"><span>View public site</span><DashboardIcon name="arrow" className="w-4 h-4" /></a>
                    <button onClick={handleSignOut} className="admin-signout">Sign out</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <p className="admin-eyebrow">Studio workspace</p>
                        <h1>{activeTab.label}</h1>
                    </div>
                    <div className="admin-topbar-actions">
                        <a href="/" className="admin-view-site">View site <DashboardIcon name="arrow" className="w-4 h-4" /></a>
                        <button onClick={() => setShowChangePassword(true)} className="admin-account-button" aria-label="Change password">
                            <DashboardIcon name="settings" className="w-[18px] h-[18px]" />
                            <span>Account</span>
                        </button>
                    </div>
                </header>

                <nav className="admin-mobile-nav no-scrollbar" aria-label="Dashboard navigation">
                    {dashboardTabs.map((tab) => (
                        <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={adminTab === tab.id ? 'is-active' : ''}>
                            <DashboardIcon name={tab.icon} className="w-[18px] h-[18px]" />
                            {tab.shortLabel}
                        </button>
                    ))}
                </nav>

                <section className="admin-welcome-card admin-welcome-card-slim">
                    <div>
                        <p className="admin-eyebrow">Studio workspace</p>
                        <h2>{activeTab.description}</h2>
                    </div>
                </section>

                <section className="admin-workspace">
                    {adminTab === 'shop' && (
                        <ShopTab session={session} />
                    )}
                    {adminTab === 'reviews' && <ReviewsTab />}
                    {adminTab === 'leads' && <LeadsTab />}
                    {adminTab === 'site' && <SiteTab />}

                    {adminTab === 'gallery' && <GalleryTab session={session} />}

                </section>

                {/* Change Password Modal */}
                {showChangePassword && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
                            <button
                                onClick={() => {
                                    setShowChangePassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                }}
                                className="absolute top-6 right-6 text-ghibli-charcoal/40 hover:text-ghibli-charcoal text-2xl transition-colors active:scale-90"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-ghibli-charcoal mb-4">Change Password</h2>
                            <p className="text-ghibli-charcoal/60 mb-6">
                                Update your password. You'll receive a confirmation email.
                            </p>

                            <form onSubmit={async (e) => {
                                e.preventDefault();

                                if (newPassword !== confirmNewPassword) {
                                    alert('New passwords do not match!');
                                    return;
                                }

                                if (newPassword.length < 8) {
                                    alert('New password must be at least 8 characters');
                                    return;
                                }

                                try {
                                    const res = await fetch('/api/change-password', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        credentials: 'include',
                                        body: JSON.stringify({ currentPassword, newPassword }),
                                    });

                                    const data = await res.json();

                                    if (res.ok) {
                                        alert('✅ Password updated successfully! Check your email for confirmation.');
                                        setShowChangePassword(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmNewPassword('');
                                    } else {
                                        alert(`❌ ${data.error || 'Failed to update password'}`);
                                    }
                                } catch (err) {
                                    console.error('Password change error:', err);
                                    alert('Connection error. Please try again.');
                                }
                            }} className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Current Password</label>
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                        placeholder="Enter current password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-[42px] w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors"
                                    >
                                        {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">New Password</label>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                        placeholder="Enter new password"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-[42px] w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors"
                                    >
                                        {showNewPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Confirm New Password</label>
                                    <input
                                        type={showConfirmNewPassword ? "text" : "password"}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                        placeholder="Confirm new password"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                        className="absolute right-3 top-[42px] w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors"
                                    >
                                        {showConfirmNewPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-ghibli-wood text-white rounded-xl font-bold hover:bg-[#A0704F] transition-all mt-6 active:scale-95 shadow-lg"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
