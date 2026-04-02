import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-moving.jpg";

const trustBadges = [
  { icon: Shield, label: "Licensed & Insured" },
  { icon: Clock, label: "On-Time Guarantee" },
  { icon: Star, label: "4.9★ Rating" },
  { icon: CheckCircle, label: "5,000+ Moves" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Professional movers loading a truck" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 gradient-primary opacity-60" />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              Trusted by 5,000+ Happy Customers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6"
          >
            Stress-Free Moving
            <br />
            <span className="text-primary-foreground/80">Starts Here</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-xl leading-relaxed"
          >
            Amazing Moving delivers reliable residential, commercial, local, and long-distance
            moving services. Professional movers, transparent pricing, zero stress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Button size="lg" className="text-base px-8 py-6 font-semibold" asChild>
              <a href="#quote">
                Get a Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <a href="#booking">Book Now</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground/90 text-sm"
              >
                <badge.icon className="w-4 h-4" />
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
