import OverviewTab from './tabs/OverviewTab';
import ReviewsTab from './tabs/ReviewsTab';
import LeadsTab from './tabs/LeadsTab';
import SiteTab from './tabs/SiteTab';
import ShopTab from './tabs/ShopTab';
import GalleryTab from './tabs/GalleryTab';
import { dashboardTabs, DashboardIcon } from './AdminConstants';

const DesktopAdminShell = ({ adminTab, setAdminTab, session, handleSignOut, setShowChangePassword }) => {
    const activeTab = dashboardTabs.find((tab) => tab.id === adminTab) || dashboardTabs[0];

    return (
        <div className="admin-shell bg-ghibli-cream">
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
                        <a href="/" className="admin-view-site text-sm font-bold text-ghibli-wood hover:text-ghibli-navy flex items-center gap-1 transition-colors">View site <DashboardIcon name="arrow" className="w-4 h-4" /></a>
                        <button onClick={() => setShowChangePassword(true)} className="admin-account-button flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-ghibli-wood/10 hover:shadow-md transition-all font-bold text-sm text-ghibli-charcoal" aria-label="Change password">
                            <DashboardIcon name="settings" className="w-[18px] h-[18px] text-ghibli-wood" />
                            <span>Account</span>
                        </button>
                    </div>
                </header>

                {adminTab !== 'gallery' && adminTab !== 'shop' && adminTab !== 'overview' && (
                <section className="admin-welcome-card admin-welcome-card-slim bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm mb-6 mt-2">
                    <div>
                        <p className="admin-eyebrow">Studio workspace</p>
                        <h2 className="text-xl font-bold text-ghibli-navy">{activeTab.description}</h2>
                    </div>
                </section>
                )}

                <section className="admin-workspace">
                    {adminTab === 'overview' && <OverviewTab onNavigate={setAdminTab} />}
                    {adminTab === 'shop' && <ShopTab session={session} />}
                    {adminTab === 'reviews' && <ReviewsTab />}
                    {adminTab === 'leads' && <LeadsTab />}
                    {adminTab === 'site' && <SiteTab />}
                    {adminTab === 'gallery' && <GalleryTab session={session} />}
                </section>
            </main>
        </div>
    );
};

export default DesktopAdminShell;
