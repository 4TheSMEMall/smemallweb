import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with The SME Mall team.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-gray-300">We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-lg mx-auto px-4">
          {/* The form needs state (useState), so it must be a Client Component */}
          <ContactForm />
        </div>
      </section>
    </PublicLayout>
  );
}
