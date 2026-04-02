import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Sarah M.", location: "Austin, TX", stars: 5, text: "Amazing Moving made our cross-state move completely stress-free. The team was professional, on time, and handled everything with care. Highly recommend!", avatar: "SM" },
  { name: "James K.", location: "Denver, CO", stars: 5, text: "Best moving company I've ever used. Transparent pricing, no hidden fees, and they even helped assemble our furniture. Will use again!", avatar: "JK" },
  { name: "Lisa R.", location: "Phoenix, AZ", stars: 5, text: "From the free quote to the final box, Amazing Moving exceeded all expectations. Their AI chatbot helped me plan everything in minutes.", avatar: "LR" },
  { name: "Michael T.", location: "Seattle, WA", stars: 5, text: "Our office relocation was seamless. Zero downtime, everything labeled and placed exactly where we needed it. Incredible service!", avatar: "MT" },
  { name: "Emily C.", location: "Chicago, IL", stars: 5, text: "I was nervous about moving my piano and antiques, but the team handled them perfectly. Not a single scratch. Thank you!", avatar: "EC" },
  { name: "David P.", location: "Miami, FL", stars: 4, text: "Great communication throughout the entire process. The real-time tracking feature was a game changer for my long-distance move.", avatar: "DP" },
];

const Testimonials = () => {
  return (
    <section id="reviews" className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Loved by Thousands
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it — hear from our happy customers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover rounded-xl p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{review.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
