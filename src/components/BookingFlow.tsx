import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Package, ClipboardCheck, CheckCircle, ArrowRight, ArrowLeft, Loader2, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

// Format date as YYYY-MM-DD
const formatDate = (d: Date) => d.toISOString().split("T")[0];

// Format date for display as "Mon, Apr 10, 2026"
const formatDateDisplay = (dateStr: string) => {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

const BookingFlow = () => {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ from: "", to: "", date: "", size: "", name: "", email: "", phone: "" });
  const [services, setServices] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Availability state
  const [availableDates, setAvailableDates] = useState<Record<string, string>>({});
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Fetch available dates from Cal.com via Edge Function
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setIsLoadingDates(true);
      try {
        const start = formatDate(new Date());
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        const end = formatDate(endDate);

        console.log("Fetching available dates:", { start, end });

        const { data, error } = await supabase.functions.invoke("get-available-dates", {
          body: { start, end },
        });

        console.log("Available dates response:", { data, error });

        if (error) {
          console.error("Edge function error:", error);
          toast({
            title: "Could not load availability",
            description: "Please try refreshing the page.",
            variant: "destructive",
          });
        } else if (data?.availableDates) {
          setAvailableDates(data.availableDates);
          console.log(`Loaded ${Object.keys(data.availableDates).length} available dates`);
        } else {
          console.warn("No availableDates in response:", data);
        }
      } catch (err) {
        console.error("Failed to fetch available dates:", err);
        toast({
          title: "Could not load availability",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDates(false);
      }
    };

    fetchAvailableDates();
  }, []);

  const toggleService = (s: string) => {
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleDateSelect = (dateStr: string) => {
    setDetails(d => ({ ...d, date: dateStr }));
  };

  const handleConfirmBooking = async () => {
    if (!details.name || !details.email || !details.from || !details.to || !details.date) {
      toast({
        title: "Missing information",
        description: "Please fill in your name, email, addresses, and move date.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the slot time for the selected date
      const slotTime = availableDates[details.date] || null;

      const { data, error } = await supabase.functions.invoke("create-booking", {
        body: {
          name: details.name,
          email: details.email,
          phone: details.phone,
          from: details.from,
          to: details.to,
          date: details.date,
          size: details.size,
          services: services,
          slotTime: slotTime,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast({
          title: "Booking failed",
          description: "Something went wrong. Please try again or call us directly.",
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        setConfirmed(true);

        if (data.calendar_synced) {
          toast({
            title: "Booking confirmed! ✅",
            description: "Your move has been scheduled. Check your email for confirmation details.",
          });
        } else {
          toast({
            title: "Booking saved! ✅",
            description: data.message || "We've received your booking. Our team will contact you shortly.",
          });
        }
      } else {
        toast({
          title: "Booking issue",
          description: data?.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Connection error",
        description: "Could not reach our server. Please check your internet and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar rendering
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const goToPrevMonth = () => {
    const now = new Date();
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prevMonth >= new Date(now.getFullYear(), now.getMonth(), 1)) {
      setCurrentMonth(prevMonth);
    }
  };

  const goToNextMonth = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (nextMonth <= maxDate) {
      setCurrentMonth(nextMonth);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = formatDate(new Date());
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      const isAvailable = dateStr in availableDates && dateStr >= today;
      const isSelected = details.date === dateStr;
      const isPast = dateStr < today;

      days.push(
        <button
          key={day}
          type="button"
          disabled={!isAvailable || isPast}
          onClick={() => isAvailable && handleDateSelect(dateStr)}
          className={`
            h-10 w-full rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected
              ? "gradient-primary text-primary-foreground shadow-lg scale-105"
              : isAvailable
                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 hover:scale-105 cursor-pointer border border-emerald-500/20"
                : isPast
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground/50 cursor-not-allowed bg-muted/30 line-through"
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <section id="booking" className="section-padding">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-block rounded-xl px-8 py-6 bg-black/40 backdrop-blur-md border border-white/10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Book Your Move</span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mt-3 mb-4">Easy 4-Step Booking</h2>
          </div>
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

                  {/* Calendar date picker */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-foreground mb-2 block">Select your move date</label>
                    {isLoadingDates ? (
                      <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading available dates...</span>
                      </div>
                    ) : Object.keys(availableDates).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                        <CalendarX className="w-8 h-8" />
                        <span className="text-sm">No available dates found. Please call us to schedule.</span>
                      </div>
                    ) : (
                      <div className="border border-border/50 rounded-xl p-4 bg-background/50">
                        {/* Month navigation */}
                        <div className="flex items-center justify-between mb-3">
                          <button type="button" onClick={goToPrevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <span className="text-sm font-semibold text-foreground">{monthName}</span>
                          <button type="button" onClick={goToNextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        {/* Day labels */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                            <div key={d} className="h-8 flex items-center justify-center text-xs text-muted-foreground font-medium">{d}</div>
                          ))}
                        </div>
                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                          {renderCalendar()}
                        </div>
                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/30" />
                            <span className="text-xs text-muted-foreground">Available</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-muted/30" />
                            <span className="text-xs text-muted-foreground line-through">Booked</span>
                          </div>
                        </div>
                        {details.date && (
                          <div className="mt-2 text-sm text-primary font-medium">
                            ✓ Selected: {formatDateDisplay(details.date)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

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
                    <p><span className="font-semibold text-foreground">Date:</span> <span className="text-muted-foreground">{details.date ? formatDateDisplay(details.date) : "—"}</span></p>
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
                      <Button
                        size="lg"
                        className="px-10 py-6 text-base font-semibold"
                        onClick={handleConfirmBooking}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
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
                <Button variant="ghost" onClick={prev} disabled={step === 0 || isSubmitting} className="gap-2">
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
