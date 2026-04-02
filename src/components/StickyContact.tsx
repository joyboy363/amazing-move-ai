import { Phone, Mail, MessageSquare } from "lucide-react";

const StickyContact = () => {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2 md:bottom-6 md:left-6">
      <a
        href="tel:+18001234567"
        className="w-12 h-12 rounded-full bg-primary shadow-[var(--shadow-glow)] flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
        title="Call Us"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href="https://wa.me/18001234567"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-green-500 shadow-lg flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
        title="WhatsApp"
      >
        <MessageSquare className="w-5 h-5" />
      </a>
      <a
        href="mailto:hello@amazingmoving.com"
        className="w-12 h-12 rounded-full bg-secondary shadow-lg flex items-center justify-center text-secondary-foreground hover:scale-110 transition-transform"
        title="Email Us"
      >
        <Mail className="w-5 h-5" />
      </a>
    </div>
  );
};

export default StickyContact;
