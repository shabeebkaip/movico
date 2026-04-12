"use client";

import { motion } from "framer-motion";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const testimonials = [
  {
    text: "Movico delivered beyond our expectations. The execution was precise, cinematic, and perfectly aligned with our brand objectives.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Khalid Al-Rashid",
    role: "Marketing Director, NEOM",
  },
  {
    text: "From concept to final delivery, their production workflow was disciplined and seamless. Outstanding creative direction throughout.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sarah Al-Mutairi",
    role: "Event Director, World Defense Show",
  },
  {
    text: "The level of creative direction and technical control was unmatched. Movico is truly a world-class production studio.",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    name: "Ahmed Al-Zahrani",
    role: "Brand Manager, Ford Al Jazirah",
  },
  {
    text: "Incredible storytelling paired with flawless production quality. Our brand film exceeded every KPI we set.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Nora Al-Harbi",
    role: "Head of Communications, Alfanar",
  },
  {
    text: "They understood our vision from day one. The spatial design execution at our booth was truly immersive and drew massive crowds.",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    name: "Faris Al-Otaibi",
    role: "Events Manager, Leap Conference",
  },
  {
    text: "Professional, creative, and always on schedule. Movico handled our entire event coverage with cinematic precision.",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    name: "Lama Al-Subaie",
    role: "Creative Director, Nokia KSA",
  },
  {
    text: "Our social media content output transformed completely. Engagement tripled within the first month of the campaign launch.",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    name: "Omar Al-Ghamdi",
    role: "Digital Marketing Lead, Philips MEA",
  },
  {
    text: "The team brought a level of cinematic quality we had only seen in international productions. Truly world-class.",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    name: "Reem Al-Dossary",
    role: "Brand Lead, Aramco",
  },
  {
    text: "Working with Movico on our brand identity was transformative. They captured our essence and translated it beautifully.",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    name: "Turki Al-Shehri",
    role: "CEO, Elm Company",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-black text-white py-20 xl:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-11/12 xl:w-10/12 mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 xl:mb-16"
        >
          <span className="uppercase tracking-[0.5em] text-[10px] text-white/40 block mb-5">
            Client Stories
          </span>

          <h2 className="font-display text-5xl md:text-6xl xl:text-7xl uppercase leading-none mb-5">
            What Our{" "}
            <span className="text-primary">Clients</span>
            <br />
            Say
          </h2>

          <p className="text-white/45 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Trusted by Saudi Arabia&apos;s most ambitious brands — here&apos;s
            what they say about working with Movico.
          </p>
        </motion.div>

        {/* Scrolling columns — gradient mask fades top and bottom */}
        <div
          className="flex justify-center gap-5 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            maxHeight: "680px",
          }}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={22}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={16}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
