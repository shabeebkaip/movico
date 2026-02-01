import { motion } from "framer-motion";

const ContactInformation = ({ infoRef, infoInView, contactInfo }) => {
  return (
    <section
      ref={infoRef}
      className="py-24 lg:py-32 bg-secondary/20 border-y border-border relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={infoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 shadow-elevated hover:shadow-glow transition-all duration-500 h-full">
                    <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-4">
                      {info.title}
                    </h3>
                    <div className="space-y-3">
                      {info.details.map((detail, idx) => (
                        <div key={idx}>
                          {detail.label && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {detail.label}
                            </p>
                          )}
                          {detail.href ? (
                            <a
                              href={detail.href}
                              className="text-sm text-foreground hover:text-foreground/80 transition-colors"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <p className="text-sm text-foreground">
                              {detail.value}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInformation;
