import { Link } from "react-router-dom";
import { Calculator, Shield, Truck } from "lucide-react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const cards = [
  {
    number: "01",
    title: "Next-Day Upcountry Courier",
    body: "Daily courier dispatches to 132 towns outside Nairobi. Optimized transit routes so your customer collects their package promptly without delays.",
    href: "/services/upcountry-parcel-delivery",
    icon: Truck,
  },
  {
    number: "02",
    title: "Secure Pay on Delivery",
    body: "Protect your goods and win customer trust. We collect the exact order amount via M-Pesa upon parcel collection and credit your wallet instantly.",
    href: "/services/pay-on-delivery-courier-kenya",
    icon: Shield,
  },
  {
    number: "03",
    title: "Transparent Courier Prices",
    body: "Skip “how much to Nakuru?” WhatsApp spam. Check live rates by drop-off, pickup town, weight or special item — then book with confidence.",
    href: "/pricing",
    icon: Calculator,
  },
];

export function ServiceHighlights() {
  const { ref, className } = useRevealOnScroll();

  return (
    <section
      ref={ref}
      className={`reveal section-blend-top bg-white py-8 sm:py-14 ${className}`}
      aria-label="Courier services for sellers in Kenya"
    >
      <ul className="reveal-stagger mx-auto grid max-w-7xl grid-cols-1 divide-y divide-black/[0.06] md:grid-cols-3 md:divide-x md:divide-y-0">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <li key={card.number}>
              <Link
                to={card.href}
                className="group relative flex h-full flex-col items-center border-b-[3px] border-transparent px-8 py-16 text-center transition-colors duration-200 hover:border-[#00473E] hover:bg-[#f7f8f6] sm:px-12 sm:py-24"
              >
                <span
                  className="pointer-events-none absolute right-8 top-8 text-7xl font-light leading-none text-[#00473E]/[0.08] sm:text-8xl"
                  aria-hidden="true"
                >
                  {card.number}
                </span>
                <span className="relative mb-8 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[#F3F1EA] text-[#00473E] transition-colors duration-200 group-hover:bg-[#00473E] group-hover:text-white">
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="relative text-lg font-semibold text-[#071410]">{card.title}</h3>
                <p className="relative mt-4 max-w-[16rem] text-sm leading-7 text-[#5d6b68]">{card.body}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
