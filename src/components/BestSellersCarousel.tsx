import React, { useState } from 'react';
import { Flame, Star, Plus, Check } from 'lucide-react';
import { MenuItem } from '../types';
import ItemSizeModal from './ItemSizeModal';

interface BestSellersCarouselProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem, size?: string, notes?: string) => void;
  onOpenCart?: () => void;
}

export default function BestSellersCarousel({
  items,
  onSelectItem,
  onOpenCart
}: BestSellersCarouselProps) {
  const bestSellers = items.filter((item) => item.tags.includes('Best Seller') || item.tags.includes('Spicy')).slice(0, 8);
  const [selectedModalItem, setSelectedModalItem] = useState<MenuItem | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const renderPriceBlock = (price: MenuItem['price']) => {
    if (typeof price === 'number') {
      return (
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[10px] text-amber-200/50 block font-mono uppercase tracking-wider">
            PRICE
          </span>
          <span className="font-mono text-base font-bold text-amber-300">
            ৳{price}
          </span>
        </div>
      );
    }

    const entries = Object.entries(price);
    if (entries.length === 0) return null;

    if (entries.length === 1) {
      const [sz, pr] = entries[0];
      const sizeLabel = /^\d+$/.test(sz) ? `${sz}"` : sz;
      return (
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[10px] text-amber-200/50 block font-mono uppercase tracking-wider">
            PRICE
          </span>
          <div className="flex flex-wrap items-baseline gap-x-1.5 font-mono">
            <span className="text-base font-bold text-amber-300 whitespace-nowrap">৳{pr}</span>
            <span className="text-[11px] text-amber-200/60 font-normal whitespace-nowrap">({sizeLabel})</span>
          </div>
        </div>
      );
    }

    const minVal = Math.min(...Object.values(price));
    const rawSizes = Object.keys(price).sort((a, b) => Number(a) - Number(b));
    const minSizeLabel = /^\d+$/.test(rawSizes[0]) ? `${rawSizes[0]}"` : rawSizes[0];
    const maxSizeLabel = /^\d+$/.test(rawSizes[rawSizes.length - 1]) ? `${rawSizes[rawSizes.length - 1]}"` : rawSizes[rawSizes.length - 1];

    return (
      <div className="flex-1 min-w-0 pr-2">
        <span className="text-[10px] text-amber-200/50 block font-mono uppercase tracking-wider">
          PRICE
        </span>
        <div className="flex flex-wrap items-baseline gap-x-1.5 font-mono">
          <span className="text-sm sm:text-base font-bold text-amber-300 whitespace-nowrap">
            from ৳{minVal}
          </span>
          <span className="text-[11px] text-amber-200/60 font-normal whitespace-nowrap">
            ({minSizeLabel}–{maxSizeLabel})
          </span>
        </div>
      </div>
    );
  };

  const handleCardClick = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.soldOut) return;

    const isPizza = typeof item.price === 'object' || item.category.toLowerCase().includes('pizza');
    if (isPizza) {
      setSelectedModalItem(item);
    } else {
      onSelectItem(item);
      setJustAddedId(item.id);
      setTimeout(() => setJustAddedId(null), 1200);
    }
  };

  return (
    <section className="py-16 bg-[#0D0D0D] border-t border-b border-amber-500/15 relative overflow-hidden w-full max-w-full">
      {/* Decorative Warm Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>THE DON'S SIGNATURE SELECTION</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F5EFE2] mt-1.5">
              DHAMRAI BEST SELLERS
            </h2>
            <p className="text-sm text-amber-100/70 mt-1 max-w-xl">
              Hand-tossed Italian crusts, loaded meat boxes, and gourmet burgers crafted for true connoisseurs.
            </p>
          </div>
        </div>

        {/* Responsive Grid / Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((item) => {
            const isSpicy = item.tags.includes('Spicy');
            const isBestSeller = item.tags.includes('Best Seller');
            const isPizza = typeof item.price === 'object' || item.category.toLowerCase().includes('pizza');
            const isAdded = justAddedId === item.id;

            return (
              <div
                key={item.id}
                onClick={(e) => handleCardClick(item, e)}
                className="group relative rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/60 shadow-xl hover:shadow-[0_10px_35px_rgba(212,160,23,0.18)] transition-all duration-300 overflow-hidden flex flex-col justify-between transform hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0A0A0A]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {isBestSeller && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-[#0D0D0D] font-bold text-[11px] uppercase tracking-wider shadow">
                        ★ Best Seller
                      </span>
                    )}
                    {isSpicy && (
                      <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider shadow flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-300 text-amber-300 animate-pulse" />
                        <span>Spicy</span>
                      </span>
                    )}
                  </div>

                  {/* Category Pill */}
                  <span className="absolute bottom-2 right-3 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-black/60 text-amber-200/90 border border-amber-500/30 uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#F5EFE2] group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#F5EFE2]/70 mt-1 line-clamp-2 leading-relaxed">
                      {item.description || item.ingredients || 'Special Italian-American house recipe.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between gap-2.5">
                    {renderPriceBlock(item.price)}

                    <button
                      onClick={(e) => handleCardClick(item, e)}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide shadow transition-all active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#0D0D0D]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : isPizza ? (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Select Size</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Size Selection Modal */}
      <ItemSizeModal
        item={selectedModalItem}
        isOpen={Boolean(selectedModalItem)}
        onClose={() => setSelectedModalItem(null)}
        onAddToCart={onSelectItem}
        onOpenCart={onOpenCart}
      />
    </section>
  );
}
