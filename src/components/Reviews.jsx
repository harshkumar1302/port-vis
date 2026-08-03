import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';

const MOCK_REVIEWS = [
  { id: 1, name: "Priya Sharma", rating: 5, message: "The attention to detail on the floral wall decor is just mind-blowing. It completely transformed my living room. Highly recommend!", avatar_url: null, verified: true },
  { id: 2, name: "Ananya Desai", rating: 5, message: "Handmade with so much love! I bought the customized nameplate for my new house and everyone asks me where I got it from. It's beautiful.", avatar_url: null, verified: true },
  { id: 3, name: "Rohan Gupta", rating: 5, message: "Gifted a custom portrait to my wife for our anniversary. The craftsmanship is flawless and the packaging was so premium. Thank you!", avatar_url: null, verified: true },
  { id: 4, name: "Meera Reddy", rating: 5, message: "I've never seen such intricate handmade art before. Every piece feels like it has a soul. Will definitely be purchasing more for my studio.", avatar_url: null, verified: true },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? 'text-[#D88A92] drop-shadow-sm' : 'text-ghibli-wood/20'}>★</span>
    ))}
  </div>
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

  // Duplicate reviews heavily to ensure the marquee is wide enough to infinitely scroll seamlessly
  const marqueeItems = [...displayReviews, ...displayReviews, ...displayReviews, ...displayReviews, ...displayReviews, ...displayReviews];
  
  // Split into two rows for the dual-marquee effect
  const half = Math.ceil(marqueeItems.length / 2);
  const row1 = marqueeItems.slice(0, half);
  const row2 = marqueeItems.slice(half);

  const ReviewCard = ({ review, index, tilt }) => (
    <div 
      className={`min-w-[240px] sm:min-w-[280px] md:min-w-[340px] relative group bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-8 border border-ghibli-wood/10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 ${tilt % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'}`}
    >
      {/* Watermark Quote Icon */}
      <div className="absolute top-4 right-8 text-[100px] font-serif leading-none text-[#D88A92]/5 select-none pointer-events-none transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700">
        "
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <StarRating rating={review.rating || 5} />
        
        <p className="text-ghibli-charcoal/80 text-base leading-relaxed my-6 flex-grow font-serif italic relative">
          "{review.message}"
        </p>
        
        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-ghibli-wood/10">
          <div className="w-12 h-12 rounded-full bg-[#FAF0F1] flex items-center justify-center font-extrabold text-[#D88A92] shadow-inner overflow-hidden ring-2 ring-white">
            {review.avatar_url ? (
              <img src={review.avatar_url} alt={review.name} className="w-full h-full object-cover" />
            ) : (
              review.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <div className="font-bold text-ghibli-charcoal font-sans text-[15px]">{review.name}</div>
            {review.verified && (
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#D88A92] font-extrabold mt-1">Verified Buyer</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="reviews" className="defer-section relative py-20 sm:py-32 md:py-40 bg-gradient-to-b from-ghibli-cream via-[#FAF8F5] to-ghibli-cream overflow-hidden isolate">
      
      {/* Background Ornaments */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#D88A92]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-ghibli-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="page-container max-w-7xl mb-16 sm:mb-20">
        <div className="text-center space-y-6">
          <span className="reveal-up inline-block text-[#D88A92] text-[11px] font-extrabold tracking-[0.3em] uppercase">
            Loved by the Visheshkala Family
          </span>
          <h2 className="reveal-up text-4xl md:text-6xl font-extrabold text-ghibli-charcoal font-serif tracking-tight" style={{ animationDelay: '80ms' }}>
            What Our Customers Say
          </h2>
          <div className="reveal-up h-0.5 w-24 bg-[#D88A92]/30 mx-auto rounded-full" style={{ animationDelay: '160ms' }} />
        </div>
      </div>

      {/* Infinite Marquee Rows */}
      <div className="relative w-full flex flex-col gap-8 md:gap-10 overflow-hidden py-10 -my-10 mask-image-gradient contain-paint">
        
        {/* Row 1 - Scrolling Left */}
        <div className="w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee gap-8 md:gap-10 px-4 md:px-5 hover:[animation-play-state:paused]">
            {row1.map((review, i) => (
              <ReviewCard key={`r1-${review.id}-${i}`} review={review} index={i} tilt={i} />
            ))}
          </div>
        </div>

        {/* Row 2 - Scrolling Right */}
        <div className="w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee-reverse gap-8 md:gap-10 px-4 md:px-5 hover:[animation-play-state:paused]">
            {row2.map((review, i) => (
              <ReviewCard key={`r2-${review.id}-${i}`} review={review} index={i} tilt={i + 1} />
            ))}
          </div>
        </div>

      </div>

      {/* Gradient masks for smooth edge fading */}
      <div className="absolute top-0 left-0 w-[15vw] h-full bg-gradient-to-r from-[#FAF8F5] to-transparent z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[15vw] h-full bg-gradient-to-l from-[#FAF8F5] to-transparent z-20 pointer-events-none"></div>

    </section>
  );
};

export default Reviews;
