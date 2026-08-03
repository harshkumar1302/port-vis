import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const HIDDEN_PATHS = ['/', '/admin', '/reset-password'];

function getNavTarget(pathname) {
  if (pathname.startsWith('/shop/') && pathname !== '/shop') {
    return { to: '/shop', label: 'Shop' };
  }
  if (pathname.startsWith('/gallery/')) {
    return { to: '/gallery', label: 'Gallery' };
  }
  return { to: '/', label: 'Home' };
}

const PageWayfinding = () => {
  const { pathname } = useLocation();
  const navRef = useRef(null);

  const hidden = HIDDEN_PATHS.includes(pathname);

  useEffect(() => {
    const root = document.documentElement;
    if (hidden) {
      root.style.setProperty('--page-wayfinding-height', '0px');
      return;
    }
    const setHeight = () => {
      const h = navRef.current?.offsetHeight ?? 40;
      root.style.setProperty('--page-wayfinding-height', `${h}px`);
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
      root.style.setProperty('--page-wayfinding-height', '0px');
    };
  }, [hidden, pathname]);

  if (hidden) return null;

  const { to, label } = getNavTarget(pathname);

  return (
    <nav
      ref={navRef}
      aria-label="Page navigation"
      className="border-b border-ghibli-wood/8 bg-ghibli-cream/60"
    >
      <div className="page-container max-w-[1400px] py-3">
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 min-h-[44px] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-ghibli-charcoal/55 hover:text-ghibli-wood transition-colors"
        >
          <span aria-hidden>←</span>
          {label}
        </Link>
      </div>
    </nav>
  );
};

export default PageWayfinding;
