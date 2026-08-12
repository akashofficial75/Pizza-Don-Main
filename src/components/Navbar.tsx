import React, { useState, useEffect } from 'react';
import { Phone, Calendar, ShoppingBag, Menu, X, Facebook } from 'lucide-react';
import { CartItem, BusinessSettings } from '../types';
import { smoothScrollToSection } from '../lib/scroll';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenAdmin?: () => void;
  settings?: BusinessSettings;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onNavigate,
  cart,
  onOpenCart,
  settings,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Auto update active tab based on scroll position without triggering scrollTo
      const sectionIds = ['home', 'menu', 'book', 'about', 'gallery', 'reviews', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id) || (id === 'book' ? document.getElementById('booking') : null);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveTab]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Full Menu' },
    { id: 'about', label: 'Our Story' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    if (onNavigate) {
      onNavigate(id);
    } else {
      smoothScrollToSection(id);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D0D0D]/95 border-b border-amber-500/20 shadow-2xl backdrop-blur-md py-2.5'
          : 'bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Stamp Emblem */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-2.5 sm:gap-3 focus:outline-none text-left shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-[0_0_15px_rgba(212,160,23,0.4)] group-hover:shadow-[0_0_25px_rgba(212,160,23,0.7)] transition-all shrink-0">
            <img
              src={settings?.siteLogoUrl || '/pizzadon-logo.jpg'}
              alt="Pizza Don Official Logo"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/pizzadon-logo.jpg')) {
                  target.src = '/pizzadon-logo.jpg';
                }
              }}
              className="w-full h-full rounded-full object-cover bg-black"
            />
            {/* Gold laurel badge dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-[#0D0D0D] flex items-center justify-center text-[8px] font-bold text-white shadow">
              ★
            </span>
          </div>

          <div className="flex flex-col justify-center text-left leading-tight">
            <span className="font-serif text-base sm:text-lg lg:text-xl font-bold tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors drop-shadow-sm">
              PIZZA DON
            </span>
            <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono tracking-widest text-amber-400/80 uppercase whitespace-nowrap">
              UPSCALE PIZZERIA • MONOWAR COMPLEX
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links - Compact 13px clean typography */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-all whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(212,160,23,0.15)]'
                  : 'text-[#F5EFE2]/80 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Compact Buttons & Direct WhatsApp Link */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Direct WhatsApp Call/Chat Link */}
          <a
            href="https://wa.me/8801729668090"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#1A1A1A] border border-amber-500/30 text-amber-200/90 hover:bg-[#25D366] hover:text-[#0D0D0D] hover:border-[#25D366] transition-all duration-300 ease-in-out text-xs font-mono font-semibold"
            title="Open WhatsApp Chat (01729-668090)"
          >
            <div className="w-4 h-4 rounded-[4px] bg-[#25D366] group-hover:bg-[#0D0D0D] flex items-center justify-center shrink-0 transition-colors duration-300">
              <svg className="w-2.5 h-2.5 fill-white group-hover:fill-[#25D366] transition-colors duration-300" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <span>01729-668090</span>
          </a>

          {/* Compact Table Booking CTA Button */}
          <button
            onClick={() => handleNavClick('book')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#0D0D0D] font-semibold text-xs tracking-wide shadow-md hover:shadow-amber-500/20 transition-all whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Table</span>
          </button>

          {/* Compact WhatsApp Order Summary / Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-red-900/30 transition-all active:scale-95 whitespace-nowrap"
            aria-label="View WhatsApp Food Order"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Your Order</span>
            {totalCartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#0D0D0D] text-[11px] font-bold shadow animate-bounce">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Facebook Page Icon Button */}
          <a
            href="https://www.facebook.com/pizzadondhamrai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/40 text-amber-200/60 hover:text-amber-300 transition-all"
            title="Facebook Page"
            aria-label="Pizza Don Dhamrai Facebook Page"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full bg-white/5 border border-amber-500/20 text-amber-300 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-4 rounded-2xl bg-[#141414]/98 border border-amber-500/30 backdrop-blur-xl shadow-2xl overflow-hidden p-3.5">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-[#F5EFE2]/80 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'menu' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/30 text-red-300 font-mono uppercase">
                    Full Menu
                  </span>
                )}
                {item.id === 'book' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono uppercase">
                    Tables / Events
                  </span>
                )}
              </button>
            ))}

            <div className="mt-2 pt-2.5 border-t border-amber-500/20 flex flex-col gap-2">
              <a
                href="https://www.facebook.com/pizzadondhamrai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-xs tracking-wider uppercase"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Visit Facebook Page</span>
              </a>

              <a
                href="https://wa.me/8801729668090"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium text-xs tracking-wider uppercase"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Order: 01729-668090</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

