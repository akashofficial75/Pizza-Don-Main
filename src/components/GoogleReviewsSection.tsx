import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Star, CheckCircle, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleReview } from '../types';

interface GoogleReviewsSectionProps {
  reviews?: GoogleReview[];
}

const DEFAULT_REVIEWS: GoogleReview[] = [
  {
    id: 'rev-1',
    authorName: 'Tanvir Ahmed',
    rating: 5,
    timeAgo: '2 weeks ago',
    comment: 'Best pizza in Dhamrai! The Turkish Meat Lover 12" is loaded with cheese and toppings. The Don vibe is classy and perfect for family hangouts at Thana Stand.',
    badge: 'Local Guide'
  },
  {
    id: 'rev-2',
    authorName: 'Fahmida Rahman',
    rating: 5,
    timeAgo: '1 month ago',
    comment: 'We celebrated my brother’s birthday here. Excellent table service and the Motka Meat Box & Naga Wings were incredible. 5/5 stars!',
    badge: 'Verified Customer'
  },
  {
    id: 'rev-3',
    authorName: 'Sajidul Islam',
    rating: 5,
    timeAgo: '3 weeks ago',
    comment: 'The Italian-American mob-boss interior theme looks stunning! Also their WhatsApp order reply is super fast. Highly recommend Kacha Aamer Juice after spicy pizza.',
    badge: 'Dhamrai Resident'
  },
  {
    id: 'rev-4',
    authorName: 'Mahmudur Chowdhury',
    rating: 5,
    timeAgo: '2 months ago',
    comment: 'Finally an upscale boutique pizzeria in Dhamrai! The crust is hand-tossed and fresh. House Special pizza is worth every Taka.',
    badge: 'Foodie'
  },
  {
    id: 'rev-5',
    authorName: 'Afrin Sultana',
    rating: 5,
    timeAgo: '1 month ago',
    comment: 'Loved the atmosphere at Monowar Complex. Clean, hygienic, and very courteous staff. Will definitely visit again.',
    badge: 'Verified Customer'
  },
  {
    id: 'rev-6',
    authorName: 'Rakib Hossain',
    rating: 5,
    timeAgo: '3 weeks ago',
    comment: 'BBQ Blaze Pizza & Oreo Shake combination is top notch! Very reasonable price for such premium quality in Dhamrai.',
    badge: 'Local Guide'
  },
  {
    id: 'rev-7',
    authorName: 'Kamrul Hasan',
    rating: 4,
    timeAgo: '1 week ago',
    comment: 'Food was really tasty, especially the Naga Wings. Delivery took a bit longer than expected on a Friday night, but worth the wait.',
    badge: 'Verified Customer'
  },
  {
    id: 'rev-8',
    authorName: 'Nusrat Jahan',
    rating: 3,
    timeAgo: '5 days ago',
    comment: 'Taste is good overall, but I felt the portion for the price could be a little bigger. Will try their pizza next time.',
    badge: 'Foodie'
  },
  {
    id: 'rev-9',
    authorName: 'Imran Kabir',
    rating: 4,
    timeAgo: '2 weeks ago',
    comment: 'Loved the Beef Boss Supreme pizza! Service was a bit slow during a busy evening but the staff were polite and the food made up for it.',
    badge: 'Local Guide'
  }
];

