"use client";

import { useState, FormEvent } from "react";
import { submitContact } from "@/lib/api";

const INQUIRY_TYPES = [
  { value: "general", label: "General inquiry" },
  { value: "research_collaboration", label: "Research collaboration" },
  { value: "technical", label: "Technical inquiry" },
  { value: "academic", label: "Academic inquiry" },
  { value: "institutional_pilot", label: "Institutional pilot inquiry" },
];

export function ContactForm() {
  const [inquiryType, setInquiryType] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await submitContact({ inquiry_type: inquiryType, name, email, organization, message, website });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl2 border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-800">
        Thank you for reaching out. This research prototype does not store contact-form submissions without
        disclosure, and none was stored for this submission beyond processing your request.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl2 border border-slate-200 bg-white p-6">
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />

      <label className="block text-sm">
        <span className="font-medium text-slate-800">Inquiry type</span>
        <select
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-800">Name</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-800">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-800">Organization (optional)</span>
        <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-800">Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} maxLength={4000} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </label>

      <div className="rounded-lg bg-amber-500/10 p-3 text-xs text-slate-700">
        Do not include sensitive financial credentials, passwords, PINs, or full account/card numbers in this form.
        This is not an emergency service and not a substitute for legal advice.
      </div>

      {error && <p className="text-sm text-redrisk-500">{error}</p>}

      <button type="submit" disabled={status === "sending"} className="w-full rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
