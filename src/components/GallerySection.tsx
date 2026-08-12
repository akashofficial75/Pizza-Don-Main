import React, { useState } from 'react';
import { Camera, X, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [filterCat, setFilterCat] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Food', 'Ambiance', 'Craft'];

  const filteredPhotos = gallery.filter((item) =>
    filterCat === 'All' ? true : item.category === filterCat
  );

  return (
    <section id="gallery" className="py-20 bg-[#0A0A0A] border-t border-amber-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>THE DON'S DHAMRAI VISUAL VAULT</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#F5EFE2]">
              CINEMATIC FOOD & AMBIANCE
            </h2>
            <p className="text-sm text-amber-100/70 mt-2 max-w-xl">
              A glimpse inside Monowar Complex: tailored Italian-American lounge vibes, hand-kneaded artisan crusts, and lavishly topped pizzas.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                  filterCat === cat
                    ? 'bg-amber-500 text-[#0D0D0D] shadow'
                    : 'bg-[#181818] text-[#F5EFE2]/80 hover:bg-[#222]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/60 shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 border border-amber-500/40 text-amber-300 text-[10px] font-mono uppercase tracking-wider">
                  {item.category}
                </span>

                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <h3 className="font-serif text-xl font-bold text-[#F5EFE2] group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-amber-100/70 mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Light-box modal preview */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl bg-[#141414] border border-amber-500/40 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-[350px] sm:h-[500px] w-full bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 bg-[#111111] border-t border-white/10">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">
                {selectedPhoto.category}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#F5EFE2] mt-1">
                {selectedPhoto.title}
              </h3>
              <p className="text-sm text-amber-100/80 mt-1">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
