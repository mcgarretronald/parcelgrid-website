import { Link } from "react-router-dom";
import { LazyGhostFibers } from "./LazyShader";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const branches = [
  { name: "Ronald Ngala", place: "City Centre Mall, Shop LG12" },
  { name: "Moi Avenue", place: "Iconic Business Plaza, Shop G13" },
  { name: "Taveta Road", place: "Jithada Shopping Complex, Shop F7" },
];

const columns: { title: string; links: { label: string; to?: string; href?: string }[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Upcountry Parcel Delivery", to: "/services/upcountry-parcel-delivery" },
      { label: "Pay on Delivery / COD", to: "/services/pay-on-delivery-courier-kenya" },
      { label: "Courier Prices & Calculator", to: "/pricing" },
      { label: "Station Send & Collect", to: "/pickup-points" },
      { label: "Track My Parcel", to: "/track" },
    ],
  },
  {
    title: "Company & Partners",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "Agent Opportunities", to: "/opportunities" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Support & Resources",
    links: [
      { label: "Frequently Asked Questions", to: "/faq" },
      { label: "How to Use the App", to: "/how-to-use-app" },
      { label: "Terms & Escrow Policy", href: "https://app.escrowcourier.com/static-services/resources/terms" },
      { label: "Privacy Policy", href: "https://app.escrowcourier.com/static-services/resources/privacy" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/p/ParcelGrid-61582861464189/" },
  { label: "Instagram", href: "https://www.instagram.com/parcelgrid/?hl=en" },
  { label: "TikTok", href: "https://www.tiktok.com/@parcelgrid" },
  { label: "WhatsApp", href: "https://wa.me/254745111555" },
];

export default function Footer() {
  const { ref, className } = useRevealOnScroll({ threshold: 0.1 });

  return (
    <footer ref={ref} className={`reveal relative overflow-hidden bg-[#071410] text-white ${className}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <LazyGhostFibers
          lineColor="#00473E"
          glowColor="#0f8f6b"
          speed={0.18}
          scale={2.1}
          rotation={0}
          rotationSpeed={0.18}
          layers={4}
          waveAmplitude={0.014}
          waveFrequency={3}
          waveSpeed={0.14}
          layerSpeed={0.07}
          twist={0.08}
          twistFrequency={5}
          twistSpeed={1}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={16}
          glowFalloff={10}
          glowIntensity={1.45}
          brightness={1.85}
          blueBoost={0.85}
          vignette={0.85}
          grain={0.04}
          dpr={1}
        />
        <div className="absolute inset-0 bg-[#071410]/45" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="reveal-up">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">
              <span aria-hidden="true">✦</span>
              Ship with ParcelGrid
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Ready to send a parcel upcountry or start offering Pay on Delivery?
            </h2>
          </div>

          <div className="flex flex-col gap-8 lg:items-end lg:text-right">
            <div>
              <p className="text-sm text-white/70">Call / WhatsApp Support:</p>
              <a
                href="https://wa.me/254745111555"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-1 text-lg font-semibold text-white transition-colors hover:text-[#E9FF15]"
              >
                0745 111 555 / 0794 333 888
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href="mailto:info@escrowcourier.com"
                className="inline-flex min-h-11 items-center text-sm text-white/75 transition-colors hover:text-[#E9FF15]"
              >
                info@escrowcourier.com
              </a>
            </div>
          </div>
        </div>

        <nav aria-label="Footer" className="reveal-stagger mt-14 grid gap-10 border-y border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-[#E9FF15]">{col.title}</p>
              <ul className="mt-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="inline-flex min-h-11 items-center text-sm text-white/80 transition-colors hover:text-[#E9FF15]">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center text-sm text-white/80 transition-colors hover:text-[#E9FF15]"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold text-[#E9FF15]">Nairobi CBD Drop-Off Branches</p>
            <ul className="mt-2 text-sm text-white/80">
              {branches.map((hub) => (
                <li key={hub.name} className="py-2">
                  <span className="font-medium text-white">{hub.name}:</span> {hub.place}
                </li>
              ))}
              <li className="pt-1">
                <a href="tel:+254745111555" className="inline-flex min-h-11 items-center transition-colors hover:text-[#E9FF15]">0745 111 555</a>
                {" / "}
                <a href="tel:+254794333888" className="inline-flex min-h-11 items-center transition-colors hover:text-[#E9FF15]">0794 333 888</a>
                <span className="block text-white/60">Phone / WhatsApp</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="reveal-up overflow-hidden py-10 sm:py-14 md:py-16">
          <p className="select-none text-center font-[Sora] text-[clamp(3.5rem,18vw,14rem)] font-bold leading-none tracking-[-0.06em] text-white/[0.12]">
            ParcelGrid
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 ParcelGrid by Escrow Courier Networks Ltd. Licensed by Communications Authority of Kenya (CA).
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-[#E9FF15]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
