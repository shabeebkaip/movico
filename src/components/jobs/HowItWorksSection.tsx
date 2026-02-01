'use client';

import { motion } from 'framer-motion';
import { Building2, Users, ArrowRight, FileText, MessageCircle, CheckCircle2, UserCheck, UserPlus, Search, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HowItWorksSectionProps {
  flowsRef: React.RefObject<HTMLElement>;
  flowsInView: boolean;
}

const employerSteps = [
  {
    icon: FileText,
    title: "Post Your Job",
    description:
      "Submit job requirements through our streamlined form with detailed role specifications.",
  },
  {
    icon: MessageCircle,
    title: "Job Discussion",
    description:
      "Our team verifies the opportunity and discusses role details to ensure authenticity.",
  },
  {
    icon: CheckCircle2,
    title: "Approval & Publishing",
    description:
      "Once verified, your job goes live to our network of qualified professionals.",
  },
  {
    icon: UserCheck,
    title: "Curated Candidates",
    description:
      "Receive pre-screened CVs from trusted referrals matching your requirements.",
  },
];

const jobSeekerSteps = [
  {
    icon: UserPlus,
    title: "Register & Upload CV",
    description:
      "Create your profile and share your professional background with our network.",
  },
  {
    icon: MessageCircle,
    title: "Career Discussion",
    description:
      "Connect with our team to discuss your career goals and aspirations.",
  },
  {
    icon: Search,
    title: "Profile Review",
    description:
      "We match your skills and experience with relevant opportunities in our network.",
  },
  {
    icon: Target,
    title: "Trusted Referrals",
    description:
      "Get introduced to employers through verified referrals, increasing placement success.",
  },
];

export default function HowItWorksSection({ flowsRef, flowsInView }: HowItWorksSectionProps) {
  return (
    <section ref={flowsRef} className="py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={flowsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground mb-4">
            How <span className="text-gradient-silver">It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Two streamlined pathways designed for employers and job seekers
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* For Employers */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={flowsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-foreground/10 border border-foreground/20">
                <Building2 className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                For Employers
              </h3>
            </div>

            <div className="space-y-6">
              {employerSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all group"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                      <step.icon className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        STEP {index + 1}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-2">
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="https://www.omarconnect.com/job-create"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full bg-foreground text-background hover:bg-foreground/90 group"
                >
                  Post a Job Opening
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* For Job Seekers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={flowsInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-foreground/10 border border-foreground/20">
                <Users className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                For Job Seekers
              </h3>
            </div>

            <div className="space-y-6">
              {jobSeekerSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all group"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                      <step.icon className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        STEP {index + 1}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-2">
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="https://www.omarconnect.com/sign-up"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full bg-foreground text-background hover:bg-foreground/90 group"
                >
                  Register & Find Jobs
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
