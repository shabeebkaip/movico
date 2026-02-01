'use client';

import { motion } from 'framer-motion';
import { UserPlus, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-linear-to-b from-secondary/20 to-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground mb-6">
            Ready to Make Your{" "}
            <span className="text-gradient-silver">Next Move</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join 970+ professionals who've found their opportunity through
            trusted referrals and verified connections
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://www.omarconnect.com/sign-up"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 h-14 group"
              >
                <UserPlus className="mr-2 w-5 h-5" />
                Sign Up Now
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link
              href="https://www.omarconnect.com/job-create"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-foreground/20 hover:border-foreground/40 text-lg px-8 h-14 group"
              >
                <Building2 className="mr-2 w-5 h-5" />
                Post a Job
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Questions? Contact us via{" "}
            <a
              href="https://wa.me/966532264851?text=Hi%2C%20I%20have%20a%20question%20about%20OCX%20Experts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-medium inline-flex items-center gap-1"
            >
              WhatsApp
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
