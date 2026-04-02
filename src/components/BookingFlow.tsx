import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Package, ClipboardCheck, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const steps = [
  { icon: MapPin, label: "Move Details" },
  { icon: Package, label: "Services" },
  { icon: ClipboardCheck, label: "Review" },
  { icon: CheckCircle, label: "Confirm" },
];

const additionalServices = [
  "Packing & Unpacking",
  "Furniture Disassembly",
  "Piano Moving",
  "Storage (1 Month)",
  "Fragile Item Handling",
  "Appliance Hookup",
];

const BookingFlow = () => {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ from: "", to: "", date: "", size: "", name: "", email: "", phone: "" });
  const [services, setServices] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggleService = (s: string) => {
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <section id="booking" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Book Your Move</span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mt-3 mb-4">Easy 4-Step Booking</h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
                {i < steps.length - 1 && (
                  <div className={`absolute hidden`} />
                )}
              </div>
            ))}
          </div>
          {/* Progress line */}
          <div className="relative h-1 bg-muted rounded-full mb-8 -mt-6">
            <motion.div className="absolute h-1 rounded-full gradient-primary" animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8 min-h-[320px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h3 className="font-heading font-bold text-xl text-foreground mb-4">Where are you moving?</h3>
                  <Input placeholder="Pickup address or ZIP" value={details.from} onChange={e => setDetails(d => ({ ...d, from: e.target.value }))} />
                  <Input placeholder="Destination address or ZIP" value={details.to} onChange={e => setDetails(d => ({ ...d, to: e.target.value }))} />
                  <Input type="date" value={details.date} onChange={e => setDetails(d => ({ ...d, date: e.target.value }))} />
                  <Select value={details.size} onValueChange={v => setDetails(d => ({ ...d, size: v }))}>
                    <SelectTrigger><SelectValue placeholder="Home size" /></SelectTrigger>
                    <SelectContent>
                      {["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <h3 className="font-heading font-bold text-xl text-foreground mb-4">Choose additional services</h3>
                  {additionalServices.map(s => (
                    <label key={s} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <Checkbox checked={services.includes(s)} onCheckedChange={() => toggleService(s)} />
                      <span className="text-sm font-medium text-foreground">{s}</span>
                    </label>
                  ))}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h3 className="font-heading font-bold text-xl text-foreground mb-4">Review & Contact Info</h3>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
                    <p><span className="font-semibold text-foreground">From:</span> <span className="text-muted-foreground">{details.from || "—"}</span></p>
                    <p><span className="font-semibold text-foreground">To:</span> <span className="text-muted-foreground">{details.to || "—"}</span></p>
                    <p><span className="font-semibold text-foreground">Date:</span> <span className="text-muted-foreground">{details.date || "—"}</span></p>
                    <p><span className="font-semibold text-foreground">Size:</span> <span className="text-muted-foreground">{details.size || "—"}</span></p>
                    {services.length > 0 && <p><span className="font-semibold text-foreground">Services:</span> <span className="text-muted-foreground">{services.join(", ")}</span></p>}
                  </div>
                  <Input placeholder="Full Name" value={details.name} onChange={e => setDetails(d => ({ ...d, name: e.target.value }))} />
                  <Input placeholder="Email" type="email" value={details.email} onChange={e => setDetails(d => ({ ...d, email: e.target.value }))} />
                  <Input placeholder="Phone" type="tel" value={details.phone} onChange={e => setDetails(d => ({ ...d, phone: e.target.value }))} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  {!confirmed ? (
                    <>
                      <h3 className="font-heading font-bold text-xl text-foreground mb-4">Ready to confirm?</h3>
                      <p className="text-muted-foreground text-sm mb-6">Click below to submit your booking request. Our team will contact you within 1 hour.</p>
                      <Button size="lg" className="px-10 py-6 text-base font-semibold" onClick={() => setConfirmed(true)}>
                        Confirm Booking
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Booking Submitted!</h3>
                      <p className="text-muted-foreground">We'll reach out to {details.name || "you"} shortly to finalize details.</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {!(step === 3 && confirmed) && (
              <div className="flex justify-between mt-8 pt-4 border-t border-border/50">
                <Button variant="ghost" onClick={prev} disabled={step === 0} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {step < 3 && (
                  <Button onClick={next} className="gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingFlow;
