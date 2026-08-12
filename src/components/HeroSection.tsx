import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Phone, Calendar, ArrowRight, Star, MapPin, Clock, Flame, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessSettings } from '../types';

// ============================================================================
// EASY-TO-EDIT HERO CAROUSEL SETTINGS
// Store the array of image URLs and badge text in a single easy-to-edit list
// ============================================================================
export const HERO_CAROUSEL_ITEMS = [
  {
    id: 'pizza-1',
    title: 'Turkish Meat Lover',
    category: 'Signature Artisan Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'pizza-2',
    title: 'Naga Fire Blast',
    category: 'Extremely Spicy & Loaded',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'pizza-3',
    title: 'Beef Boss Supreme',
    category: 'Gourmet Beef & Cheese',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'pizza-4',
    title: 'Chicken Pepperoni',
    category: 'Italian Classic Delight',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'pizza-5',
    title: 'Meat Lover',
    category: 'All-Meat Family Feast',
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=1000&auto=format&fit=crop',
  },
];

export const HERO_FLOATING_BADGES = [
  {
    id: 'badge-1',
    icon: '🔥',
    title: 'Hot Selling',
    subtitle: 'Crowd Favorite',
    position: 'top-left',
  },
  {
    id: 'badge-2',
    icon: '🛵',
    title: 'Fast Delivery',
    subtitle: 'Within 30 mins',
    position: 'bottom-right',
  },
];

interface HeroSectionProps {
  settings: BusinessSettings;
  onExploreMenu: () => void;
  onBookTable: () => void;
  onSelectCategory: (catName: string) => void;
}

