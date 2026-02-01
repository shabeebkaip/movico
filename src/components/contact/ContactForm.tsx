import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useAnimatedCountryCode } from "@/hooks/useAnimatedCountryCode";

const ContactForm = ({ formRef, formInView }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const currentCountryCode = useAnimatedCountryCode();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const endpoints = [
      "https://formspree.io/f/xkogdyrp",
      "https://formspree.io/f/xvzgelad",
    ];

    try {
      const responses = await Promise.all(
        endpoints.map((url) =>
          fetch(url, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          })
        )
      );

      // Log responses for debugging
      responses.forEach((res, idx) => {
        console.log(`Endpoint ${idx + 1} (${endpoints[idx]}):`, res.status, res.ok);
      });

      if (responses.every((res) => res.ok)) {
        setIsSubmitted(true);
        form.reset();
      } else {
        console.error("Some endpoints failed:", 
          responses.map((res, idx) => ({ endpoint: endpoints[idx], status: res.status, ok: res.ok }))
        );
        setIsError(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      ref={formRef}
      id="form"
      className="py-24 lg:py-32 bg-secondary/20 border-y border-border relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground mb-4">
              Send Us a <span className="text-gradient-silver">Message</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border shadow-elevated">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/10 mb-6">
                    <CheckCircle2 className="w-10 h-10 text-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-foreground text-background hover:bg-foreground/90"
                    size="lg"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  method="POST"
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-foreground font-medium flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        required
                        className="bg-secondary/30 border-border focus:border-foreground/30 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-foreground font-medium flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="company@example.com"
                        required
                        className="bg-secondary/30 border-border focus:border-foreground/30 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-foreground font-medium flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={currentCountryCode}
                        className="bg-secondary/30 border-border focus:border-foreground/30 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-foreground font-medium flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your Company"
                        className="bg-secondary/30 border-border focus:border-foreground/30 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-foreground font-medium flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      Your Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your project or inquiry..."
                      rows={5}
                      required
                      className="bg-secondary/30 border-border focus:border-foreground/30 resize-none"
                    />
                  </div>

                  {isError && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                      Something went wrong. Please try again or contact us
                      directly.
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 text-base font-semibold group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    By submitting this form, you agree to our privacy policy and
                    terms of service.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
