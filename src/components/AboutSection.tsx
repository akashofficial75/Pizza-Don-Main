import React from 'react';
import { ShieldCheck, Flame, Heart, Award, MapPin, Clock, Users, Star } from 'lucide-react';
import { BusinessSettings } from '../types';

interface AboutSectionProps {
  settings: BusinessSettings;
  onBookTable: () => void;
}

export default function AboutSection({ settings, onBookTable }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-[#0B0B0B] relative overflow-hidden">
      {/* Decorative Warm Light Leaks */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Collage of Dhamrai Boutique Lounge */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl h-64 sm:h-72 bg-[#141414]">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
                    alt="The Don Velvet Lounge"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 rounded-3xl bg-[#141414] border border-amber-500/20 text-center space-y-1 shadow-xl">
                  <span className="font-serif text-3xl font-bold text-amber-300">5.0 ★</span>
                  <p className="text-xs font-mono uppercase text-amber-100/70 tracking-widest">
                    Google Verified Rating
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600/20 to-amber-900/10 border border-amber-500/40 text-center space-y-1 shadow-xl">
                  <span className="font-serif text-3xl font-bold text-[#F5EFE2]">64+</span>
                  <p className="text-xs font-mono uppercase text-amber-300 tracking-widest">
                    Gourmet Dishes
                  </p>
                </div>
                <div className="rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl h-64 sm:h-72 bg-[#141414]">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop"
                    alt="Hand tossed pizza crust"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Floating Gold Badge Overlay */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-3.5 sm:px-6 py-2 sm:py-3 rounded-full bg-[#111111]/95 border-2 border-amber-500 shadow-2xl flex items-center gap-2 max-w-[92vw] text-center">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="font-serif text-xs sm:text-sm font-bold text-amber-300 truncate">
                MONOWAR COMPLEX • THANA STAND
              </span>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>THE DON'S STORY & PHILOSOPHY</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#F5EFE2] leading-tight">
              OLD-MONEY ITALIAN ELEGANCE IN DHAMRAI
            </h2>

            <p className="text-base text-amber-100/80 leading-relaxed">
              {settings.aboutText}
            </p>

            <p className="text-sm text-[#F5EFE2]/70 leading-relaxed italic border-l-2 border-amber-500/60 pl-4 py-1">
              "We didn't just build a pizzeria in Dhamrai—we created a cinematic dining sanctuary where every guest is treated like the head of the table."
            </p>

            {/* Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/20 space-y-1.5">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-base font-bold text-[#F5EFE2]">
                  48-Hr Fermentation
                </h3>
                <p className="text-xs text-[#F5EFE2]/60">
                  Light, airy, digestible Italian crust with authentic char.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/20 space-y-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif text-base font-bold text-[#F5EFE2]">
                  100% Halal Quality
                </h3>
                <p className="text-xs text-[#F5EFE2]/60">
                  Premium poultry, beef sausages & imported American cheeses.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/20 space-y-1.5">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-base font-bold text-[#F5EFE2]">
                  Boutique Events
                </h3>
                <p className="text-xs text-[#F5EFE2]/60">
                  Custom decorated birthday parties and VIP family reservations.
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4">
              <button
                onClick={onBookTable}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#0D0D0D] font-bold text-sm tracking-wide shadow-lg transition-all"
              >
                Reserve Your Table Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
