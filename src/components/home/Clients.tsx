"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClientLogo } from "./ClientLogo";

gsap.registerPlugin(ScrollTrigger);

interface ClientItem { src: string; alt: string; whiteBg?: boolean }

const FALLBACK_CLIENTS: ClientItem[] = [
  { src: "/clients/Nokia 1.svg",                              alt: "Nokia"           },
  { src: "/clients/Aramco.png",                               alt: "Saudi Aramco"    },
  { src: "/clients/Philips_logo.png",                         alt: "Philips",          whiteBg: true },
  { src: "/clients/Alfanar Projects_Logo-1.png",              alt: "Alfanar"         },
  { src: "/clients/FORD .png",                                alt: "Ford"            },
  { src: "/clients/Leap.jpg",                                 alt: "Leap",             whiteBg: true },
  { src: "/clients/GACA LOGO 1.png",                          alt: "GACA"            },
  { src: "/clients/UAPM-Logo(Property Management Co).png",    alt: "UAPM"            },
  { src: "/clients/SEA-Expo-logo-Master-03.png",              alt: "SEA Expo",         whiteBg: true },
  { src: "/clients/Huawei.png",                               alt: "Huawei"          },
  { src: "/clients/Neom-Logo.png",                            alt: "Neom"            },
  { src: "/clients/Red_Hat_Logo_2019.svg.png",                alt: "Red Hat",          whiteBg: true },
  { src: "/clients/SEC_Logo.png",                             alt: "SEC"             },
  { src: "/clients/Rawabi_2023_Logo_uniform_11.png",          alt: "Rawabi"          },
  { src: "/clients/AFZCO-LOGO-2020-FINAL.png",                alt: "AFZCO"           },
  { src: "/clients/ALJAZIRAH LOGO PNG.png",                   alt: "Al Jazirah"      },
  { src: "/clients/10X Logo 2.png",                           alt: "10X"             },
  { src: "/clients/Autoville.png",                            alt: "Autoville"       },
  { src: "/clients/Defence show.png",                         alt: "Defence Show"    },
  { src: "/clients/Dezerta Logo.png",                         alt: "Dezerta"         },
  { src: "/clients/FHM 1.png",                                alt: "FHM"             },
  { src: "/clients/Mansam logo-bilingual Final.png",          alt: "Mansam"          },
  { src: "/clients/Mega-Group.png",                           alt: "Mega Group"      },
  { src: "/clients/Modn-ANnan.png",                           alt: "Modn Annan"      },
  { src: "/clients/Nahdah FC.png",                            alt: "Nahdah FC"       },
  { src: "/clients/Nationl Grid .SA .png",                    alt: "National Grid SA"},
  { src: "/clients/PDC.png",                                  alt: "PDC"             },
  { src: "/clients/POLARIS.png",                              alt: "Polaris"         },
  { src: "/clients/ShareLogo.jpg",                            alt: "Aramco Iktva",     whiteBg: true },
  { src: "/clients/UNIFIED-LOGO.png",                         alt: "Unified"         },
  { src: "/clients/all jerry logo 02.png",                    alt: "All Jerry"       },
  { src: "/clients/bh_logo_black_onwhite.png",                alt: "BH",               whiteBg: true },
  { src: "/clients/state_grid.png",                           alt: "State Grid"      },
  { src: "/clients/glamping_80cm_80cm.png",                   alt: "Glamping"        },
  { src: "/clients/one mic.png",                              alt: "One Mic"         },
  { src: "/clients/riyadh dimond.png",                        alt: "Riyadh Diamond"  },
  { src: "/clients/7d logo .png",                             alt: "7D"              },
  { src: "/clients/APOTHEEK.png",                             alt: "Apotheek"        },
  { src: "/clients/Almosa H.jpg",                             alt: "Almosa",           whiteBg: true },
];

function MarqueeRow({
  items,
  reverse = false,
  duration = 40,
}: {
  items: ClientItem[];
  reverse?: boolean;
  duration?: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden relative group/row">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-linear-to-r from-neutral-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-linear-to-l from-neutral-50 to-transparent" />

      <div
        className="flex gap-3 w-max group-hover/row:[animation-play-state:paused]"
        style={{
          animation: `marquee${reverse ? "Reverse" : ""} ${duration}s linear infinite`,
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {doubled.map((client, i) => (
          <div
            key={i}
            className="group flex items-center justify-center bg-white hover:bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-md rounded-xl px-8 py-6 transition-shadow duration-300 cursor-default shrink-0 w-52 h-24"
          >
            <ClientLogo
              src={client.src}
              alt={client.alt}
              className="h-14 w-auto max-w-36 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const ClientsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<ClientItem[]>(FALLBACK_CLIENTS);

  useEffect(() => {
    fetch("/api/cms/clients")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Array<{ logo: string; name: string; whiteBg?: boolean }> | null) => {
        if (data && data.length > 0) {
          setClients(data.map((c) => ({ src: c.logo, alt: c.name, whiteBg: c.whiteBg })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marqueeReverse {
          from { transform: translate3d(-50%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
      `}</style>

      <section ref={sectionRef} className="bg-neutral-50 py-20 xl:py-32 overflow-hidden">
        {/* Header */}
        <div ref={headerRef} className="mb-16 px-6 md:px-12 xl:px-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="uppercase tracking-[0.5em] text-[10px] text-black/30 block mb-4">
              Trusted By
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl xl:text-6xl uppercase text-black leading-none">
              Brands That<br />
              <span className="text-primary">Trust Us</span>
            </h2>
          </div>
          <p className="text-black/40 text-sm max-w-xs leading-relaxed md:text-right">
            From global giants to regional leaders — our clients are the brands shaping industries.
          </p>
        </div>

        {/* Marquee rows */}
        <div className="flex flex-col gap-4">
          <MarqueeRow items={clients.slice(0, Math.ceil(clients.length / 3))} duration={80} />
          <MarqueeRow items={clients.slice(Math.ceil(clients.length / 3), Math.ceil(clients.length * 2 / 3))} reverse duration={90} />
          <MarqueeRow items={clients.slice(Math.ceil(clients.length * 2 / 3))} duration={70} />
        </div>
      </section>
    </>
  );
};

export default ClientsSection;
