import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Flame, Star, Check } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemSizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, size?: string, notes?: string) => void;
  onOpenCart?: () => void;
}

export default function ItemSizeModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
  onOpenCart
}: ItemSizeModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [itemNote, setItemNote] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  // Helper to format raw size string like "8" to '8"'
  const formatSizeLabel = (rawSize: string) => {
    if (/^\d+$/.test(rawSize)) {
      return `${rawSize}"`;
    }
    return rawSize;
  };

  useEffect(() => {
    if (item) {
      setItemNote('');
      setIsAdded(false);
      if (typeof item.price === 'object') {
        // Sort sizes by price ascending to select the smallest/lowest price size by default
        const entries = Object.entries(item.price).sort((a, b) => a[1] - b[1]);
        if (entries.length > 0) {
          setSelectedSize(formatSizeLabel(entries[0][0]));
        } else {
          setSelectedSize('');
        }
      } else {
        setSelectedSize('');
      }
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Calculate price dynamically for selected size
  const getCurrentPrice = (): number => {
    if (typeof item.price === 'number') {
      return item.price;
    }
    if (typeof item.price === 'object') {
      // Match size stripped of double quotes
      const cleanSelected = selectedSize.replace(/"/g, '');
      for (const [key, val] of Object.entries(item.price)) {
        if (key === selectedSize || key === cleanSelected) {
          return val;
        }
      }
      // Fallback to first available price
      const values = Object.values(item.price);
      return values[0] || 0;
    }
    return 0;
  };

  const currentPrice = getCurrentPrice();

  const handleAdd = () => {
    onAddToCart(item, selectedSize || undefined, itemNote || undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
      if (onOpenCart) {
        onOpenCart();
      }
    }, 400);
  };

  const isSpicy = item.tags.includes('Spicy');
  const isBestSeller = item.tags.includes('Best Seller');

  // Parse multi-size options sorted by price
  const sizeOptions =
    typeof item.price === 'object'
      ? Object.entries(item.price).sort((a, b) => a[1] - b[1])
      : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      {/* Modal Container: Full-width bottom sheet on mobile, rounded modal on desktop */}
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-[#141414] border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#F5EFE2]">
        
        {/* Header Image Box */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#0A0A0A] shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60" />

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
            <span className="px-2.5 py-1 rounded-full bg-black/70 text-amber-300 border border-amber-500/30 text-[11px] font-mono uppercase">
              {item.category}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay at bottom of image */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5EFE2] drop-shadow-md">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Description & Ingredients */}
          <div>
            <p className="text-xs sm:text-sm text-[#F5EFE2]/80 leading-relaxed">
              {item.description}
            </p>
            {item.ingredients && (
              <p className="text-xs text-amber-200/70 mt-2 font-mono italic">
                <strong className="not-italic text-amber-400">Ingredients:</strong> {item.ingredients}
              </p>
            )}
            {item.note && (
              <div className="mt-2 text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 inline-block">
                ★ {item.note}
              </div>
            )}
          </div>

          {/* Size Options (if multi-size pizza/item) */}
          {sizeOptions.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-amber-500/15">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Select Size:
                </label>
                <span className="text-xs text-amber-200/60 font-mono">
                  {sizeOptions.length} option{sizeOptions.length > 1 ? 's' : ''} available
                </span>
              </div>

              {/* Size Pill Buttons */}
              <div className={`grid gap-2.5 ${sizeOptions.length === 1 ? 'grid-cols-1' : sizeOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {sizeOptions.map(([rawSize, pr]) => {
                  const sizeLabel = formatSizeLabel(rawSize);
                  const isSelected = selectedSize === sizeLabel || selectedSize === rawSize;

                  return (
                    <button
                      key={rawSize}
                      type="button"
                      onClick={() => setSelectedSize(sizeLabel)}
                      className={`relative p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-[#0D0D0D] font-bold border-amber-400 shadow-[0_0_20px_rgba(212,160,23,0.35)] scale-105 z-10'
                          : 'bg-[#0E0E0E] border-white/15 hover:border-amber-500/50 text-[#F5EFE2]/90 hover:bg-[#181818]'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-serif font-bold tracking-tight">
                        {sizeLabel}
                      </span>
                      <span
                        className={`font-mono text-xs ${
                          isSelected ? 'text-[#0D0D0D] font-extrabold' : 'text-amber-400'
                        }`}
                      >
                        ৳{pr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Requests / Notes Input */}
          <div className="space-y-1.5 pt-2 border-t border-amber-500/15">
            <label className="text-xs font-mono uppercase tracking-widest text-amber-300 block">
              Special Request / Note (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Extra spicy, no onions, extra garlic sauce..."
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-sm text-[#F5EFE2] placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Modal Sticky Footer with Dynamic Price & Add Button */}
        <div className="p-4 sm:p-5 bg-[#0D0D0D] border-t border-amber-500/20 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-amber-200/60 block font-mono uppercase">
              Total Price
            </span>
            <span className="font-mono text-2xl font-bold text-amber-300 transition-all">
              ৳{currentPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 max-w-xs py-3.5 px-5 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-[#0D0D0D] shadow-amber-600/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added to Order!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Order — ৳{currentPrice}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
