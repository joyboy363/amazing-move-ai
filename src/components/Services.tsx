import { motion } from "framer-motion";
import { Truck, MapPin, Home, Building2, Package, Warehouse, Wrench } from "lucide-react";

const services = [
  { icon: MapPin, title: "Local Moving", desc: "Quick, efficient same-city moves with careful handling of all your belongings." },
  { icon: Truck, title: "Long-Distance Moving", desc: "Reliable cross-state and nationwide moves with real-time tracking." },
  { icon: Home, title: "Residential Moving", desc: "Full-service home moving from packing to furniture placement." },
  { icon: Building2, title: "Commercial Relocation", desc: "Minimize downtime with our expert office and business moves." },
  { icon: Package, title: "Packing & Unpacking", desc: "Professional packing services to protect every item safely." },
  { icon: Warehouse, title: "Storage Solutions", desc: "Secure, climate-controlled storage for short or long term." },
  { icon: Wrench, title: "Furniture Assembly", desc: "Disassembly & reassembly of all furniture types included." },
];

const Services = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block rounded-xl px-8 py-6 bg-black/40 backdrop-blur-md border border-white/10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mt-3 mb-4">
              Everything You Need for a Perfect Move
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From local moves to cross-country relocations, we handle every detail with precision and care.
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-6 group cursor-pointer bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
