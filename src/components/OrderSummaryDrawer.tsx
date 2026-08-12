import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CartItem, BusinessSettings } from '../types';

interface OrderSummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  settings: BusinessSettings;
}

export default function OrderSummaryDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings
}: OrderSummaryDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dinein'>('delivery');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (!customerName.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg('Please provide your contact phone number.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please provide your Dhamrai delivery address.');
      return;
    }
    setErrorMsg('');

    // Format WhatsApp pre-filled message
    let lines = [
      `*🛒 NEW FOOD ORDER — PIZZA DON DHAMRAI*`,
      `-----------------------------------------`,
      `*Customer:* ${customerName.trim()}`,
      `*Phone:* ${customerPhone.trim()}`,
      `*Order Type:* ${orderType.toUpperCase()}`,
      orderType === 'delivery' ? `*Address:* ${deliveryAddress.trim()}` : '',
      `-----------------------------------------`,
      `*ITEMS ORDERED:*`
    ];

    cart.forEach((item, idx) => {
      const sizeStr = item.size ? ` [Size: ${item.size}]` : '';
      const noteStr = item.note ? ` (Note: ${item.note})` : '';
      lines.push(`${idx + 1}. *${item.name}*${sizeStr} x${item.quantity} = ৳${item.price * item.quantity}${noteStr}`);
    });

    lines.push(`-----------------------------------------`);
    lines.push(`*ESTIMATED TOTAL: ৳${totalAmount}*`);
    lines.push(`_Sent via Pizza Don Dhamrai Official Web Platform_`);

    const message = lines.filter(Boolean).join('\n');
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${settings.whatsappOrderNumber}?text=${encodedMsg}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-[#111111] border-l border-amber-500/30 h-full flex flex-col shadow-2xl text-[#F5EFE2]">
        {/* Header */}
        <div className="p-5 border-b border-amber-500/20 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold tracking-wide text-[#F5EFE2]">
                YOUR ORDER VAULT
              </h3>
              <p className="text-xs text-amber-200/60 font-mono">
                {cart.length} {cart.length === 1 ? 'Dish' : 'Dishes'} Selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-16 h-16 text-amber-500/20 mb-3" />
              <h4 className="font-serif text-xl text-amber-100">Your Order is Empty</h4>
              <p className="text-xs text-[#F5EFE2]/60 mt-1 max-w-xs">
                Explore our Pizza Don Dhamrai menu and tap any item to add it to your WhatsApp order.
              </p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#181818] border border-amber-500/20 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#F5EFE2] truncate">
                        {item.name}
                      </span>
                      {item.size && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                          {item.size}
                        </span>
                      )}
                    </div>
                    {item.note && (
                      <p className="text-[11px] text-amber-200/60 font-mono italic truncate">
                        Note: {item.note}
                      </p>
                    )}
                    <p className="text-xs font-mono text-amber-400 mt-1">
                      ৳{item.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-[#0E0E0E] p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-amber-300"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-amber-300"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Order Type Toggle */}
              <div className="pt-4 border-t border-amber-500/20 space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-amber-300 block">
                  Select Service Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'delivery', label: 'Delivery' },
                    { id: 'takeaway', label: 'Takeaway' },
                    { id: 'dinein', label: 'Dine-In' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setOrderType(opt.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        orderType === opt.id
                          ? 'bg-amber-500 text-black border-amber-400 shadow'
                          : 'bg-[#181818] text-white/80 border-white/10 hover:border-amber-500/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Contact Form */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tanvir Rahman"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-sm text-[#F5EFE2] placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 01711-000000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-sm text-[#F5EFE2] placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="text-xs font-mono uppercase text-amber-300 block mb-1">
                      Delivery Address in Dhamrai *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Thana Stand / Monowar Complex area"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-sm text-[#F5EFE2] placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-amber-500/20 bg-[#141414] space-y-3">
            <div className="flex items-center justify-between font-serif text-lg">
              <span className="text-amber-100/80">Estimated Total:</span>
              <span className="font-mono font-bold text-2xl text-amber-300">
                ৳{totalAmount}
              </span>
            </div>

            <button
              onClick={handleSendWhatsAppOrder}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Order via WhatsApp ({settings.whatsappDisplay})</span>
            </button>

            <button
              onClick={onClearCart}
              className="w-full py-1.5 text-center text-xs text-red-400/70 hover:text-red-400 transition-colors font-mono uppercase"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