export default function GoogleReviewsSection({ reviews }: GoogleReviewsSectionProps) {
  const activeReviews = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  const prevIndexRef = useRef(0);

  // Triple reviews array for infinite seamless looping
  const duplicatedReviews = [...activeReviews, ...activeReviews, ...activeReviews];

  // Calculate average rating
  const avgRating = (
    activeReviews.reduce((acc, r) => acc + r.rating, 0) / activeReviews.length
  ).toFixed(1);

  // Next & Prev slide actions
  const handleNext = useCallback(() => {
    if (activeReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
  }, [activeReviews.length]);

  const handlePrev = useCallback(() => {
    if (activeReviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);
  }, [activeReviews.length]);

  // Auto-advance interval every 3.5 seconds
  useEffect(() => {
    if (isHovered || isDragging || activeReviews.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, isDragging, activeReviews.length, handleNext]);

  // Smooth scroll to target card whenever currentIndex changes
  useEffect(() => {
    if (!scrollRef.current || activeReviews.length === 0) return;
    const container = scrollRef.current;
    const prevIdx = prevIndexRef.current;
    prevIndexRef.current = currentIndex;

    let targetDOMIndex = activeReviews.length + currentIndex;
    let isWrappingForward = false;
    let isWrappingBackward = false;

    if (prevIdx === activeReviews.length - 1 && currentIndex === 0) {
      isWrappingForward = true;
      targetDOMIndex = activeReviews.length * 2; // Scroll into 3rd set
    } else if (prevIdx === 0 && currentIndex === activeReviews.length - 1) {
      isWrappingBackward = true;
      targetDOMIndex = activeReviews.length - 1; // Scroll into 1st set
    }

    const targetCard = container.children[targetDOMIndex] as HTMLElement;
    if (targetCard) {
      const targetLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });

      if (isWrappingForward) {
        const timer = setTimeout(() => {
          const middleCard = container.children[activeReviews.length] as HTMLElement;
          if (middleCard) {
            container.scrollTo({
              left: middleCard.offsetLeft - container.offsetLeft,
              behavior: 'instant' as ScrollBehavior
            });
          }
        }, 500);
        return () => clearTimeout(timer);
      } else if (isWrappingBackward) {
        const timer = setTimeout(() => {
          const middleCard = container.children[activeReviews.length * 2 - 1] as HTMLElement;
          if (middleCard) {
            container.scrollTo({
              left: middleCard.offsetLeft - container.offsetLeft,
              behavior: 'instant' as ScrollBehavior
            });
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, activeReviews.length]);

  // Initial scroll position setup
  useEffect(() => {
    if (scrollRef.current && activeReviews.length > 0) {
      const container = scrollRef.current;
      const initialCard = container.children[activeReviews.length] as HTMLElement;
      if (initialCard) {
        container.scrollLeft = initialCard.offsetLeft - container.offsetLeft;
      }
    }
  }, [activeReviews.length]);

  // Drag / Swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!scrollRef.current || activeReviews.length === 0) return;
    const container = scrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const currentScroll = container.scrollLeft;
    let minDiff = Infinity;
    let closestIndex = 0;

    children.forEach((child, domIdx) => {
      const childLeft = child.offsetLeft - container.offsetLeft;
      const diff = Math.abs(childLeft - currentScroll);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = domIdx % activeReviews.length;
      }
    });

    setCurrentIndex(closestIndex);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setStartScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
  };

  return (
    <section id="reviews" className="py-20 bg-[#0D0D0D] border-t border-b border-amber-500/20 relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>GOOGLE VERIFIED REVIEWS • DHAMRAI</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F5EFE2]">
            LOVED BY THE DHAMRAI COMMUNITY
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-serif text-2xl font-bold text-amber-300">
              {avgRating} ★★★★★
            </span>
            <span className="text-xs font-mono uppercase text-[#F5EFE2]/60 px-2.5 py-1 rounded bg-white/5 border border-white/10">
              {activeReviews.length}+ Google Reviews
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/70 mt-3">
            Read what our guests say about our 12-inch Turkish Meat Lover, signature Motka Meat Box, and private event celebrations at Monowar Complex.
          </p>
        </div>

        {/* Carousel Container Wrapper with Subtle Left/Right Arrow Overlay on Desktop */}
        <div
          className="relative group/carousel overflow-hidden max-w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleDragEnd();
          }}
        >
          {/* Left & Right Soft Fade Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent z-10 pointer-events-none" />

          {/* Left / Right Arrow Nav Buttons */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/80 hover:bg-amber-500 text-amber-300 hover:text-[#0D0D0D] border border-amber-500/30 transition-all shadow-xl active:scale-90"
            aria-label="Previous Review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:left-auto sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/80 hover:bg-amber-500 text-amber-300 hover:text-[#0D0D0D] border border-amber-500/30 transition-all shadow-xl active:scale-90"
            aria-label="Next Review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-4 px-2 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedReviews.map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="w-[82vw] sm:w-[350px] lg:w-[calc((100%-3rem)/3)] max-w-[380px] shrink-0 p-6 rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Rating & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-amber-500/10 text-amber-500/30'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{rev.badge}</span>
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-[#F5EFE2]/90 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Author */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-0.5">
                      <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center font-serif font-bold text-amber-300 text-sm">
                        {rev.authorName.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#F5EFE2]">
                        {rev.authorName}
                      </h4>
                      <span className="text-[11px] text-amber-100/60 block">
                        {rev.timeAgo}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-amber-400/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Dhamrai</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {activeReviews.map((rev, idx) => (
            <button
              key={rev.id || idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to review ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-8 bg-amber-400 shadow-[0_0_10px_rgba(212,160,23,0.5)]'
                  : 'w-2.5 bg-white/20 hover:bg-amber-500/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
