import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

const MissionVision = ({ missionVisionRef, missionVisionInView }) => {
  return (
    <section
      ref={missionVisionRef}
      className="py-24 lg:py-32 bg-secondary/20 border-y border-border/50 relative overflow-hidden"
    >
      {/* Animated orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-foreground/5 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-foreground/5 blur-3xl"
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={missionVisionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="group"
            >
              <div className="relative p-8 lg:p-10 rounded-2xl bg-card border border-border shadow-elevated hover:shadow-glow transition-all duration-700 h-full">
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center font-display text-2xl font-bold">
                  01
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    <Target className="w-7 h-7 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Our Mission
                    </h2>
                    <div className="h-1 w-12 bg-linear-to-r from-foreground to-transparent" />
                  </div>
                </div>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  To empower businesses with smart, strategic solutions that
                  drive measurable growth while ensuring compliance and
                  operational excellence. We're committed to being the trusted
                  partner that organizations rely on for integrated expertise
                  and results-driven execution.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={missionVisionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group"
            >
              <div className="relative p-8 lg:p-10 rounded-2xl bg-card border border-border shadow-elevated hover:shadow-glow transition-all duration-700 h-full">
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center font-display text-2xl font-bold">
                  02
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    <Eye className="w-7 h-7 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      Our Vision
                    </h2>
                    <div className="h-1 w-12 bg-linear-to-r from-foreground to-transparent" />
                  </div>
                </div>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  To be the leading multi-domain consultancy in the GCC region,
                  recognized for delivering seamless, innovative solutions that
                  transform businesses and create lasting impact.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
