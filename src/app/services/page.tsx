"use client";

import { useState } from "react";
import Image from "next/image";
import { services } from "@/lib/data/services";
import { sendBookingEmail } from "@/lib/email/sendOrderEmail";
import { generateBookingId, saveBooking } from "@/lib/orders";
import type { Booking, Service } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import { BUSINESS } from "@/lib/config";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

export default function ServicesPage() {
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  const openBooking = (service: Service) => {
    setBookingService(service);
    setError("");
    setSuccess(null);
  };

  const closeBooking = () => {
    setBookingService(null);
    setForm({ name: "", email: "", phone: "", date: "", time: "", notes: "" });
    setSuccess(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService) return;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const selected = new Date(form.date);
    if (selected < minDate) {
      setError("Please select a date at least 1 day from today.");
      return;
    }

    setSubmitting(true);
    setError("");

    const booking: Booking = {
      id: generateBookingId(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: bookingService.name,
      date: form.date,
      time: form.time,
      notes: form.notes,
      dateCreated: new Date().toISOString(),
    };

    const emailResult = await sendBookingEmail(booking);
    saveBooking(booking);

    setSubmitting(false);
    setSuccess(booking);
    setForm({ name: "", email: "", phone: "", date: "", time: "", notes: "" });
    if (!emailResult.ok) {
      console.error("Booking email failed:", emailResult.status, emailResult.text);
    }
  };

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Our Expertise
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Premium beauty services delivered by certified professionals. Select a service to
            book your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col rounded-2xl bg-surface border border-surface-light hover:border-gold/40 overflow-hidden transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-1"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold text-background text-xs font-bold">
                    {service.priceRange}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-foreground/90 text-xs">
                    {service.duration}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h2 className="font-serif text-xl font-bold mb-2">{service.name}</h2>
                <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {service.includes.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <svg
                        className="w-4 h-4 text-gold mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openBooking(service)}
                  className="h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Book This Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!bookingService}
        onClose={closeBooking}
        title={success ? "Booking Confirmed" : `Book ${bookingService?.name ?? ""}`}
      >
        {success && bookingService ? (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gold/15 text-gold mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">Booking Received!</h3>
            <p className="text-muted text-sm mb-4">
              Reference: <span className="text-gold font-semibold">{success.id}</span>
            </p>
            <div className="rounded-xl bg-surface-light/50 p-4 text-left text-sm space-y-2 mb-5">
              <p>
                <span className="text-muted">Service:</span>{" "}
                <span className="font-semibold">{success.service}</span>
              </p>
              <p>
                <span className="text-muted">Date:</span>{" "}
                <span className="font-semibold">
                  {new Date(success.date + "T00:00:00").toLocaleDateString("en-CA", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p>
                <span className="text-muted">Time:</span>{" "}
                <span className="font-semibold">{success.time}</span>
              </p>
              <p>
                <span className="text-muted">Phone:</span>{" "}
                <span className="font-semibold">{success.phone}</span>
              </p>
            </div>
            <p className="text-xs text-muted mb-6">
              Our team will contact you on <span className="text-gold">{BUSINESS.phone}</span> to
              confirm your appointment. See you soon!
            </p>
            <button
              onClick={closeBooking}
              className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-xl font-serif mb-1">{bookingService?.name}</p>
              <p className="text-sm text-gold">
                {bookingService?.priceRange} &middot; {bookingService?.duration}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                  Full Name *
                </span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
                  placeholder="Jane Smith"
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                  Phone Number *
                </span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
                  placeholder="(647) 555-0123"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                Email *
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
                placeholder="jane@email.com"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                  Preferred Date *
                </span>
                <input
                  type="date"
                  required
                  min={minDate.toISOString().split("T")[0]}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none [color-scheme:dark]"
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                  Preferred Time *
                </span>
                <select
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none appearance-none"
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                Notes (optional)
              </span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-[80px] resize-none"
                placeholder="Anything we should know?"
              />
            </label>
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}