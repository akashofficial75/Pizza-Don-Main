/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BestSellersCarousel from './components/BestSellersCarousel';
import MenuSection from './components/MenuSection';
import BookingSection from './components/BookingSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import GoogleReviewsSection from './components/GoogleReviewsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import OrderSummaryDrawer from './components/OrderSummaryDrawer';
import AdminPanel from './components/AdminPanel';
import {
  MenuItem, BookingRequest, BusinessSettings,
  DatabaseState, CartItem
} from './types';
import { INITIAL_DATABASE_STATE } from './data/seedMenu';
import { fetchDatabaseState } from './lib/supabase';
import { smoothScrollToSection } from './lib/scroll';

export default function App() {
  const [dbState, setDbState] = useState<DatabaseState>(INITIAL_DATABASE_STATE);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('Premium Pizza');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pizzadon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Check URL path for /admin route
  useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path === '/admin/' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };

    checkAdminPath();

    const handlePopState = () => {
      checkAdminPath();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    const path = window.location.pathname.toLowerCase();
    if (path === '/admin' || path === '/admin/') {
      window.history.pushState({}, '', '/');
    }
    if (window.location.hash === '#admin') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  // Fetch database state from Supabase / Firebase / Express Server API
  const fetchDbState = useCallback(async () => {
    try {
      const data = await fetchDatabaseState();

      if (data && Array.isArray(data.items) && data.items.length > 0) {
        setDbState(data);
        if (!selectedCategory && data.categories.length > 0) {
          setSelectedCategory(data.categories[0].name);
        }
      }
    } catch (err) {
      console.log('Error fetching database state:', err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchDbState();
  }, [fetchDbState]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('pizzadon_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync favicon dynamically with siteLogoUrl
  useEffect(() => {
    const logoUrl = dbState.settings?.siteLogoUrl || '/pizzadon-logo.jpg';
    let faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = logoUrl;
  }, [dbState.settings?.siteLogoUrl]);

  // Cart operations
  const handleAddToCart = (item: MenuItem, size?: string, notes?: string) => {
    let finalPrice = 450;
    if (typeof item.price === 'number') {
      finalPrice = item.price;
    } else if (size && typeof item.price === 'object') {
      const cleanSize = size.replace(/"/g, '');
      if (item.price[size] !== undefined) {
        finalPrice = item.price[size];
      } else if (item.price[cleanSize] !== undefined) {
        finalPrice = item.price[cleanSize];
      } else {
        const firstSizeVal = Object.values(item.price)[0];
        finalPrice = firstSizeVal || 450;
      }
    } else if (typeof item.price === 'object') {
      const firstSizeVal = Object.values(item.price)[0];
      finalPrice = firstSizeVal || 450;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.menuItemId === item.id && c.size === size && c.note === notes
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: `${item.id}-${Date.now()}`,
          menuItemId: item.id,
          name: item.name,
          category: item.category,
          price: finalPrice,
          quantity: 1,
          size,
          note: notes,
          imageUrl: item.imageUrl
        }
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.id === cartItemId ? { ...c, quantity: newQty } : c))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleBookingCreated = (newBooking: BookingRequest) => {
    setDbState((prev) => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings]
    }));
  };

  const handleScrollToMenu = () => {
    setActiveTab('menu');
    smoothScrollToSection('menu');
  };

  const handleScrollToBook = () => {
    setActiveTab('book');
    smoothScrollToSection('book');
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    smoothScrollToSection(tab);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5EFE2] font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden w-full max-w-full">
      {/* Top Floating Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigate={handleNavigation}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        settings={dbState.settings}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Cinematic Hero Section with 3D Canvas / Fallback */}
        <HeroSection
          settings={dbState.settings}
          onExploreMenu={handleScrollToMenu}
          onBookTable={handleScrollToBook}
          onSelectCategory={(catName) => {
            setSelectedCategory(catName);
            handleScrollToMenu();
          }}
        />

        {/* 2. Dhamrai Best Sellers Carousel */}
        {dbState.items.length > 0 && (
          <BestSellersCarousel
            items={dbState.items}
            onSelectItem={(item, size, notes) => handleAddToCart(item, size, notes)}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* 3. Artisan Pizza & Gourmet Menu Vault */}
        <MenuSection
          categories={dbState.categories}
          items={dbState.items}
          selectedCategory={selectedCategory}
          onSelectCategory={(catName) => setSelectedCategory(catName)}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 4. Table Reservation & Private Event Booking */}
        <BookingSection
          blockedDates={dbState.blockedDates}
          onBookingCreated={handleBookingCreated}
          settings={dbState.settings}
        />

        {/* 5. The Don's Story & Philosophy (About) */}
        <AboutSection
          settings={dbState.settings}
          onBookTable={handleScrollToBook}
        />

        {/* 6. Cinematic Photo Vault (Gallery) */}
        <GallerySection gallery={dbState.gallery} />

        {/* 7. Google Verified Community Reviews */}
        <GoogleReviewsSection reviews={dbState.reviews} />

        {/* 8. Location & Contact (Google Map Embed & WhatsApp) */}
        <ContactSection settings={dbState.settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={dbState.settings}
        onNavigate={handleNavigation}
      />

      {/* Order Summary Drawer (WhatsApp Cart) */}
      <OrderSummaryDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        settings={dbState.settings}
      />

      {/* Owner Admin Panel (Full CRUD) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        state={dbState}
        onRefreshState={fetchDbState}
      />
    </div>
  );
}
