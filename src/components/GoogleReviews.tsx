import { useState } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const profiles = {
  "ronald-ngala": {
    label: "Ronald Ngala",
    place: "City Centre Mall, Shop LG12",
    href: "https://www.google.com/maps?cid=4912618892420080821",
  },
  "moi-avenue": {
    label: "Moi Avenue",
    place: "Iconic Business Plaza",
    href: "https://www.google.com/maps?cid=1510109829502390495",
  },
  "taveta-road": {
    label: "Taveta Road",
    place: "Jithada Shopping Complex",
    href: "https://www.google.com/maps?cid=15861410034057834355",
  },
} as const;

type BranchId = keyof typeof profiles;

const reviews: {
  name: string;
  branch: BranchId;
  quote: string;
  tags: string[];
  featured?: boolean;
}[] = [
  {
    name: "Brian Selleh",
    branch: "taveta-road",
    featured: true,
    tags: ["Pay on Delivery (COD)"],
    quote:
      "Parcel grid is the best it has helped has serve our customer who don't trust our products by delivering them and pay after delivery. I give my flowers to percel grid may it be a long term service",
  },
  {
    name: "Geoffrey Karanja",
    branch: "taveta-road",
    tags: ["Customer service"],
    quote:
      "Parcel grind thank you so much for good customer service I love the professionalism from the guy in Jitihada branch, thanks",
  },
  {
    name: "calvin morara",
    branch: "taveta-road",
    tags: ["On-time delivery"],
    quote: "Always impressed how you handle our percels with care and deliver on time. Am a happy client",
  },
  {
    name: "Emmanuel Asilla",
    branch: "moi-avenue",
    featured: true,
    tags: ["Customer service"],
    quote:
      "Excellent service from the moi avenue team, and the process as a whole. Appreciate work done by Ronah",
  },
  {
    name: "Ian Kageche",
    branch: "moi-avenue",
    tags: ["Pay on Delivery (COD)"],
    quote:
      "THIS APP JUST MADE IT EASIER FOR BUSINESS PEOPLE WHO COME ACROSS CLIENT WHO WANT POD. ITS SAFE AND SECURE CONSIDERING BOTH THE CLIENT AND THE SELLER. WOULD HIGHLY RECOMMEND",
  },
  {
    name: "Judy Wamaitha",
    branch: "moi-avenue",
    tags: ["Upcountry delivery"],
    quote:
      "You have made it easy to reach our upcountry, out of Nairobi customers so easy with your seamless services.",
  },
  {
    name: "Kelvin Murithi",
    branch: "ronald-ngala",
    featured: true,
    tags: ["Outside Nairobi"],
    quote:
      "Nice service, to every trader and business owner this is the best service to help reach the big market outside Nairobi",
  },
  {
    name: "Brandon Mageto",
    branch: "ronald-ngala",
    tags: ["Customer service"],
    quote:
      "The customer service was top notch and parcel fee is so economy friendly. Parcel grid remains to be my favorite courier all day all time",
  },
  {
    name: "UNLEASHED BY JOSEPHINE",
    branch: "ronald-ngala",
    tags: ["Pay on Delivery (COD)"],
    quote: "The only place I trust with my pay on delivery. Quick as snappy.",
  },
];

const filters = [
  { id: "all", label: "All branches" },
  { id: "ronald-ngala", label: "Ronald Ngala" },
  { id: "moi-avenue", label: "Moi Avenue" },
  { id: "taveta-road", label: "Taveta Road" },
] as const;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function Stars() {
  return (
    <p className="flex gap-0.5 text-[#F4B400]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>★</span>
      ))}
    </p>
  );
}

export function GoogleReviews() {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");
  const { ref, className } = useRevealOnScroll();
  const visible =
    active === "all"
      ? reviews.filter((review) => review.featured)
      : reviews.filter((review) => review.branch === active);

  return (
    <section
      ref={ref}
      className={`reveal bg-[#f6f7f4] py-14 sm:py-20 ${className}`}
      aria-labelledby="google-reviews-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal-up mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#00473E]">REAL SELLER FEEDBACK</p>
          <h2 id="google-reviews-heading" className="mt-3 text-3xl font-bold tracking-tight text-[#071410] sm:text-4xl">
            Trusted by online sellers across Kenya
          </h2>
          <div className="mt-5 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[#3d4a47]">
            <GoogleMark />
            <span className="font-semibold text-[#071410]">4.8 on Google &amp; Play Store</span>
            <span>across our 3 Nairobi CBD branches</span>
          </div>
        </div>

        <div className="reveal-up reveal-delay-1 mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter reviews by branch">
          {filters.map((filter) => {
            const selected = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(filter.id)}
                className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selected ? "bg-[#00473E] text-white" : "bg-white text-[#3d4a47] hover:text-[#071410]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <ul className="reveal-stagger mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((review) => {
            const branch = profiles[review.branch];
            return (
              <li
                key={`${review.branch}-${review.name}`}
                className="flex min-h-[280px] flex-col rounded-2xl border border-black/[0.06] bg-white p-6 text-left shadow-[0_1px_2px_rgba(7,20,16,0.04)]"
              >
                <Stars />
                <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-[#3d4a47]">
                  “{review.quote}”
                </blockquote>
                {review.tags[0] ? (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#00473E]">
                    {review.tags[0]}
                  </p>
                ) : null}
                <footer className="mt-5 flex items-center gap-3 border-t border-black/[0.06] pt-5">
                  <img decoding="async" loading="lazy"
                    src={`https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${encodeURIComponent(review.name)}`}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full bg-[#f4f5f2]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#071410]">{review.name}</p>
                    <p className="mt-0.5 text-xs text-[#5d6b68]">
                      {branch.label} · {branch.place}
                    </p>
                  </div>
                </footer>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
          {(Object.keys(profiles) as BranchId[]).map((id) => (
            <a
              key={id}
              href={profiles[id].href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center font-semibold text-[#00473E] underline-offset-4 hover:underline"
            >
              {profiles[id].label} reviews on Google
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
