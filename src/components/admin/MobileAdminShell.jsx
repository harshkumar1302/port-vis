import OverviewTab from './tabs/OverviewTab';
import ReviewsTab from './tabs/ReviewsTab';
import LeadsTab from './tabs/LeadsTab';
import SiteTab from './tabs/SiteTab';
import ShopTab from './tabs/ShopTab';
import GalleryTab from './tabs/GalleryTab';
import { dashboardTabs, DashboardIcon } from './AdminConstants';

const MobileAdminShell = ({ adminTab, setAdminTab, session, handleSignOut, setShowChangePassword }) => {
    const activeTab = dashboardTabs.find((tab) => tab.id === adminTab) || dashboardTabs[0];

    return (
        <div className="mobile-admin-shell bg-ghibli-cream min-h-screen flex flex-col">
            {/* Top Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm px-5 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-ghibli-navy font-serif">{activeTab.label}</h1>
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-ghibli-wood">Visheshkala Admin</p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/" className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-ghibli-wood/10 shadow-sm text-ghibli-wood" aria-label="View site">
                        <DashboardIcon name="arrow" className="w-4 h-4" />
                    </a>
                    <button onClick={() => setShowChangePassword(true)} className="w-9 h-9 rounded-full bg-ghibli-wood text-white flex items-center justify-center shadow-md" aria-label="Account Settings">
                        <span className="font-bold text-sm">V</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
                {adminTab !== 'gallery' && adminTab !== 'shop' && adminTab !== 'overview' && (
                <section className="bg-white/40 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm mb-6">
                    <h2 className="text-sm font-bold text-ghibli-charcoal/80 leading-relaxed">{activeTab.description}</h2>
                </section>
                )}

                <section className="admin-workspace-mobile">
                    {adminTab === 'overview' && <OverviewTab onNavigate={setAdminTab} />}
                    {adminTab === 'shop' && <ShopTab session={session} />}
                    {adminTab === 'reviews' && <ReviewsTab />}
                    {adminTab === 'leads' && <LeadsTab />}
                    {adminTab === 'site' && <SiteTab />}
                    {adminTab === 'gallery' && <GalleryTab session={session} />}
                </section>
            </main>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-white/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
                <div className="flex justify-around items-center h-16 px-2">
                    {dashboardTabs.map((tab) => {
                        const isActive = adminTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setAdminTab(tab.id)}
                                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                                    isActive ? 'text-ghibli-wood' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'
                                }`}
                            >
                                <div className={`relative flex items-center justify-center w-10 h-8 rounded-full transition-colors ${isActive ? 'bg-ghibli-wood/10' : ''}`}>
                                    <DashboardIcon name={tab.icon} className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                                </div>
                                <span className={`text-[10px] font-extrabold tracking-wide ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                    {tab.shortLabel}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default MobileAdminShell;
