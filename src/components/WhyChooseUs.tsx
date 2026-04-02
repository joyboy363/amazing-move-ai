import { motion } from "framer-motion";
import { Shield, DollarSign, Users, Headphones, Clock, PackageCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const highlights = [
  { icon: Shield, title: "Licensed & Insured", desc: "Full coverage for complete peace of mind on every move." },
  { icon: DollarSign, title: "Transparent Pricing", desc: "No hidden fees. Get an honest quote before we start." },
  { icon: Users, title: "Trained Professionals", desc: "Background-checked, experienced movers who care." },
  { icon: Headphones, title: "Real-Time Support", desc: "24/7 live support throughout your entire move." },
  { icon: Clock, title: "On-Time Arrival", desc: "We guarantee punctual service, every single time." },
  { icon: PackageCheck, title: "Safe Handling", desc: "Specialized handling for fragile and valuable items." },
];

const stats = [
  { value: 5000, suffix: "+", label: "Moves Completed" },
  { value: 99, suffix: "%", label: "On-Time Rate" },
  { value: 4.9, suffix: "★", label: "Customer Rating", decimals: 1 },
  { value: 15, suffix: "+", label: "Years Experience" },
];

function AnimatedCounter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading font-extrabold text-4xl md:text-5xl text-primary">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
        {suffix}
      </div>
    </div>
  );
}

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Moving Made Right
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine years of expertise with modern technology to deliver the best moving experience.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              <p className="text-muted-foreground text-sm mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover rounded-xl p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
