import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Research collaboration, technical, academic, and institutional pilot inquiries.",
};

export default function ContactPage() {
  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-navy-950">Contact</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Use this form for research-collaboration, technical, academic, or institutional pilot inquiries.
      </p>

      <div className="mt-3 space-y-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-slate-800">
        <p><strong className="font-semibold text-navy-900">Not an emergency service.</strong> If an account may be actively compromised, contact your financial institution through an official channel immediately.</p>
        <p><strong className="font-semibold text-navy-900">Not legal advice.</strong> Responses to this form are not legal advice.</p>
        <p>Do not submit sensitive financial credentials through this form.</p>
      </div>

      <div className="mt-6 max-w-xl">
        <ContactForm />
      </div>
    </Container>
  );
}
