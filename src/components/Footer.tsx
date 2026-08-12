import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Facebook } from 'lucide-react';
import { BusinessSettings } from '../types';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  return (
    <footer className="relative bg-[#0A0A0A] border-t border-amber-500/20 text-[#F5EFE2] overflow-hidden">
      {/* Decorative Top Hairline Gold Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      {/* Subtle Background Stamped Fedora Watermark Motif */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Brand & Italian-American Don identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-lg shrink-0">
                <img
                  src={settings?.siteLogoUrl || '/pizzadon-logo.jpg'}
                  alt="Pizza Don Logo"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/pizzadon-logo.jpg')) {
                      target.src = '/pizzadon-logo.jpg';
                    }
                  }}
                  className="w-full h-full rounded-full object-cover bg-black"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-amber-100">
                  PIZZA DON
                </span>
                <span className="ml-1.5 text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                  DHAMRAI
                </span>
              </div>
            </div>
            <p className="text-sm text-amber-100/70 leading-relaxed">
              Dhamrai’s premier upscale boutique pizzeria. Hand-tossed Italian crusts, rich American cheeses, and classic old-money Italian restaurant elegance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.facebookUrl || 'https://www.facebook.com/pizzadondhamrai'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-amber-500/20 flex items-center justify-center text-amber-300 hover:bg-amber-500 hover:text-black transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801729668090"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-amber-500/20 flex items-center justify-center text-amber-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Dhamrai Location & Opening Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-widest uppercase text-amber-400 font-semibold">
              Visit The House
            </h3>
            <ul className="space-y-3 text-sm text-amber-100/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Order: <strong className="text-white font-mono">{settings.whatsappDisplay}</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Phone Booking: <strong className="text-white font-mono">{settings.phoneNumber}</strong></span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Category Shortcuts */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-widest uppercase text-amber-400 font-semibold">
              The Menu Vault
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-amber-100/70">
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Premium Pizza
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Regular Pizza
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Gourmet Burgers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Loaded Meat Box
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Spiced Shawarma
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Crispy Wings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Oven Baked Pasta
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
                  • Coffee & Shakes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Table Reservations & Private Party */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm tracking-widest uppercase text-amber-400 font-semibold">
              Boutique Reservations
            </h3>
            <p className="text-sm text-amber-100/70 leading-relaxed">
              We host birthdays, family gatherings, corporate lunches, and VIP celebrations in our tailored Italian-American dining room.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onNavigate('book')}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#0D0D0D] font-semibold text-xs tracking-wide shadow-lg transition-all"
              >
                Book a Table or Event
              </button>
              <a
                href={`https://wa.me/${settings.whatsappOrderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200/90 hover:text-amber-300 text-center font-medium text-xs tracking-wide transition-all"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-100/50 gap-4">
          <p>
            © {new Date().getFullYear()} {settings.restaurantName} (Dhamrai). All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="hover:text-amber-300 transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('menu')} className="hover:text-amber-300 transition-colors">
              Full Menu
            </button>
            <button onClick={() => onNavigate('book')} className="hover:text-amber-300 transition-colors">
              Reservations
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors">
              Our Story
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
