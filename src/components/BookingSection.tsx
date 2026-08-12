import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, ShieldCheck, CheckCircle2, Sparkles, AlertCircle, Send, HeartHandshake } from 'lucide-react';
import { BookingType, BookingRequest, BlockedDate, BusinessSettings } from '../types';

interface BookingSectionProps {
  blockedDates: BlockedDate[];
  onBookingCreated: (newBooking: BookingRequest) => void;
  settings: BusinessSettings;
}

export default function BookingSection({
  blockedDates,
  onBookingCreated,
  settings
}: BookingSectionProps) {
  const [bookingType, setBookingType] = useState<BookingType>('table');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState('Casual Dining');
  const [eventThemeRequest, setEventThemeRequest] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Operating time slots (12:00 PM – 10:00 PM)
  const availableTimeSlots = [
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const formatTimeSlot = (slot: string) => {
    const hour = parseInt(slot.split(':')[0], 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const isDateBlocked = (checkDate: string) => {
    return blockedDates.some((bd) => bd.date === checkDate);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) {
      setErrorMsg('Please complete all required contact and date fields.');
      return;
    }
    if (isDateBlocked(date)) {
      setErrorMsg(`Sorry, ${date} is marked unavailable / fully booked.`);
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const newBooking: BookingRequest = {
        id: `book-${Date.now()}`,
        bookingType,
        name: name.trim(),
        phone: phone.trim(),
        date,
        timeSlot,
        guests,
        occasion,
        eventThemeRequest: bookingType === 'event' ? eventThemeRequest : undefined,
        notes,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      setConfirmedBooking(newBooking);
      onBookingCreated(newBooking);

        // Also generate pre-filled WhatsApp confirmation message
        const waLines = [
          `*🗓 NEW ${bookingType.toUpperCase()} RESERVATION — PIZZA DON DHAMRAI*`,
          `-----------------------------------------`,
          `*Name:* ${name.trim()}`,
          `*Phone:* ${phone.trim()}`,
          `*Type:* ${bookingType === 'table' ? 'Table Reservation' : 'Event / Private Party'}`,
          `*Date:* ${date}`,
          `*Time:* ${formatTimeSlot(timeSlot)}`,
          `*Guests:* ${guests} People`,
          occasion ? `*Occasion:* ${occasion}` : '',
          bookingType === 'event' && eventThemeRequest ? `*Theme / Deco:* ${eventThemeRequest}` : '',
          notes ? `*Special Request:* ${notes}` : '',
          `-----------------------------------------`,
          `_Booking ID: #${newBooking.id.slice(-6)} — Pending House Confirmation_`
        ];

        const encodedMsg = encodeURIComponent(waLines.filter(Boolean).join('\n'));
        const waUrl = `https://wa.me/${settings.whatsappOrderNumber}?text=${encodedMsg}`;
        // Trigger WhatsApp open
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 300);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error saving booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setConfirmedBooking(null);
    setName('');
    setPhone('');
    setNotes('');
    setEventThemeRequest('');
  };

  return (
    <section id="book" className="py-20 bg-[#0D0D0D] relative border-t border-b border-amber-500/20">
      {/* Decorative Gold Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>THE DON'S DHAMRAI RESERVATIONS</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#F5EFE2]">
            BOOK A TABLE OR PRIVATE EVENT
          </h2>
          <p className="text-sm sm:text-base text-amber-100/70 mt-3 max-w-2xl mx-auto">
            Reserve a VIP table for an intimate dinner or book our entire boutique Italian-American dining room for birthday celebrations, family gatherings, and corporate events.
          </p>
        </div>

        {confirmedBooking ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#141414] border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Reservation Request Recorded
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#F5EFE2] mt-1">
                Your Request Has Been Sent!
              </h3>
              <p className="text-sm text-[#F5EFE2]/80 mt-2 max-w-md mx-auto leading-relaxed">
                The Pizza Don Dhamrai team will confirm your booking shortly on WhatsApp/phone ({settings.phoneNumber}).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0B0B] border border-white/10 max-w-sm mx-auto text-left text-xs space-y-2 font-mono text-amber-100/90">
              <div className="flex justify-between">
                <span className="text-amber-300/60">Booking ID:</span>
                <span className="text-amber-300">#{confirmedBooking.id.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300/60">Guest Name:</span>
                <span>{confirmedBooking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300/60">Date & Time:</span>
                <span>{confirmedBooking.date} @ {formatTimeSlot(confirmedBooking.timeSlot)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300/60">Party Size:</span>
                <span>{confirmedBooking.guests} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300/60">Status:</span>
                <span className="text-amber-400 font-bold uppercase">{confirmedBooking.status}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-300 font-semibold text-xs"
              >
                Make Another Reservation
              </button>
              <a
                href={`https://wa.me/${settings.whatsappOrderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Message Restaurant on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="p-6 sm:p-10 rounded-3xl bg-[#141414] border border-amber-500/30 shadow-2xl space-y-8">
            {/* Booking Type Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-amber-300 block text-center">
                Select Experience Type
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#0A0A0A] border border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setBookingType('table')}
                  className={`py-3.5 px-4 rounded-xl font-serif text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    bookingType === 'table'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-[#0D0D0D] shadow-lg shadow-amber-600/30 scale-[1.02]'
                      : 'text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Table Reservation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType('event')}
                  className={`py-3.5 px-4 rounded-xl font-serif text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    bookingType === 'event'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-[#0D0D0D] shadow-lg shadow-amber-600/30 scale-[1.02]'
                      : 'text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Event / Private Party</span>
                </button>
              </div>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="text-xs font-mono uppercase text-amber-300 block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akash Prog"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-[#F5EFE2] text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-mono uppercase text-amber-300 block mb-1.5">
                  WhatsApp / Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01711-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-[#F5EFE2] text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-mono uppercase text-amber-300 block mb-1.5">
                  Booking Date * {isDateBlocked(date) && <span className="text-red-400 font-bold">(Fully Booked!)</span>}
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border text-sm text-[#F5EFE2] focus:outline-none ${
                    isDateBlocked(date) ? 'border-red-500 text-red-300' : 'border-amber-500/30 focus:border-amber-400'
                  }`}
                />
              </div>

              {/* Time Slot (12:00 PM – 10:00 PM) */}
              <div>
                <label className="text-xs font-mono uppercase text-amber-300 block mb-1.5">
                  Preferred Time Slot (12:00 PM – 10:00 PM)
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-[#F5EFE2] text-sm focus:outline-none focus:border-amber-400"
                >
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot} className="bg-[#111] text-white">
                      {formatTimeSlot(slot)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guests Count */}
              <div>
                <label className="text-xs font-mono uppercase text-amber-300 block mb-1.5">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-[#F5EFE2] text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Occasion */}
              <div>
                <label className="text-xs font-mono uppercase text-amber-300 block mb-1.5">
                  Occasion (Optional)
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-[#F5EFE2] text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Casual Dining" className="bg-[#111]">Casual Dining</option>
                  <option value="Birthday Party" className="bg-[#111]">Birthday Party</option>
                  <option value="Family Function" className="bg-[#111]">Family Function</option>
                  <option value="Corporate / Team Lunch" className="bg-[#111]">Corporate / Team Lunch</option>
                  <option value="Anniversary" className="bg-[#111]">Anniversary</option>
                  <option value="Other Celebration" className="bg-[#111]">Other Celebration</option>
                </select>
              </div>
            </div>

            {/* Event-specific extra fields */}
            {bookingType === 'event' && (
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-serif font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Event Decoration & Theme Request</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Black & Gold Don theme table balloons, bringing our own birthday cake..."
                  value={eventThemeRequest}
                  onChange={(e) => setEventThemeRequest(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-amber-500/30 text-[#F5EFE2] text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Optional notes */}
            <div>
              <label className="text-xs font-mono uppercase text-amber-300 block mb-1.5">
                Special Seating / Dietary Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Quiet window table, high chair needed..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-amber-500/30 text-[#F5EFE2] text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting || isDateBlocked(date)}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 text-[#0D0D0D] font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>
                {submitting ? 'Submitting Reservation...' : `Confirm ${bookingType === 'table' ? 'Table' : 'Event'} Booking`}
              </span>
            </button>

            <p className="text-[11px] text-center text-amber-100/50">
              * By booking, you will receive an instant WhatsApp confirmation with our Thana Stand Dhamrai team ({settings.whatsappDisplay}).
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