export default function HeroSection({
  settings,
  onExploreMenu,
  onBookTable,
  onSelectCategory
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragEndX, setDragEndX] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const carouselItems = React.useMemo(() => {
    if (settings?.heroImageUrl) {
      return [
        {
          id: 'custom-uploaded-hero-banner',
          title: settings.heroTagline || 'Pizza Don Signature',
          category: 'Homepage Banner',
          imageUrl: settings.heroImageUrl,
        },
        ...HERO_CAROUSEL_ITEMS
      ];
    }
    return HERO_CAROUSEL_ITEMS;
  }, [settings?.heroImageUrl, settings?.heroTagline]);

  // Safe index bounds
  const safeCurrentIndex = currentIndex >= carouselItems.length ? 0 : currentIndex;
  const currentSlide = carouselItems[safeCurrentIndex] || carouselItems[0];

  // Auto cycle every 4 seconds
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  }, [carouselItems.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) =>
      (prev - 1 + carouselItems.length) % carouselItems.length
    );
  }, [carouselItems.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 4000);
    return () => clearInterval(timer);
  }, [nextImage]);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch swipe handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextImage();
    } else if (distance < -minSwipeDistance) {
      prevImage();
    }
  };

  // Mouse drag handlers for desktop manual swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragEndX(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStartX === null || dragEndX === null) {
      setIsDragging(false);
      return;
    }
    const distance = dragStartX - dragEndX;
    if (distance > minSwipeDistance) {
      nextImage();
    } else if (distance < -minSwipeDistance) {
      prevImage();
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#0D0D0D] overflow-hidden pt-24 sm:pt-28 pb-16 w-full max-w-full">
      {/* Subtle background film-grain & warm ambient gold light-leaks */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative stamped Fedora emblem watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full border-[24px] border-amber-400 flex items-center justify-center">
          <span className="font-serif text-[280px] font-bold text-amber-300">DON</span>
        </div>
      </div>

      {/* Optional Admin-Uploaded Hero Banner Overlay */}
      {settings.heroImageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={settings.heroImageUrl}
            alt="Hero Banner"
            className="w-full h-full object-cover opacity-20 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Title, Italian-American Mob Boss Elegance, & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Dhamrai Location & Google Rating Pill */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md shadow-lg max-w-full overflow-hidden">
              <span className="flex items-center gap-1 text-amber-300 font-bold text-xs shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>5.0★</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0" />
              <span className="text-xs text-[#F5EFE2]/90 tracking-wide font-mono uppercase truncate">
                Thana Stand, Dhamrai
              </span>
              <span className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0 hidden xs:inline-block" />
              <span className="text-xs text-emerald-400 font-medium shrink-0 hidden xs:inline-block">
                Open Daily 12PM–10 PM
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#F5EFE2] leading-[1.08]">
                PIZZA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">DON</span>
              </h1>
              <p className="font-serif text-xl sm:text-2xl text-amber-200/90 italic font-normal">
                "{settings.heroTagline}"
              </p>
            </div>

            {/* Story & Description */}
            <p className="text-sm sm:text-base text-[#F5EFE2]/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {settings.heroSubtitle}
            </p>

            {/* Primary Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="https://wa.me/8801729668090"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-[#0D0D0D] font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-amber-600/30 hover:shadow-amber-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-4 h-4 fill-[#0D0D0D]" />
                <span>Order on WhatsApp</span>
              </a>

              <button
                onClick={onBookTable}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1A1A1A] hover:bg-[#222222] border border-amber-500/40 text-amber-300 font-semibold text-sm sm:text-base tracking-wide shadow-lg hover:border-amber-400 transition-all"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Book a Table / Event</span>
              </button>
            </div>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t border-amber-500/20 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div className="min-w-0">
                <span className="block font-serif text-base sm:text-lg font-bold text-amber-300 truncate">48-Hr</span>
                <span className="text-[10px] sm:text-[11px] text-amber-100/60 uppercase tracking-wider block truncate">Fermented Dough</span>
              </div>
              <div className="min-w-0">
                <span className="block font-serif text-base sm:text-lg font-bold text-amber-300 truncate">100%</span>
                <span className="text-[10px] sm:text-[11px] text-amber-100/60 uppercase tracking-wider block truncate">Halal Ingredients</span>
              </div>
              <div className="min-w-0">
                <span className="block font-serif text-base sm:text-lg font-bold text-amber-300 truncate">64+</span>
                <span className="text-[10px] sm:text-[11px] text-amber-100/60 uppercase tracking-wider block truncate">Gourmet Options</span>
              </div>
            </div>
          </div>

          {/* Right Column: Auto-Changing Circular Food Image Carousel */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-8 sm:py-6 w-full">
            {/* Soft glowing orange/gold radial glow behind the circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div
                className="w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-orange-500/35 via-amber-500/30 to-yellow-500/20 blur-[70px] opacity-80 animate-pulse"
                style={{ borderRadius: '50%' }}
              />
            </div>

            {/* Circular wooden board / plate frame wrapper with floating badges */}
            <div className="relative flex flex-col items-center max-w-full z-10">
              {/* Floating Badge 1: Hot Selling / Crowd Favorite */}
              <div className="absolute -top-3 left-0 sm:-left-6 z-30 bg-[#141414]/95 border border-amber-500/40 backdrop-blur-xl rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-2xl flex items-center gap-2 sm:gap-2.5 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 max-w-[85vw]">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {HERO_FLOATING_BADGES[0].icon}
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-serif font-bold text-amber-300 leading-tight truncate">
                    {HERO_FLOATING_BADGES[0].title}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#F5EFE2]/70 font-sans leading-tight mt-0.5 truncate">
                    {HERO_FLOATING_BADGES[0].subtitle}
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Fast Delivery / Within 30 mins */}
              <div className="absolute -bottom-3 right-0 sm:-right-6 z-30 bg-[#141414]/95 border border-amber-500/40 backdrop-blur-xl rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-2xl flex items-center gap-2 sm:gap-2.5 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 max-w-[85vw]">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {HERO_FLOATING_BADGES[1].icon}
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-serif font-bold text-amber-300 leading-tight truncate">
                    {HERO_FLOATING_BADGES[1].title}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#F5EFE2]/70 font-sans leading-tight mt-0.5 truncate">
                    {HERO_FLOATING_BADGES[1].subtitle}
                  </div>
                </div>
              </div>

              {/* The Circular Wooden Board / Plate Frame */}
              <div
                className="relative p-2.5 sm:p-4 aspect-square rounded-full bg-gradient-to-br from-[#2E1E10] via-[#1A120B] to-[#110B07] border-2 border-amber-500/40 flex items-center justify-center cursor-grab active:cursor-grabbing select-none max-w-full filter drop-shadow-[0_0_30px_rgba(245,158,11,0.3)] overflow-hidden"
                style={{
                  borderRadius: '50%',
                  WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                  maskImage: 'radial-gradient(white, black)',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  willChange: 'transform',
                  isolation: 'isolate'
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {/* Authentic wooden board rim / inner groove */}
                <div
                  className="absolute inset-1.5 sm:inset-3 rounded-full border border-amber-400/20 pointer-events-none"
                  style={{
                    borderRadius: '50%',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)'
                  }}
                />

                {/* Circular image mask */}
                <div
                  className="w-56 h-56 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square rounded-full overflow-hidden relative bg-[#121212]"
                  style={{
                    borderRadius: '50%',
                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                    maskImage: 'radial-gradient(white, black)',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    willChange: 'transform',
                    isolation: 'isolate'
                  }}
                >
                  <AnimatePresence>
                    <motion.img
                      key={currentSlide.id}
                      src={currentSlide.imageUrl}
                      alt={currentSlide.title}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-full"
                      style={{
                        borderRadius: '50%',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    />
                  </AnimatePresence>

                  {/* Subtle inner plate shadow & rim vignette */}
                  <div
                    className="absolute inset-0 rounded-full border-4 border-black/30 shadow-[inset_0_0_35px_rgba(0,0,0,0.65)] pointer-events-none z-10"
                    style={{
                      borderRadius: '50%',
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)'
                    }}
                  />

                  {/* Cinematic soft gradient vignette overlay at bottom of circle */}
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/60 to-transparent pt-12 pb-5 px-4 text-center pointer-events-none flex flex-col items-center">
                    {/* Thin 1px gold/orange gradient line divider right above text */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent mb-2.5" />

                    {/* Subtle backdrop-blur glass effect behind text area only */}
                    <div className="w-full max-w-[94%] px-3 py-1.5 rounded-xl backdrop-blur-sm bg-black/25">
                      <div className="text-sm sm:text-base font-serif font-bold text-[#F5EFE2] truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] tracking-wide">
                        {currentSlide.title}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-[#C4BCB3] truncate uppercase tracking-widest mt-0.5 font-sans">
                        {currentSlide.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elongated Orange Dot Indicators Below Image */}
              <div className="flex items-center justify-center gap-2 mt-6 z-20">
                {carouselItems.map((item, idx) => {
                  const isActive = idx === safeCurrentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goToImage(idx)}
                      aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-8 bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-orange-500/50'
                          : 'w-2.5 bg-amber-500/25 hover:bg-amber-500/50'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
