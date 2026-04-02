import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = { role: "user" | "assistant"; content: string };

const quickActions = [
  { label: "Get Moving Quote", prompt: "I'd like to get a moving quote" },
  { label: "Check Availability", prompt: "What dates are available this month?" },
  { label: "Packing Help", prompt: "Do you offer packing services?" },
  { label: "Speak to a Human", prompt: "I'd like to speak with someone" },
];

const botResponses: Record<string, string> = {
  "quote": "I'd be happy to help with a quote! 📦\n\nTo give you an accurate estimate, I need a few details:\n\n1. **Where are you moving from and to?**\n2. **How many bedrooms?**\n3. **When do you want to move?**\n\nOr you can use our [instant quote calculator](#quote) for an immediate estimate!",
  "availability": "Great question! We typically have availability within **3-5 business days**. 📅\n\nFor peak season (May-September), we recommend booking **2-3 weeks ahead**.\n\nWould you like me to check a specific date for you?",
  "packing": "Absolutely! We offer full **packing and unpacking services**. 📦\n\nThis includes:\n- Professional-grade packing materials\n- Careful wrapping of fragile items\n- Labeling and inventory\n- Unpacking at your new location\n\nPacking services typically add about 30% to your move cost. Want a detailed quote?",
  "human": "Of course! You can reach our team through:\n\n📞 **Phone:** (800) 123-4567\n📧 **Email:** hello@amazingmoving.com\n💬 **WhatsApp:** +1 (800) 123-4567\n\nOur office hours are Mon-Sat, 7AM-8PM. Someone will respond within minutes!",
  "default": "Thanks for reaching out! I'm here to help with anything related to your move. 🚚\n\nI can help you with:\n- **Getting a quote** for your move\n- **Checking availability** for your preferred date\n- **Explaining our services** (packing, storage, etc.)\n- **Connecting you** with our team\n\nWhat would you like to know?",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("quote") || lower.includes("price") || lower.includes("cost") || lower.includes("estimate")) return botResponses.quote;
  if (lower.includes("available") || lower.includes("date") || lower.includes("when") || lower.includes("schedule")) return botResponses.availability;
  if (lower.includes("pack") || lower.includes("box") || lower.includes("wrap")) return botResponses.packing;
  if (lower.includes("human") || lower.includes("person") || lower.includes("speak") || lower.includes("call") || lower.includes("phone")) return botResponses.human;
  return botResponses.default;
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! 👋 I'm the Amazing Moving assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setTyping(false);
    }, 1000 + Math.random() * 800);
  };

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-[var(--shadow-glow)] flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-[var(--shadow-elevated)] flex flex-col overflow-hidden"
            style={{ maxHeight: "min(600px, calc(100vh - 8rem))" }}
          >
            {/* Header */}
            <div className="gradient-primary p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-heading font-bold text-primary-foreground text-sm">AI Moving Assistant</p>
                  <p className="text-primary-foreground/60 text-xs">Online • Instant replies</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.content.split("\n").map((line, li) => (
                      <span key={li}>
                        {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                        {li < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" style={{ animationDelay: "200ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" style={{ animationDelay: "400ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => send(action.prompt)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-medium"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50 flex gap-2 shrink-0">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send(input)}
                className="text-sm"
              />
              <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || typing}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
