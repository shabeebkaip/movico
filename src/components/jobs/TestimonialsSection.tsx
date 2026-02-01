'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import Image from 'next/image';

interface TestimonialsSectionProps {
  testimonialsRef: React.RefObject<HTMLElement>;
  testimonialsInView: boolean;
}

const testimonials = [
  {
    name: "Mohd Narshil",
    role: "Accountant",
    company: "Doos Company, Jeddah, Saudi Arabia",
    quote:
      "I am incredibly grateful to have secured a role as an Accountant at Doos, Saudi Arabia. I would like to extend my heartfelt appreciation to Omar, whose exceptional support, guidance, and encouragement made this journey so smooth and successful. His dedication truly stood out, ensuring that I was well-prepared and confident throughout the process. This opportunity has been a significant step forward in my career… I highly recommend this platform and team to anyone seeking their dream job!",
    image: "https://www.omarconnect.com/public/img/Omar-Mahfooz-s.jpeg",
  },
  {
    name: "Adnan Lahji",
    role: "Payroll Specialist",
    company: "Unique Stone Company, Jeddah, Saudi Arabia",
    quote:
      "The job hunt group initiated by Mr. Omar Mahfooz was a great support system. I received helpful tips, guidance, and encouragement, which made my interview much easier and as well finding right job. I'm happy to say I found a job I was looking for. Thanks to this group!",
    image: "https://www.omarconnect.com/public/img/Adnan%20Lahji.jpeg",
  },
  {
    name: "Muhammad Naeem",
    role: "Financial Analyst",
    company: "Tanmiah Food Company, Riyadh, Saudi Arabia",
    quote:
      "I'm so thankful to Omar for his help during my job search. After connecting with him in the WhatsApp group 'Omar Connect', he kindly forwarded my resume to the right people, and thanks to his support, I landed the job! I really appreciate his willingness to assist and the opportunity he helped create for me. I truly couldn't have done it without his help!",
    image: "https://www.omarconnect.com/public/img/Muhammad%20Naeem.jpeg",
  },
  {
    name: "Mirza Abdullah Baig",
    role: "Project Coordinator",
    company: "Bureau Veritas, Jeddah, Saudi Arabia",
    quote:
      "I would like to express my sincere gratitude to Mr. Omar Mahfooz for creating and managing such an incredible jobs group… Thanks to the connections, opportunities, and insights shared within the group, I was able to land a position at a reputed MNC that aligns perfectly with my experience and career goals.",
    image: "https://www.omarconnect.com/public/img/Mirza%20Abdullah%20Baig.jpeg",
  },
  {
    name: "Naleef",
    role: "Accountant",
    company: "Atyab Al-Karam International Co., Jeddah, Saudi Arabia",
    quote:
      "Alhamdulillah I'm happy to share that I've officially joined Atyab Al-Karam International Co. as an Accountant — the 13th hire through your platform! Really appreciate your support in arranging the interview and giving priority while I was unemployed. JazakAllah Khair for everything — may Allah reward you and your family and bless you all with good health for all the good you're doing.",
    image: "https://www.omarconnect.com/public/img/Naleef.jpeg",
  },
];

export default function TestimonialsSection({ testimonialsRef, testimonialsInView }: TestimonialsSectionProps) {
  return (
    <section ref={testimonialsRef} className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground mb-4">
            Success <span className="text-gradient-silver">Stories</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real placements from professionals who found their opportunity
            through OCX Experts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all hover:shadow-elevated"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-foreground/10 border-2 border-foreground/20">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                <Building2 className="w-4 h-4" />
                {testimonial.company}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
