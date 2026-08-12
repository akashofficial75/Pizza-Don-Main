import React from 'react';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Facebook } from 'lucide-react';
import { BusinessSettings } from '../types';

interface ContactSectionProps {
  settings: BusinessSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>VISIT PIZZA DON IN DHAMRAI</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#F5EFE2]">
            LOCATION & CONTACT
          </h2>
          <p className="text-sm sm:text-base text-amber-100/70 mt-2">
            We are centrally located at Monowar Complex (Thana Stand), Dhamrai 1350, Bangladesh. Visit us for dine-in or order for fast takeaway & delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
                  RESTAURANT LOCATION
                </span>
                <h3 className="font-serif text-lg font-bold text-[#F5EFE2] mt-1">
                  {settings.address}
                </h3>
                <p className="text-xs text-[#F5EFE2]/60 mt-1">
                  Monowar Complex • Thana Stand • Dhamrai 1350
                </p>
                <a
                  href="https://www.google.com/maps/place/PIZZA+DON+Dhamrai/@23.908368,90.2162662,17z/data=!4m14!1m7!3m6!1s0x3755eb525eb81f6b:0x89d01bda46ae0076!2sPIZZA+DON+Dhamrai!8m2!3d23.9083631!4d90.2188411!16s%2Fg%2F11xs___w7m!3m5!1s0x3755eb525eb81f6b:0x89d01bda46ae0076!8m2!3d23.9083631!4d90.2188411!16s%2Fg%2F11xs___w7m?entry=ttu&g_ep=EgoyMDI2MDgwMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium text-xs transition-all"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WhatsApp Order Card */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
                  WHATSAPP INSTANT FOOD ORDERING
                </span>
                <h3 className="font-serif text-lg font-bold text-[#F5EFE2] mt-1">
                  {settings.whatsappDisplay}
                </h3>
                <p className="text-xs text-[#F5EFE2]/60 mt-1">
                  Send your order or reservation request via WhatsApp for immediate response.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsappOrderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow transition-all"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Phone Booking Card */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
                  DIRECT PHONE CALL
                </span>
                <h3 className="font-serif text-lg font-bold text-[#F5EFE2] mt-1">
                  {settings.phoneNumber}
                </h3>
                <p className="text-xs text-[#F5EFE2]/60 mt-1">
                  Table reservation & private event inquiries.
                </p>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
                  OPERATING HOURS
                </span>
                <h3 className="font-serif text-lg font-bold text-[#F5EFE2] mt-1">
                  {settings.openingHours}
                </h3>
                <p className="text-xs text-[#F5EFE2]/60 mt-1">
                  Open 7 days a week for dine-in, takeaway, and delivery.
                </p>
              </div>
            </div>

            {/* Facebook Page Card */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
                  OFFICIAL FACEBOOK PAGE
                </span>
                <h3 className="font-serif text-lg font-bold text-[#F5EFE2] mt-1">
                  PIZZA DON Dhamrai
                </h3>
                <p className="text-xs text-[#F5EFE2]/60 mt-1">
                  Follow us on Facebook for updates, offers, and community reviews.
                </p>
                <a
                  href="https://www.facebook.com/pizzadondhamrai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all"
                >
                  <span>Visit Facebook Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 flex flex-col min-h-[500px]">
            <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-[#141414] flex-1 flex flex-col relative">
              <div className="relative flex-1 w-full min-h-[400px]">
                <iframe
                  src="https://maps.google.com/maps?q=23.9083631,90.2188411&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PIZZA DON Dhamrai Map Location"
                  className="w-full h-full absolute inset-0 filter contrast-125 saturate-110"
                />

                {/* Floating "View larger map" badge on top-right corner of map */}
                <div className="absolute top-4 right-4 z-10">
                  <a
                    href="https://www.google.com/maps/place/PIZZA+DON+Dhamrai/@23.908368,90.2162662,17z/data=!4m14!1m7!3m6!1s0x3755eb525eb81f6b:0x89d01bda46ae0076!2sPIZZA+DON+Dhamrai!8m2!3d23.9083631!4d90.2188411!16s%2Fg%2F11xs___w7m!3m5!1s0x3755eb525eb81f6b:0x89d01bda46ae0076!8m2!3d23.9083631!4d90.2188411!16s%2Fg%2F11xs___w7m?entry=ttu&g_ep=EgoyMDI2MDgwMi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D0D0D]/90 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 font-bold text-xs shadow-xl backdrop-blur-sm transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View Larger Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Bottom directions bar styled to match info cards */}
              <div className="p-5 bg-[#141414] border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-[#F5EFE2]">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-amber-300 block">EXACT MAP PIN</span>
                    <span className="font-serif font-bold text-sm">PIZZA DON Dhamrai • Monowar Complex</span>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/PIZZA+DON+Dhamrai/@23.908368,90.2162662,17z/data=!4m14!1m7!3m6!1s0x3755eb525eb81f6b:0x89d01bda46ae0076!2sPIZZA+DON+Dhamrai!8m2!3d23.9083631!4d90.2188411!16s%2Fg%2F11xs___w7m!3m5!1s0x3755eb525eb81f6b:0x89d01bda46ae0076!8m2!3d23.9083631!4d90.2188411!16s%2Fg%2F11xs___w7m?entry=ttu&g_ep=EgoyMDI2MDgwMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg transition-all shrink-0"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
