import { useState, useEffect, useRef } from 'react';
import { optimizeImageUrl, getOriginalImageUrl } from '../lib/imageUrl';
import { isImageLoaded, markImageLoaded } from '../lib/imageCache';

const ArtworkImage = ({
  src,
  alt = '',
  size = 'card',
  priority = false,
  className = '',
  imgClassName = '',
  placeholderClassName = '',
  objectFit = 'object-cover',
  onLoad,
  onError,
}) => {
  const optimizedSrc = optimizeImageUrl(src, size);
  const originalSrc = getOriginalImageUrl(src);

  const [currentSrc, setCurrentSrc] = useState(optimizedSrc);
  const [phase, setPhase] = useState(() =>
    optimizedSrc && isImageLoaded(optimizedSrc) ? 'loaded' : 'loading'
  );
  const imgRef = useRef(null);

  useEffect(() => {
    setCurrentSrc(optimizedSrc);
    if (!optimizedSrc) {
      setPhase('error');
      return;
    }
    if (isImageLoaded(optimizedSrc)) {
      setPhase('loaded');
      return;
    }
    setPhase('loading');
  }, [optimizedSrc]);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      markImageLoaded(img.currentSrc || currentSrc);
      setPhase('loaded');
    }
  }, [currentSrc]);

  const handleLoad = (e) => {
    markImageLoaded(e.currentTarget.currentSrc || currentSrc);
    setPhase('loaded');
    onLoad?.(e);
  };

  const handleError = () => {
    if (currentSrc !== originalSrc && originalSrc) {
      setCurrentSrc(originalSrc);
      setPhase('loading');
      return;
    }
    setPhase('error');
    onError?.();
  };

  if (!src?.trim() || phase === 'error') {
    return (
      <div
        className={`w-full h-full flex items-center justify-center flex-col gap-2 bg-ghibli-paper ${className}`}
      >
        <span className="text-4xl opacity-10">🎨</span>
        <span className="text-[10px] font-bold tracking-widest text-ghibli-charcoal/20 uppercase">
          In Progress
        </span>
      </div>
    );
  }

  const isLoaded = phase === 'loaded';
  const instant = isLoaded && isImageLoaded(currentSrc);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-ghibli-paper ${className}`}>
      {!instant && (
        <div
          className={`absolute inset-0 bg-ghibli-wood/[0.06] transition-opacity duration-200 ${
            isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${placeholderClassName}`}
          aria-hidden
        />
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full ${objectFit} ${
          instant ? '' : 'transition-opacity duration-200 ease-out'
        } ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
};

export default ArtworkImage;
