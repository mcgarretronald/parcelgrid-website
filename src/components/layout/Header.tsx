import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  CircleHelp,
  Handshake,
  Menu,
  Truck,
  Wallet,
  X,
} from "lucide-react";

type ServiceLink = { name: string; href: string; description: string; icon: typeof Truck };
type NavLink = { name: string; href: string; children?: ServiceLink[] };

const services: ServiceLink[] = [
  {
    name: "Upcountry Delivery",
    href: "/services/upcountry-parcel-delivery",
    description: "Next-day parcels from Nairobi to 132 towns",
    icon: Truck,
  },
  {
    name: "Pay on Delivery (COD)",
    href: "/services/pay-on-delivery-courier-kenya",
    description: "Buyers pay by M-Pesa, you get paid instantly",
    icon: Wallet,
  },
  {
    name: "How to use the ParcelGrid app",
    href: "/how-to-use-app",
    description: "Book, track, and manage parcels step by step",
    icon: BookOpen,
  },
  {
    name: "FAQ",
    href: "/faq",
    description: "Answers on pricing, COD, prepaid, and tracking",
    icon: CircleHelp,
  },
  {
    name: "Agent Opportunities",
    href: "/opportunities",
    description: "Become a pickup or booking agent",
    icon: Handshake,
  },
  {
    name: "Careers",
    href: "/careers",
    description: "Join the ParcelGrid team",
    icon: Briefcase,
  },
];

const links: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services", children: services },
  { name: "Stations", href: "/pickup-points" },
  { name: "Pricing", href: "/pricing" },
  { name: "Track Parcel", href: "/track" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const LEFT_NAMES = ["Home", "Services", "Stations", "Pricing"];
const LEFT_LINKS = links.filter((l) => LEFT_NAMES.includes(l.name));
const RIGHT_LINKS = links.filter((l) => !LEFT_NAMES.includes(l.name));

const supportLinks = [
  { name: "FAQ", href: "/faq" },
  { name: "How to use the app", href: "/how-to-use-app" },
];

function isCurrent(pathname: string, href: string, children?: ServiceLink[]) {
  if (href === "/") return pathname === "/";
  if (children?.length) {
    return children.some(
      (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const Header = ({ transparent = false }: { transparent?: boolean }) => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const renderDesktopItem = (item: NavLink) => {
          const current = isCurrent(pathname, item.href, item.children);
          if (item.children) {
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setServicesOpen(false);
                }}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((open) => !open)}
                  className={`relative inline-flex items-center gap-1 py-1 text-sm font-medium transition-colors ${
                    current || servicesOpen ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {item.name}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} aria-hidden />
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 ${
                      current ? "w-full" : "w-0"
                    }`}
                  />
                </button>
                {servicesOpen && (
                  <div className="absolute -left-4 top-full z-10 w-[24rem] pt-4">
                    <div className="absolute left-10 top-2.5 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/15 bg-[#0b1d18]" aria-hidden />
                    <ul
                      role="menu"
                      className="relative max-h-[min(28rem,70vh)] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/15 bg-[#0b1d18] p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]"
                    >
                      {item.children.map((child) => {
                        const Icon = child.icon;
                        const active = pathname === child.href;
                        return (
                          <li key={child.href} role="none">
                            <Link
                              role="menuitem"
                              to={child.href}
                              onClick={() => setServicesOpen(false)}
                              className={`group flex items-center gap-3.5 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline-none ${
                                active ? "bg-white/[0.06]" : ""
                              }`}
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9FF15] text-[#00473E]">
                                <Icon className="h-5 w-5" aria-hidden />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-white group-hover:text-[#E9FF15]">
                                  {child.name}
                                </span>
                                <span className="mt-0.5 block text-xs leading-snug text-white/60">
                                  {child.description}
                                </span>
                              </span>
                              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-[#E9FF15]" aria-hidden />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={current ? "page" : undefined}
              className={`relative py-1 text-sm font-medium transition-colors ${
                current ? "text-white" : "text-white/65 hover:text-white"
              }`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 ${
                  current ? "w-full" : "w-0"
                }`}
              />
            </Link>
          );
  };

  const solid = !transparent || scrolled || menuOpen;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <div
        className={`pointer-events-auto mx-auto max-w-6xl transition-all duration-300 ${
          solid ? "pt-2 sm:pt-3" : "pt-4 sm:pt-5"
        }`}
      >
        <div
          className={`grid h-14 grid-cols-[2.75rem_1fr_2.75rem] items-center rounded-full border px-2 transition-all duration-300 sm:h-16 sm:px-3 lg:grid-cols-[1fr_auto_1fr] lg:px-5 ${
            solid
              ? "border-white/10 bg-[#071410]/92 shadow-none backdrop-blur-xl"
              : "border-white/10 bg-[#071410]/80 shadow-none backdrop-blur-xl"
          }`}
        >
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
            {LEFT_LINKS.map((item) => renderDesktopItem(item))}
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            to="/"
            className="flex min-h-11 items-center justify-center gap-2.5 sm:gap-3"
            aria-label="ParcelGrid home"
          >
            <img
              decoding="async"
              src="/brand/parcelgrid-mark.png"
              alt=""
              width="40"
              height="48"
              className="h-9 w-auto object-contain sm:h-10"
            />
            <span className="font-[Sora] text-lg font-semibold tracking-[0.02em] text-[#E9FF15] sm:text-xl lg:text-[1.35rem]">
              ParcelGrid
            </span>
          </Link>

          <div className="flex items-center justify-end gap-5 xl:gap-7">
            <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Secondary">
              {RIGHT_LINKS.map((item) => renderDesktopItem(item))}
            </nav>
            <Link
              to="/book-parcel"
              className="hidden h-11 shrink-0 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#041612] transition-colors hover:bg-[#E9FF15] lg:inline-flex xl:px-5"
            >
              Book a parcel
            </Link>
          </div>
        </div>

        {menuOpen && (
        <div id="mobile-nav" className="pointer-events-auto mt-2 lg:hidden">
          <nav
            aria-label="Mobile"
            className="rounded-3xl border border-white/10 bg-[#071410]/95 p-3 shadow-none backdrop-blur-xl"
          >
            <ul className="flex flex-col">
              {links.map((item) => {
                const current = isCurrent(pathname, item.href);
                if (item.children) {
                  return (
                    <li key={item.href}>
                      <p className="flex min-h-12 items-center px-3 text-base font-medium text-white">{item.name}</p>
                      <ul className="mb-1 ml-3 border-l border-white/10">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              to={child.href}
                              className="flex min-h-11 items-center px-4 text-sm text-white/80 hover:text-[#E9FF15]"
                              onClick={() => setMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      aria-current={current ? "page" : undefined}
                      className="flex min-h-12 items-center justify-between px-3 text-base font-medium text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="relative">
                        {item.name}
                        <span
                          className={`absolute -bottom-1 left-0 h-px bg-white ${current ? "w-full" : "w-0"}`}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mx-3 my-2 h-px bg-white/10" />
            <ul className="flex flex-col">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex min-h-11 items-center px-3 text-sm text-white/70"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/book-parcel"
              className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#041612]"
              onClick={() => setMenuOpen(false)}
            >
              Book a parcel
            </Link>
          </nav>
        </div>
        )}
      </div>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="pointer-events-auto fixed inset-0 -z-10 bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
