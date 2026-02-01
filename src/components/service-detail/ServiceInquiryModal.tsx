"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Mail, Phone, Building2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAnimatedCountryCode } from "@/hooks/useAnimatedCountryCode";

interface ServiceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}


export default function ServiceInquiryModal({
  isOpen,
  onClose,
  serviceName,
}: ServiceInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    requirements: "",
    service: serviceName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const currentCountryCode = useAnimatedCountryCode();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const endpoints = [
      "https://formspree.io/f/xwvpgyoy",
      "https://formspree.io/f/xrebnjqd",
    ];

    const body = JSON.stringify(formData);
    const headers = { "Content-Type": "application/json" };

    try {
      const responses = await Promise.all(
        endpoints.map((url) => fetch(url, { method: "POST", headers, body }))
      );

      if (responses.every((res) => res.ok)) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          requirements: "",
          service: serviceName,
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-lg lg:max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-linear-to-br from-primary/10 via-background to-background p-6 lg:p-8 border-b border-border flex-shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 lg:top-6 lg:right-6 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <X className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>

                <div className="mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-3 lg:mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                      Service Inquiry
                    </span>
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter text-foreground mb-2 lg:mb-3 pr-8">
                  Get Started with{" "}
                  <span className="text-gradient-silver">{serviceName}</span>
                </h2>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Fill out the form below and our team will get back to you soon!.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                {/* Form Fields - Scrollable */}
                <div className="p-6 lg:p-8 overflow-y-auto flex-1">
                  <div className="space-y-4 lg:space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-primary" />
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="h-11 lg:h-12"
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4 text-primary" />
                          Email <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@company.com"
                          className="h-11 lg:h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium text-foreground flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={currentCountryCode}
                          className="h-11 lg:h-12"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <label
                        htmlFor="company"
                        className="text-sm font-medium text-foreground flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-primary" />
                        Company Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company Ltd."
                        className="h-11 lg:h-12"
                      />
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <label
                        htmlFor="requirements"
                        className="text-sm font-medium text-foreground flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Your Requirements <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        required
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="Please describe your requirements and what you're looking to achieve..."
                        rows={4}
                        className="resize-none min-h-[100px]"
                      />
                    </div>

                    {/* Submit Status Messages */}
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 lg:p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm"
                      >
                        ✓ Thank you! Your inquiry has been submitted successfully. We'll be in
                        touch soon.
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 lg:p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm"
                      >
                        ✗ Something went wrong. Please try again or contact us directly.
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Sticky Footer with Buttons */}
                <div className="border-t border-border bg-card p-4 lg:p-6 flex-shrink-0">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-11 lg:h-12"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-11 lg:h-12 bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-pulse">Sending...</span>
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
