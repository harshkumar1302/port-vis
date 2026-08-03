import { useEffect, useRef } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import useAnnouncementBar from '../hooks/useAnnouncementBar';

const SiteHeader = () => {
  const headerRef = useRef(null);
  const { isVisible } = useAnnouncementBar();

  useEffect(() => {
    const syncHeaderMetrics = () => {
      const height = headerRef.current?.offsetHeight ?? 72;
      document.documentElement.style.setProperty('--site-header-height', `${height}px`);
      document.documentElement.style.setProperty(
        '--announcement-offset',
        isVisible ? '28px' : '0px'
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
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[110] bg-white/95 backdrop-blur-xl">
      <AnnouncementBar />
      <Navbar />
    </header>
  );
};

export default SiteHeader;
