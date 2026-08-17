import useAnnouncementBar from '../hooks/useAnnouncementBar';

const AnnouncementBar = () => {
  const { items, isVisible } = useAnnouncementBar();

  if (!isVisible) return null;

  const doubled = [...items, ...items];

  return (
    <div className="bg-gold-gradient text-white text-[9px] font-bold tracking-[0.18em] uppercase overflow-hidden">
      <div className="flex items-center h-6">
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {doubled.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-8">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
