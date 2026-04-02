import { Truck, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg text-secondary-foreground">Amazing Moving</span>
            </div>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed mb-4">
              Professional moving services with a modern touch. Licensed, insured, and trusted by thousands.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-secondary-foreground/80">Services</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              {["Local Moving", "Long-Distance Moving", "Residential Moving", "Commercial Relocation", "Packing & Unpacking", "Storage Solutions", "Furniture Assembly"].map(s => (
                <li key={s}><a href="#services" className="hover:text-primary transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-secondary-foreground/80">Contact</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/60">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" /> (800) 123-4567</li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary shrink-0" /> hello@amazingmoving.com</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" /> 123 Moving Street, Suite 100<br />Austin, TX 78701</li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Mon-Sat: 7AM–8PM<br />Sun: 9AM–5PM</li>
            </ul>
          </div>

          {/* Mini Form */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-secondary-foreground/80">Quick Quote</h4>
            <form className="space-y-3" onSubmit={e => e.preventDefault()}>
              <Input placeholder="Your Name" className="bg-secondary-foreground/5 border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/40" />
              <Input placeholder="Email" type="email" className="bg-secondary-foreground/5 border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/40" />
              <Textarea placeholder="Tell us about your move..." rows={3} className="bg-secondary-foreground/5 border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/40 resize-none" />
              <Button className="w-full">Send Request</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-xs text-secondary-foreground/40">
          <p>© 2026 Amazing Moving. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
