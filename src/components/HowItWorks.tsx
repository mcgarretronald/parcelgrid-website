import { useState } from "react";
import { BadgeCheck, Package, Smartphone, Truck } from "lucide-react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const steps = [
  {
    title: "Book Your Parcel",
    body: "Create your order on the ParcelGrid app or website. Select Prepaid if the customer already paid, or enter the Cash on Delivery (COD) amount to collect at pickup.",
    icon: Smartphone,
  },
  {
    title: "Drop Off Your Package",
    body: "Hand over your parcel at our Nairobi CBD branches (Ronald Ngala, Moi Avenue, Taveta Road) or any active send-station across Kenya. We tag and secure it instantly.",
    icon: Package,
  },
  {
    title: "Next-Day Transit",
    body: "Parcels dispatch daily along major transit routes to 300+ towns. Both you and your customer get real-time SMS and tracking updates at every checkpoint.",
    icon: Truck,
  },
  {
    title: "Pickup & Instant Settlement",
    body: "Customer collects at their local pickup point. For COD parcels, they pay via M-Pesa on the spot, and the funds reflect instantly in your seller wallet.",
    icon: BadgeCheck,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(1);
  const { ref, className } = useRevealOnScroll();

  return (
    <section
      ref={ref}
      className={`reveal bg-white py-16 sm:py-24 ${className}`}
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="reveal-up mx-auto max-w-3xl text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.22em] text-[#00473E]">
            <span className="block h-px w-8 bg-[#00473E]" />
            HOW IT WORKS
            <span className="block h-px w-8 bg-[#00473E]" />
          </p>
          <h2
            id="how-it-works-heading"
            className="font-[Sora] text-4xl font-semibold tracking-[-0.04em] text-[#111] sm:text-5xl"
          >
            How to Send with ParcelGrid
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#5c6562] sm:text-lg">
            Whether your parcel is already paid for or Pay on Delivery (COD), shipping upcountry takes just four simple steps:
          </p>
        </header>

        <ol
          className="how-steps reveal-stagger relative mt-14 grid gap-10 sm:mt-16 lg:grid-cols-4 lg:gap-6"
          onMouseLeave={() => setActive(1)}
        >
          <span className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px -translate-y-1/2 bg-[#00473E]/15 lg:block" aria-hidden="true" />
          <span
            className="absolute left-[12.5%] top-8 hidden h-0.5 w-3/4 origin-left bg-[#00473E] transition-transform duration-300 ease-out lg:block"
            style={{ transform: `translateY(-50%) scaleX(${active / 3})` }}
            aria-hidden="true"
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isReached = index <= active;
            const isCurrent = index === active;
            return (
              <li
                key={step.title}
                className={`how-step relative text-center${isReached ? " is-active" : ""}${isCurrent ? " is-current" : ""}`}
                onMouseEnter={() => setActive(index)}
              >
                <div className="how-step-mark relative mx-auto mb-5 h-16 w-16">
                  <span className="how-step-icon flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00473E]/30 bg-white text-[#00473E]">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#00473E] text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-[Sora] text-sm font-semibold tracking-[0.04em] text-[#111] uppercase">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5c6562]">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
