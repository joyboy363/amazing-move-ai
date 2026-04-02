import { useState } from "react";
import { motion } from "framer-motion";
import { Home, MapPin, Calendar, Package, Warehouse, Armchair, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const moveTypes = ["Residential", "Commercial", "Storage Only"];
const homeSizes = ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms", "Office (Small)", "Office (Large)"];

const QuoteCalculator = () => {
  const [moveType, setMoveType] = useState("");
  const [homeSize, setHomeSize] = useState("");
  const [distance, setDistance] = useState([25]);
  const [packing, setPacking] = useState(false);
  const [storage, setStorage] = useState(false);
  const [specialItems, setSpecialItems] = useState(false);

  const getEstimate = () => {
    let base = 400;
    const sizeMultiplier: Record<string, number> = {
      "Studio": 1, "1 Bedroom": 1.5, "2 Bedrooms": 2, "3 Bedrooms": 2.8,
      "4+ Bedrooms": 3.5, "Office (Small)": 2.5, "Office (Large)": 4,
    };
    base *= sizeMultiplier[homeSize] || 1;
    base += distance[0] * 3;
    if (packing) base *= 1.3;
    if (storage) base += 200;
    if (specialItems) base += 150;
    if (moveType === "Commercial") base *= 1.2;
    const low = Math.round(base * 0.85);
    const high = Math.round(base * 1.15);
    return { low, high };
  };

  const estimate = getEstimate();
  const hasInputs = moveType && homeSize;

  return (
    <section id="quote" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Instant Estimate</span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Get Your Quote in Seconds
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Adjust the details below and see your estimated price range instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card rounded-2xl p-6 md:p-10"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Move Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Home className="w-4 h-4 text-primary" /> Move Type
              </label>
              <Select value={moveType} onValueChange={setMoveType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {moveTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Home Size */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Armchair className="w-4 h-4 text-primary" /> Home / Office Size
              </label>
              <Select value={homeSize} onValueChange={setHomeSize}>
                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  {homeSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Pickup */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <MapPin className="w-4 h-4 text-primary" /> Pickup Location
              </label>
              <Input placeholder="City or ZIP code" />
            </div>

            {/* Destination */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <MapPin className="w-4 h-4 text-primary" /> Destination
              </label>
              <Input placeholder="City or ZIP code" />
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Calendar className="w-4 h-4 text-primary" /> Moving Date
              </label>
              <Input type="date" />
            </div>
          </div>

          {/* Distance Slider */}
          <div className="mb-8">
            <label className="flex items-center justify-between text-sm font-semibold text-foreground mb-3">
              <span>Estimated Distance</span>
              <span className="text-primary">{distance[0]} miles</span>
            </label>
            <Slider value={distance} onValueChange={setDistance} max={500} step={5} className="w-full" />
          </div>

          {/* Toggles */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Package className="w-4 h-4 text-primary" /> Packing Service
              </span>
              <Switch checked={packing} onCheckedChange={setPacking} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Warehouse className="w-4 h-4 text-primary" /> Storage
              </span>
              <Switch checked={storage} onCheckedChange={setStorage} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Armchair className="w-4 h-4 text-primary" /> Special Items
              </span>
              <Switch checked={specialItems} onCheckedChange={setSpecialItems} />
            </div>
          </div>

          {/* Estimate Display */}
          <motion.div
            layout
            className="text-center p-6 rounded-xl gradient-primary"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-primary-foreground/80" />
              <span className="text-primary-foreground/80 text-sm font-medium">Estimated Price Range</span>
            </div>
            {hasInputs ? (
              <div className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">
                ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
              </div>
            ) : (
              <div className="text-primary-foreground/60 text-lg">Select move type & size to see estimate</div>
            )}
            <p className="text-primary-foreground/60 text-xs mt-2">Final price may vary based on actual inventory</p>
          </motion.div>

          <div className="mt-6 text-center">
            <Button size="lg" className="px-10 py-6 text-base font-semibold" asChild>
              <a href="#booking">Book This Move</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteCalculator;
