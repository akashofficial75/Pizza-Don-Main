import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, X, Plus, Trash2, Edit3, Calendar, Utensils,
  Settings, CheckCircle2, XCircle, Clock, Search, AlertCircle,
  Flame, Star, Lock, Eye, EyeOff, KeyRound
} from 'lucide-react';
import {
  MenuItem, MenuCategory, BookingRequest, BlockedDate,
  BusinessSettings, DatabaseState, BookingStatus
} from '../types';
import ImageUploader from './ImageUploader';
import { saveDatabaseState } from '../lib/supabase';
import { verifyAdminPasswordFirebase, changeAdminPasswordFirebase, saveSiteSettingsToFirebase } from '../lib/firebase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  state: DatabaseState;
  onRefreshState: () => Promise<void>;
}

export default function AdminPanel({
  isOpen,
  onClose,
  state,
  onRefreshState
}: AdminPanelProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pizzadon_admin_token');
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'menu' | 'settings'>('bookings');

  // Menu item modal state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItemModal, setIsNewItemModal] = useState(false);

  // Form fields for adding/editing menu item
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Premium Pizza');
  const [formDescription, setFormDescription] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [priceType, setPriceType] = useState<'single' | 'multiple'>('single');
  const [singlePrice, setSinglePrice] = useState<string>('450');
  const [sizePrices, setSizePrices] = useState<{ size: string; price: string }[]>([
    { size: '8', price: '500' },
    { size: '10', price: '600' },
    { size: '12', price: '750' }
  ]);
  const [priceError, setPriceError] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTags, setFormTags] = useState<('Best Seller' | 'Spicy' | 'New')[]>([]);
  const [formSoldOut, setFormSoldOut] = useState(false);

  // Booking filtering & blocking
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'Pending' | 'Confirmed' | 'Completed' | 'Declined'>('ALL');
  const [searchBooking, setSearchBooking] = useState('');
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('');

  // Booking deletion state
  const [bookingToDelete, setBookingToDelete] = useState<BookingRequest | null>(null);
  const [isDeletingBooking, setIsDeletingBooking] = useState(false);

  // Menu item deletion state
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Settings editing state
  const [settingsForm, setSettingsForm] = useState<BusinessSettings>(state.settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Keep settingsForm in sync with state.settings when state changes or panel opens
  useEffect(() => {
    if (state.settings) {
      setSettingsForm(state.settings);
    }
  }, [state.settings, isOpen]);

  // Password management state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  if (!isOpen) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    // Validation checks
    if (!currentPassword) {
      setChangePasswordError('Current password is required.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setChangePasswordError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError('Passwords do not match.');
      return;
    }

    setChangePasswordLoading(true);
    try {
      // 1. Send password change to primary backend API server
      let res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      if (res.status === 404) {
        res = await fetch('/.netlify/functions/change-admin-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword
          })
        });
      }

      let serverSuccess = false;
      let serverToken = '';
      let serverError = '';

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          serverSuccess = true;
          serverToken = data.token;
        } else {
          serverError = data.error;
        }
      } else {
        try {
          const errData = await res.json();
          serverError = errData.error || 'Password update failed on server.';
        } catch {
          serverError = 'Server returned an error.';
        }
      }

      // 2. Also update Firebase Firestore if connected
      const fbRes = await changeAdminPasswordFirebase(currentPassword, newPassword);

      if (serverSuccess || fbRes.success) {
        setChangePasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        const activeToken = serverToken || `pizzadon_admin_${Date.now()}`;
        setToken(activeToken);
        localStorage.setItem('pizzadon_admin_token', activeToken);
      } else {
        setChangePasswordError(serverError || fbRes.error || 'Failed to update password.');
      }
    } catch (err) {
      setChangePasswordError('Server error while updating password.');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      // 1. Primary auth: Express server API
      let res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      // 2. If 404, fall back to Netlify serverless function
      if (res.status === 404) {
        res = await fetch('/.netlify/functions/verify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: passwordInput })
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          localStorage.setItem('pizzadon_admin_token', data.token);
          setPasswordInput('');
          return;
        } else {
          setAuthError(data.error || 'Incorrect password.');
          return;
        }
      }

      // 3. Fall back to Firebase Firestore if connected
      const isFbValid = await verifyAdminPasswordFirebase(passwordInput);
      if (isFbValid) {
        const newToken = `pizzadon_admin_${Date.now()}`;
        setToken(newToken);
        localStorage.setItem('pizzadon_admin_token', newToken);
        setPasswordInput('');
        return;
      }

      setAuthError('Incorrect password.');
    } catch (err: any) {
      setAuthError('Authentication error: ' + (err?.message || 'Failed to reach server.'));
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('pizzadon_admin_token');
  };

  // --- BOOKING MANAGEMENT ---
  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const updatedBookings = state.bookings.map(b =>
        b.id === bookingId ? { ...b, status: status as BookingStatus } : b
      );
      const updatedState = { ...state, bookings: updatedBookings };
      await saveDatabaseState(updatedState);
      await onRefreshState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    setIsDeletingBooking(true);
    try {
      const updatedBookings = state.bookings.filter(b => b.id !== bookingToDelete.id);
      const updatedState = { ...state, bookings: updatedBookings };
      await saveDatabaseState(updatedState);
      await onRefreshState();
      setBookingToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingBooking(false);
    }
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;
    try {
      const newBlocked: BlockedDate = {
        date: blockDateInput,
        reason: blockReasonInput || 'Fully Booked'
      };
      const updatedBlocked = [
        ...state.blockedDates.filter(b => b.date !== blockDateInput),
        newBlocked
      ];
      const updatedState = { ...state, blockedDates: updatedBlocked };
      await saveDatabaseState(updatedState);
      setBlockDateInput('');
      setBlockReasonInput('');
      await onRefreshState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnblockDate = async (dateStr: string) => {
    try {
      const updatedBlocked = state.blockedDates.filter(b => b.date !== dateStr);
      const updatedState = { ...state, blockedDates: updatedBlocked };
      await saveDatabaseState(updatedState);
      await onRefreshState();
    } catch (err) {
      console.error(err);
    }
  };

  // --- MENU CRUD ---
  const openNewItemModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Premium Pizza');
    setFormDescription('');
    setFormIngredients('');
    setPriceType('single');
    setSinglePrice('450');
    setSizePrices([
      { size: '8', price: '500' },
      { size: '10', price: '600' },
      { size: '12', price: '750' }
    ]);
    setPriceError('');
    setFormImageUrl('');
    setFormTags([]);
    setFormSoldOut(false);
    setIsNewItemModal(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormDescription(item.description || '');
    setFormIngredients(item.ingredients || '');
    setFormImageUrl(item.imageUrl);
    setFormTags(item.tags || []);
    setFormSoldOut(Boolean(item.soldOut));
    setPriceError('');

    let isMultiple = false;
    let parsedObj: Record<string, any> | null = null;

    if (item.price && typeof item.price === 'object') {
      isMultiple = true;
      parsedObj = item.price as Record<string, any>;
    } else if (typeof item.price === 'string') {
      try {
        const json = JSON.parse(item.price);
        if (json && typeof json === 'object') {
          isMultiple = true;
          parsedObj = json;
        }
      } catch {
        // string but not JSON object
      }
    }

    if (isMultiple && parsedObj) {
      setPriceType('multiple');
      const rows = Object.entries(parsedObj).map(([size, priceVal]) => ({
        size,
        price: String(priceVal)
      }));
      setSizePrices(rows.length > 0 ? rows : [{ size: '12', price: '500' }]);
      setSinglePrice('450');
    } else {
      setPriceType('single');
      setSinglePrice(String(item.price ?? '450'));
      setSizePrices([
        { size: '8', price: '500' },
        { size: '10', price: '600' },
        { size: '12', price: '750' }
      ]);
    }

    setIsNewItemModal(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceError('');

    let parsedPrice: number | Record<string, number>;

    if (priceType === 'single') {
      const num = Number(singlePrice);
      if (isNaN(num) || num <= 0 || !singlePrice.trim()) {
        setPriceError('Please enter a valid price (must be a positive number).');
        return;
      }
      parsedPrice = num;
    } else {
      if (sizePrices.length === 0) {
        setPriceError('Please add at least one size and price.');
        return;
      }
      const obj: Record<string, number> = {};
      for (let i = 0; i < sizePrices.length; i++) {
        const row = sizePrices[i];
        const trimmedSize = row.size.trim();
        const numPrice = Number(row.price);
        if (!trimmedSize) {
          setPriceError(`Row #${i + 1}: Size label cannot be empty.`);
          return;
        }
        if (isNaN(numPrice) || numPrice <= 0 || !row.price.trim()) {
          setPriceError(`Row #${i + 1}: Please enter a valid numeric price for size "${trimmedSize}".`);
          return;
        }
        obj[trimmedSize] = numPrice;
      }
      parsedPrice = obj;
    }

    const payload = {
      name: formName,
      category: formCategory,
      description: formDescription,
      ingredients: formIngredients,
      price: parsedPrice,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
      tags: formTags,
      soldOut: formSoldOut
    };

    try {
      let updatedItems: MenuItem[];
      if (editingItem) {
        const updatedItem: MenuItem = {
          ...editingItem,
          ...payload
        };
        updatedItems = state.items.map(item => item.id === editingItem.id ? updatedItem : item);
      } else {
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          ...payload,
          orderIndex: state.items.length + 1
        };
        updatedItems = [...state.items, newItem];
      }

      const updatedState = { ...state, items: updatedItems };
      await saveDatabaseState(updatedState);
      setIsNewItemModal(false);
      await onRefreshState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setIsDeletingItem(true);
    try {
      const updatedItems = state.items.filter(item => item.id !== itemToDelete.id);
      const updatedState = { ...state, items: updatedItems };
      await saveDatabaseState(updatedState);
      await onRefreshState();
    } catch (err) {
      console.error('Error deleting menu item:', err);
    } finally {
      setIsDeletingItem(false);
      setItemToDelete(null);
    }
  };

  const handleToggleTag = (tag: 'Best Seller' | 'Spicy' | 'New') => {
    if (formTags.includes(tag)) {
      setFormTags(formTags.filter(t => t !== tag));
    } else {
      setFormTags([...formTags, tag]);
    }
  };

  // --- SETTINGS CRUD ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedState = { ...state, settings: settingsForm };
      await saveDatabaseState(updatedState);
      await saveSiteSettingsToFirebase(settingsForm);
      setSettingsSavedMsg('Settings updated and live on website!');
      setTimeout(() => setSettingsSavedMsg(''), 3000);
      await onRefreshState();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = state.bookings.filter(b => {
    const matchStatus = bookingFilter === 'ALL' ? true : b.status === bookingFilter;
    const matchSearch = !searchBooking.trim() ||
      b.name.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.phone.includes(searchBooking);
    return matchStatus && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
      <div className="relative w-full max-w-6xl h-full sm:h-[90vh] bg-[#111111] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F5EFE2]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-amber-500/20 bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shrink-0">
              <img
                src={state.settings?.siteLogoUrl || '/pizzadon-logo.jpg'}
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
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-300">
                PIZZA DON DHAMRAI • OWNER ADMIN PORTAL
              </h2>
              <p className="text-xs text-[#F5EFE2]/60 font-mono">
                Full CRUD Management: Menu Vault, Table/Event Bookings & House Settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-red-950 border border-white/10 hover:border-red-500 text-xs text-amber-100 hover:text-red-300 transition-colors"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTH LOGIN REQUIREMENT */}
        {!token ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full p-8 rounded-2xl bg-[#141414] border border-amber-500/30 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#F5EFE2]">
                  Owner Password Required
                </h3>
                <p className="text-xs text-amber-100/60 mt-1">
                  Enter your admin PIN/password to manage Pizza Don Dhamrai.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter owner password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0A0A0A] border border-amber-500/40 text-center font-mono text-sm focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-amber-300 transition-colors p-1"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <p className="text-xs text-red-400 font-mono">{authError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-sm tracking-wide shadow-lg"
                >
                  Access Owner Panel
                </button>
              </form>


            </div>
          </div>
        ) : (
          /* ADMIN PORTAL MAIN UI */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Stat Ribbon & Tab Selector */}
            <div className="bg-[#141414] border-b border-amber-500/20 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Tab options */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                    activeTab === 'bookings'
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-white/5 text-amber-100 hover:bg-white/10'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings & Events</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/30 text-xs font-mono">
                    {state.bookings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('menu')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                    activeTab === 'menu'
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-white/5 text-amber-100 hover:bg-white/10'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Menu Manager</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/30 text-xs font-mono">
                    {state.items.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                    activeTab === 'settings'
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-white/5 text-amber-100 hover:bg-white/10'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>House Settings</span>
                </button>
              </div>
            </div>

            {/* TAB 1: BOOKINGS & EVENT MANAGEMENT */}
            {activeTab === 'bookings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
                {/* Bookings Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] p-4 rounded-2xl border border-amber-500/20">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search guest name or phone..."
                      value={searchBooking}
                      onChange={(e) => setSearchBooking(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {(['ALL', 'Pending', 'Confirmed', 'Completed', 'Declined'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setBookingFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          bookingFilter === st
                            ? 'bg-amber-500 text-black'
                            : 'bg-[#1D1D1D] text-white/70 hover:bg-[#252525]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-amber-300">
                    INCOMING TABLE & EVENT RESERVATIONS ({filteredBookings.length})
                  </h3>

                  {filteredBookings.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-[#141414] border border-white/10 text-white/60 text-sm">
                      No reservations found for current filter.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBookings.map(book => (
                        <div
                          key={book.id}
                          className="p-5 rounded-2xl bg-[#151515] border border-amber-500/20 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                                book.status === 'Confirmed' ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' :
                                book.status === 'Pending' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                                book.status === 'Completed' ? 'bg-blue-600/30 text-blue-300' :
                                'bg-red-600/30 text-red-400'
                              }`}>
                                {book.status}
                              </span>
                              <h4 className="font-serif text-lg font-bold text-white mt-1">
                                {book.name} — <span className="font-mono text-sm text-amber-300">{book.phone}</span>
                              </h4>
                            </div>

                            <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 uppercase">
                              {book.bookingType === 'event' ? '🎉 Private Event' : '🍽 Table'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs bg-[#0E0E0E] p-3 rounded-xl border border-white/5 font-mono">
                            <div>
                              <span className="text-amber-300/60 block">Date & Time:</span>
                              <strong className="text-white">{book.date} @ {book.timeSlot}</strong>
                            </div>
                            <div>
                              <span className="text-amber-300/60 block">Guests:</span>
                              <strong className="text-white">{book.guests} People</strong>
                            </div>
                            {book.occasion && (
                              <div className="col-span-2">
                                <span className="text-amber-300/60 block">Occasion:</span>
                                <span>{book.occasion}</span>
                              </div>
                            )}
                            {book.eventThemeRequest && (
                              <div className="col-span-2">
                                <span className="text-amber-300/60 block">Theme Request:</span>
                                <span className="text-amber-300">{book.eventThemeRequest}</span>
                              </div>
                            )}
                            {book.notes && (
                              <div className="col-span-2">
                                <span className="text-amber-300/60 block">Note:</span>
                                <span>{book.notes}</span>
                              </div>
                            )}
                          </div>

                          {/* Status and Action buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span className="text-[10px] text-white/40 font-mono">
                              ID: #{book.id.slice(-6)}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {book.status !== 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(book.id, 'Confirmed')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                                >
                                  Confirm
                                </button>
                              )}
                              {book.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(book.id, 'Completed')}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                                >
                                  Complete
                                </button>
                              )}
                              {book.status !== 'Declined' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(book.id, 'Declined')}
                                  className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                                >
                                  Decline
                                </button>
                              )}
                              <button
                                onClick={() => setBookingToDelete(book)}
                                className="px-2.5 py-1 rounded-lg bg-[#222222] hover:bg-zinc-700 border border-zinc-600/50 text-zinc-300 hover:text-white font-medium text-xs flex items-center gap-1 transition-colors"
                                title="Delete booking permanently"
                                aria-label="Delete booking"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Blocking Section */}
                <div className="p-6 rounded-2xl bg-[#141414] border border-amber-500/20 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span>BLOCK UNAVAILABLE / FULLY BOOKED DATES</span>
                  </h3>
                  <p className="text-xs text-white/70">
                    Marking a date as unavailable prevents customers from reserving tables or parties on that day.
                  </p>

                  <form onSubmit={handleBlockDate} className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="date"
                      required
                      value={blockDateInput}
                      onChange={(e) => setBlockDateInput(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/40 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Reason (e.g. Fully Booked / Holiday)"
                      value={blockReasonInput}
                      onChange={(e) => setBlockReasonInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/40 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                    >
                      Block Date
                    </button>
                  </form>

                  {state.blockedDates.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {state.blockedDates.map(bd => (
                        <div
                          key={bd.date}
                          className="px-3 py-1.5 rounded-xl bg-red-950 border border-red-500/40 flex items-center gap-2 text-xs"
                        >
                          <span className="font-mono font-bold text-red-300">{bd.date}</span>
                          <span className="text-white/60">({bd.reason})</span>
                          <button
                            onClick={() => handleUnblockDate(bd.date)}
                            className="p-1 hover:text-white text-red-400"
                            title="Unblock"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MENU MANAGER */}
            {activeTab === 'menu' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-amber-300">
                      DHAMRAI MENU VAULT ({state.items.length} Dishes)
                    </h3>
                    <p className="text-xs text-white/60">
                      Add, edit, or toggle Sold Out status on menu items instantly.
                    </p>
                  </div>
                  <button
                    onClick={openNewItemModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-xs shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Dish</span>
                  </button>
                </div>

                {/* Items grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {state.items.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#141414] border border-amber-500/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-amber-300 uppercase">
                              {item.category}
                            </span>
                            <h4 className="font-serif font-bold text-base text-white">
                              {item.name}
                            </h4>
                          </div>
                          {item.soldOut && (
                            <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500 text-[10px] font-bold uppercase">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/70 mt-1 line-clamp-2">
                          {item.description || item.ingredients}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-300">
                          {typeof item.price === 'number' ? `৳${item.price}` : JSON.stringify(item.price)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-300"
                            title="Edit Dish"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete Dish"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SETTINGS EDITOR */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl">
                <form onSubmit={handleSaveSettings} className="space-y-6 bg-[#141414] p-6 rounded-2xl border border-amber-500/20">
                  <h3 className="font-serif text-xl font-bold text-amber-300">
                    RESTAURANT BUSINESS INFORMATION & SETTINGS
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.restaurantName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, restaurantName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        WhatsApp Order Number (country code, no symbol)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappOrderNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappOrderNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        WhatsApp Display Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappDisplay}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDisplay: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        Phone Number (from Google Listing)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phoneNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        Dhamrai Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        Hero Tagline
                      </label>
                      <input
                        type="text"
                        value={settingsForm.heroTagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroTagline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        About Story Text
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.aboutText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <ImageUploader
                        value={settingsForm.siteLogoUrl || ''}
                        onChange={(url) => setSettingsForm({ ...settingsForm, siteLogoUrl: url })}
                        bucket="site-logos"
                        label="SITE LOGO (NAVBAR, FOOTER & FAVICON)"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <ImageUploader
                        value={settingsForm.heroImageUrl || ''}
                        onChange={(url) => setSettingsForm({ ...settingsForm, heroImageUrl: url })}
                        bucket="hero-banners"
                        label="HOMEPAGE HERO / BANNER IMAGE (OPTIONAL - SUPABASE STORAGE)"
                      />
                    </div>
                  </div>

                  {settingsSavedMsg && (
                    <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{settingsSavedMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-xs tracking-wide"
                  >
                    Save All Business Settings
                  </button>
                </form>

                {/* CHANGE ADMIN PASSWORD CARD */}
                <div className="mt-8 bg-[#141414] p-6 rounded-2xl border border-amber-500/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif text-xl font-bold text-amber-300">
                      CHANGE OWNER ADMIN PASSWORD
                    </h3>
                  </div>
                  <p className="text-xs text-[#F5EFE2]/60">
                    Update the credentials used to log into this Admin Panel securely.
                  </p>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                    {/* Current Password */}
                    <div>
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            setChangePasswordError('');
                            setChangePasswordSuccess('');
                          }}
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-amber-300 transition-colors p-1"
                          aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        New Password (Min. 8 characters) *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          placeholder="Enter new password (at least 8 chars)"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setChangePasswordError('');
                            setChangePasswordSuccess('');
                          }}
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-amber-300 transition-colors p-1"
                          aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setChangePasswordError('');
                            setChangePasswordSuccess('');
                          }}
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-xs text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-amber-300 transition-colors p-1"
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {changePasswordError && (
                      <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 font-mono">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{changePasswordError}</span>
                      </div>
                    )}

                    {/* Success Message */}
                    {changePasswordSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{changePasswordSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={changePasswordLoading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-xs tracking-wide transition-all disabled:opacity-50"
                    >
                      {changePasswordLoading ? 'Updating Password...' : 'Update Admin Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* NEW/EDIT MENU ITEM MODAL */}
      {isNewItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <form
            onSubmit={handleSaveMenuItem}
            className="w-full max-w-lg rounded-2xl bg-[#181818] border border-amber-500/40 p-6 space-y-4 max-h-[90vh] overflow-y-auto text-white"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-amber-300">
                {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setIsNewItemModal(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-amber-300 block mb-1">Dish Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-white/20 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-amber-300 block mb-1">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/20 text-sm focus:border-amber-400 focus:outline-none text-white"
              >
                {state.categories.map(c => (
                  <option key={c.id} value={c.name} className="bg-[#111]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICING STRUCTURE */}
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-amber-500/30 space-y-3">
              <label className="text-xs font-mono uppercase text-amber-300 font-bold block">
                Pricing Structure *
              </label>

              {/* Radio options / toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#141414] rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setPriceType('single');
                    setPriceError('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all text-center flex items-center justify-center gap-2 ${
                    priceType === 'single'
                      ? 'bg-amber-500 text-black font-bold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full border ${priceType === 'single' ? 'bg-black border-black' : 'border-white/40'}`} />
                  Single Price
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriceType('multiple');
                    setPriceError('');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all text-center flex items-center justify-center gap-2 ${
                    priceType === 'multiple'
                      ? 'bg-amber-500 text-black font-bold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full border ${priceType === 'multiple' ? 'bg-black border-black' : 'border-white/40'}`} />
                  Multiple Sizes (e.g. Pizza)
                </button>
              </div>

              {/* Single Price Input */}
              {priceType === 'single' && (
                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Price (৳) *
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-mono text-sm">৳</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 350"
                      value={singlePrice}
                      onChange={(e) => {
                        setSinglePrice(e.target.value);
                        setPriceError('');
                      }}
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[#141414] border border-white/20 text-sm font-mono text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Multiple Sizes Inputs */}
              {priceType === 'multiple' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 px-1 text-[11px] font-mono text-white/60">
                    <span className="flex-1">Size Label (e.g. 8, 10, 12 or Large)</span>
                    <span className="flex-1">Price (৳)</span>
                    <span className="w-8"></span>
                  </div>

                  {sizePrices.map((row, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder='e.g. 8 or Medium'
                          value={row.size}
                          onChange={(e) => {
                            const newRows = [...sizePrices];
                            newRows[index].size = e.target.value;
                            setSizePrices(newRows);
                            setPriceError('');
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs font-mono text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-mono text-xs">৳</span>
                        <input
                          type="number"
                          min="1"
                          placeholder="Price"
                          value={row.price}
                          onChange={(e) => {
                            const newRows = [...sizePrices];
                            newRows[index].price = e.target.value;
                            setSizePrices(newRows);
                            setPriceError('');
                          }}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-xs font-mono text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (sizePrices.length > 1) {
                            setSizePrices(sizePrices.filter((_, i) => i !== index));
                          } else {
                            setSizePrices([{ size: '', price: '' }]);
                          }
                          setPriceError('');
                        }}
                        className="w-8 h-8 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 flex items-center justify-center transition-colors shrink-0"
                        title="Remove size"
                        aria-label="Remove size option"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setSizePrices([...sizePrices, { size: '', price: '' }]);
                      setPriceError('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>
                </div>
              )}

              {/* Price validation error banner */}
              {priceError && (
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{priceError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-amber-300 block mb-1">Description / Ingredients</label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Cinematic mob boss Italian-American description..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-white/20 text-sm"
              />
            </div>

            <div>
              <ImageUploader
                value={formImageUrl}
                onChange={(url) => setFormImageUrl(url)}
                bucket="menu-images"
                label="DISH IMAGE (SUPABASE STORAGE / DROPZONE)"
              />
            </div>

            {/* Tags & Sold Out toggle */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {(['Best Seller', 'Spicy', 'New'] as const).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      formTags.includes(tag) ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs font-mono text-red-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formSoldOut}
                  onChange={(e) => setFormSoldOut(e.target.checked)}
                />
                <span>Mark Sold Out</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsNewItemModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm"
              >
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Booking Confirmation Modal */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white">Delete Reservation?</h4>
                <p className="text-xs text-white/60 font-mono">ID: #{bookingToDelete.id.slice(-6)}</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300">
              Are you sure you want to permanently delete this booking? This cannot be undone.
            </p>

            <div className="bg-[#0A0A0A] p-3 rounded-xl border border-white/10 text-xs font-mono space-y-1">
              <div><span className="text-amber-300/70">Guest:</span> <strong className="text-white">{bookingToDelete.name}</strong></div>
              <div><span className="text-amber-300/70">Phone:</span> <span className="text-white">{bookingToDelete.phone}</span></div>
              <div><span className="text-amber-300/70">Date & Time:</span> <span className="text-white">{bookingToDelete.date} @ {bookingToDelete.timeSlot}</span></div>
              <div><span className="text-amber-300/70">Status:</span> <span className="text-amber-400">{bookingToDelete.status}</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingBooking}
                onClick={() => setBookingToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingBooking}
                onClick={handleDeleteBooking}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingBooking ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Menu Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white">Delete Menu Dish?</h4>
                <p className="text-xs text-amber-300 font-mono">{itemToDelete.category}</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300">
              Are you sure you want to delete <strong className="text-white">"{itemToDelete.name}"</strong>? This cannot be undone.
            </p>

            <div className="bg-[#0A0A0A] p-3 rounded-xl border border-white/10 text-xs font-mono space-y-1">
              <div><span className="text-amber-300/70">Dish Name:</span> <strong className="text-white">{itemToDelete.name}</strong></div>
              <div><span className="text-amber-300/70">Category:</span> <span className="text-white">{itemToDelete.category}</span></div>
              <div>
                <span className="text-amber-300/70">Price:</span>{' '}
                <span className="text-amber-400 font-bold">
                  {typeof itemToDelete.price === 'number'
                    ? `৳${itemToDelete.price}`
                    : typeof itemToDelete.price === 'object'
                    ? JSON.stringify(itemToDelete.price)
                    : String(itemToDelete.price)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingItem}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingItem}
                onClick={handleConfirmDeleteItem}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingItem ? 'Deleting...' : 'Delete Dish'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
