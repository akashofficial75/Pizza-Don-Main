import React, { useState, useMemo } from 'react';
import { Search, Flame, Star, Plus, Check, Filter, Pizza, Utensils, Coffee, AlertCircle } from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';
import ItemSizeModal from './ItemSizeModal';

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
  onAddToCart: (item: MenuItem, size?: string, notes?: string) => void;
  onOpenCart?: () => void;
}

export default function MenuSection({
  categories,
  items,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onOpenCart
}: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleCardClick = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.soldOut) return;

    const isPizza = typeof item.price === 'object' || item.category.toLowerCase().includes('pizza');
    if (isPizza) {
      setModalItem(item);
    } else {
      onAddToCart(item);
      setJustAddedId(item.id);
      setTimeout(() => setJustAddedId(null), 1200);
    }
  };

  // Default to first category if none or invalid
  const activeCat = selectedCategory || (categories[0]?.name || 'Premium Pizza');

  // Sort categories by orderIndex
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [categories]);

  // Filter items by active category, search query, and tag
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = searchQuery.trim() ? true : item.category === activeCat;
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.ingredients && item.ingredients.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTag =
        filterTag === 'ALL' ||
        (filterTag === 'BEST_SELLER' && item.tags.includes('Best Seller')) ||
        (filterTag === 'SPICY' && item.tags.includes('Spicy'));

      return matchCat && matchQuery && matchTag;
    });
  }, [items, activeCat, searchQuery, filterTag]);

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

  return (
    <section id="menu" className="py-20 bg-[#0A0A0A] relative">
      {/* Background Stamped Emblem & Warm light-leak */}
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Pizza className="w-3.5 h-3.5 text-amber-400" />
            <span>THE DON'S DHAMRAI MENU</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#F5EFE2]">
            ARTISAN PIZZA & GOURMET HOUSE
          </h2>
          <p className="text-sm sm:text-base text-amber-100/70 mt-3">
            Every pizza is hand-kneaded with 48-hour fermented dough, topped with lavish meats and rich American cheese. Order directly on WhatsApp with instant confirmation.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#121212] p-3 rounded-2xl border border-amber-500/20 shadow-lg">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/50" />
            <input
              type="text"
              placeholder="Search Turkish, Naga, Shawarma, Shake..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-[#F5EFE2] text-sm placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tag Filters */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterTag('ALL')}
              className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all bg-amber-500 text-[#0D0D0D] shadow"
            >
              All Dishes ({items.length})
            </button>
          </div>
        </div>

        {/* Categories Tab Strip */}
        {!searchQuery && (
          <div className="mb-10 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/30">
            <div className="flex items-center gap-2.5 min-w-max">
              {sortedCategories.map((cat) => {
                const isSelected = activeCat === cat.name;
                const count = items.filter((i) => i.category === cat.name).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.name)}
                    className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-[#0D0D0D] border-amber-400 font-bold shadow-lg shadow-amber-600/25 scale-105'
                        : 'bg-[#131313] text-[#F5EFE2]/80 border-amber-500/20 hover:border-amber-500/50 hover:text-amber-300'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-black/30 text-[#0D0D0D] font-bold'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Category Description Header */}
        {!searchQuery && (
          <div className="mb-8 p-5 rounded-2xl bg-[#121212] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#F5EFE2] uppercase tracking-wide">
                {activeCat}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/70 mt-1">
                {sortedCategories.find((c) => c.name === activeCat)?.description ||
                  'Authentic Pizza Don recipe made fresh on order in Dhamrai.'}
              </p>
            </div>
            <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 self-start sm:self-center">
              100% Halal • Freshly Prepared
            </div>
          </div>
        )}

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#121212] rounded-2xl border border-amber-500/20">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
            <h4 className="font-serif text-xl text-[#F5EFE2]">No dishes match your filter</h4>
            <p className="text-sm text-amber-100/60 mt-1">
              Try searching a different keyword or resetting tag filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterTag('ALL');
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isSoldOut = item.soldOut;
              const isSpicy = item.tags.includes('Spicy');
              const isBestSeller = item.tags.includes('Best Seller');
              const isPizza = typeof item.price === 'object' || item.category.toLowerCase().includes('pizza');
              const isAdded = justAddedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleCardClick(item, e)}
                  className={`group rounded-2xl bg-[#141414] border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                    isSoldOut
                      ? 'border-red-900/40 opacity-70 cursor-not-allowed'
                      : 'border-amber-500/20 hover:border-amber-500/60 hover:shadow-[0_8px_30px_rgba(212,160,23,0.15)] cursor-pointer'
                  }`}
                >
                  {/* Image & Badges */}
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
                      {isSoldOut && (
                        <span className="px-2.5 py-1 rounded-full bg-red-950/90 text-red-300 border border-red-500 font-bold text-[11px] uppercase tracking-wider shadow">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {item.note && (
                      <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-black/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono">
                        ★ {item.note}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-lg font-bold text-[#F5EFE2] group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-amber-200/50 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#F5EFE2]/70 mt-1.5 leading-relaxed line-clamp-2">
                        {item.description || item.ingredients || 'Handcrafted signature house recipe.'}
                      </p>
                      {item.ingredients && (
                        <p className="text-[11px] text-amber-200/60 mt-2 font-mono italic">
                          • {item.ingredients}
                        </p>
                      )}
                    </div>

                    {/* Footer / Price & Add Button */}
                    <div className="mt-5 pt-3 border-t border-amber-500/15 flex items-center justify-between gap-2.5">
                      {renderPriceBlock(item.price)}

                      {isSoldOut ? (
                        <span className="shrink-0 px-3 py-1.5 rounded-xl bg-red-950 text-red-400 text-xs font-mono uppercase">
                          Unavailable
                        </span>
                      ) : (
                        <button
                          onClick={(e) => handleCardClick(item, e)}
                          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow active:scale-95 ${
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
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Size Selection Modal */}
      <ItemSizeModal
        item={modalItem}
        isOpen={Boolean(modalItem)}
        onClose={() => setModalItem(null)}
        onAddToCart={onAddToCart}
        onOpenCart={onOpenCart}
      />
    </section>
  );
}
