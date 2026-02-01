import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/20 border-t border-border relative overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150  rounded-full bg-foreground/5 blur-3xl"
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
              Don't Just Roll the{" "}
              <span className="text-gradient-silver">Dice</span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Turn every roll into a winning move with OCX. Let's discuss how we
              can help you achieve your business goals.
            </p>

            <motion.a
              href="#form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 shadow-elevated hover:shadow-glow transition-all duration-300 group"
            >
              Send Us a Message
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
