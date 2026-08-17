import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';

const MOCK_REVIEWS = [
  { id: 1, name: "Priya Sharma", rating: 5, message: "The attention to detail on the floral wall decor is just mind-blowing. It completely transformed my living room. Highly recommend!", avatar_url: null, verified: true, time_ago: "2 months ago", review_image_url: null },
  { id: 2, name: "Ananya Desai", rating: 5, message: "Handmade with so much love! I bought the customized nameplate for my new house and everyone asks me where I got it from. It's beautiful.", avatar_url: null, verified: true, time_ago: "3 months ago", review_image_url: null },
  { id: 3, name: "Rohan Gupta", rating: 5, message: "Gifted a custom portrait to my wife for our anniversary. The craftsmanship is flawless and the packaging was so premium. Thank you!", avatar_url: null, verified: true, time_ago: "1 week ago", review_image_url: null },
  { id: 4, name: "Meera Reddy", rating: 5, message: "I've never seen such intricate handmade art before. Every piece feels like it has a soul. Will definitely be purchasing more for my studio.", avatar_url: null, verified: true, time_ago: "5 days ago", review_image_url: null },
];

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const VerifiedBadge = () => (
  <svg className="w-[14px] h-[14px] text-[#4285F4] shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23,12l-2.44-2.79l0.34-3.69l-3.61-0.82L15.4,1.5L12,2.96L8.6,1.5L6.71,4.69L3.1,5.5L3.44,9.2L1,12l2.44,2.79l-0.34,3.7l3.61,0.82L8.6,22.5l3.4-1.47l3.4,1.46l1.89-3.19l3.61-0.82l-0.34-3.69L23,12z M10.09,16.72l-3.8-3.81l1.48-1.48l2.32,2.33l5.85-5.87l1.48,1.48L10.09,16.72z" />
  </svg>
);

const Reviews = () => {
  const [sectionRef, inView] = useInView('400px');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inView) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/manage-reviews');
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const fetched = await res.json();
          setReviews(fetched?.length ? fetched : MOCK_REVIEWS);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch {
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [inView]);

  if (!inView || loading) return <section ref={sectionRef} id="reviews" className="py-20 md:py-28" aria-hidden />;

  // Use mockReviews if reviews state is somehow empty
  const displayReviews = reviews.length > 0 ? reviews : MOCK_REVIEWS;

  // Duplicate once so the marquee loop is wide enough without bloating the DOM
  const marqueeItems = [...displayReviews, ...displayReviews];
  
  // Split into two rows for the dual-marquee effect
  const half = Math.ceil(marqueeItems.length / 2);
  const row1 = marqueeItems.slice(0, half);
  const row2 = marqueeItems.slice(half);

  const ReviewCard = ({ review }) => (
    <div 
      className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] bg-[#f8f9fa] rounded-3xl p-5 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="flex justify-between items-start mb-3">
         <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[#369595] flex items-center justify-center font-normal text-white text-[17px] shrink-0 overflow-hidden ring-2 ring-white shadow-sm">
               {review.avatar_url ? (
                 <img src={review.avatar_url} alt={review.name} className="w-full h-full object-cover" />
               ) : (
                 review.name?.[0]?.toUpperCase()
               )}
            </div>
            <div className="flex flex-col pt-0.5">
               <span className="font-semibold text-[#202124] text-[15px] tracking-tight leading-none">{review.name}</span>
               <span className="text-[13px] text-[#70757a] font-medium mt-1">{review.time_ago || '1 month ago'}</span>
            </div>
         </div>
         <GoogleLogo />
      </div>
      
      <div className="flex items-center gap-1.5 mb-3">
         <div className="flex gap-[2px]">
           {Array.from({length: 5}).map((_, i) => (
             <svg key={i} className={`w-[14px] h-[14px] ${i < (review.rating || 5) ? 'text-[#fbbc04]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
           ))}
         </div>
         {review.verified && <VerifiedBadge />}
      </div>
      
      <div className="flex gap-4 items-start flex-grow">
         <p className="text-[#3c4043] leading-[1.6] text-[15px] font-[400] flex-1">
           {review.message}
         </p>
         {review.review_image_url && (
           <div className="shrink-0 relative mt-1">
             <img src={review.review_image_url} alt="Review attachment" className="w-[84px] h-[84px] rounded-xl object-cover shadow-sm border border-black/5" />
           </div>
         )}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="reviews" className="defer-section relative py-20 sm:py-32 md:py-40 bg-white overflow-hidden isolate">
      
      {/* Background Ornaments (Subdued for the new design) */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#f8f9fa] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="page-container max-w-7xl mb-16 sm:mb-20">
        <div className="text-center space-y-6">
          <span className="reveal-up inline-block text-[#D88A92] text-[11px] font-extrabold tracking-[0.3em] uppercase">
            Loved by the Visheshkala Family
          </span>
          <h2 className="reveal-up text-4xl md:text-6xl font-extrabold text-[#202124] font-serif tracking-tight" style={{ animationDelay: '80ms' }}>
            What Our Customers Say
          </h2>
          <div className="reveal-up h-0.5 w-24 bg-[#D88A92]/30 mx-auto rounded-full" style={{ animationDelay: '160ms' }} />
        </div>
      </div>

      {/* Infinite Marquee Rows */}
      <div className="relative w-full flex flex-col gap-6 md:gap-8 overflow-hidden py-4 mask-image-gradient contain-paint">
        
        {/* Row 1 - Scrolling Left */}
        <div className="w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee gap-6 md:gap-8 px-3 md:px-4 hover:[animation-play-state:paused]">
            {row1.map((review, i) => (
              <ReviewCard key={`r1-${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>

        {/* Row 2 - Scrolling Right */}
        <div className="w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee-reverse gap-6 md:gap-8 px-3 md:px-4 hover:[animation-play-state:paused]">
            {row2.map((review, i) => (
              <ReviewCard key={`r2-${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>

      </div>

      {/* Gradient masks for smooth edge fading */}
      <div className="absolute top-0 left-0 w-[15vw] h-full bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[15vw] h-full bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

    </section>
  );
};

export default Reviews;
