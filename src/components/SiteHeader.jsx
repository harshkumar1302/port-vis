import { useEffect, useRef } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import useAnnouncementBar from '../hooks/useAnnouncementBar';

const SiteHeader = () => {
  const headerRef = useRef(null);
  const { isVisible } = useAnnouncementBar();

  useEffect(() => {
    const syncHeaderMetrics = () => {
      const height = headerRef.current?.offsetHeight ?? 52;
      document.documentElement.style.setProperty('--site-header-height', `${height}px`);
      document.documentElement.style.setProperty(
        '--announcement-offset',
        isVisible ? '24px' : '0px'
      );
    };

    syncHeaderMetrics();
    const observer = new ResizeObserver(syncHeaderMetrics);
    if (headerRef.current) observer.observe(headerRef.current);
    window.addEventListener('resize', syncHeaderMetrics);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeaderMetrics);
    };
  }, [isVisible]);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[110] border-b border-ghibli-wood/8 bg-white/90 backdrop-blur-sm">
      <AnnouncementBar />
      <Navbar />
    </header>
  );
};

export default SiteHeader;
