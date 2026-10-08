import { useRef, useState, type KeyboardEvent } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const hubs = [
  {
    id: "ronald-ngala",
    name: "Ronald Ngala",
    address: "City Centre Mall, Shop LG12, Basement",
    title: "ParcelGrid Courier Services, Ronald Ngala Street",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.813395161258!2d36.824911410792836!3d-1.2859883986963683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11c43c98b89d%3A0x442d20dabf9264b5!2sParcelGrid%20Courier%20Services-%20Ronald%20Ngala%20Street!5e0!3m2!1sen!2ske!4v1791380783768!5m2!1sen!2ske",
  },
  {
    id: "taveta-road",
    name: "Taveta Road",
    address: "Jithada Shopping Complex, Shop F7",
    title: "ParcelGrid Courier Services, Taveta Road",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817401352373!2d36.823271210792846!3d-1.2834223986989701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f116c2b88b5ff%3A0xdc1f0c637cd56f73!2sParcelGrid%20Courier%20Services%20%E2%80%93%20Taveta%20Road!5e0!3m2!1sen!2ske!4v1791380808173!5m2!1sen!2ske",
  },
  {
    id: "moi-avenue",
    name: "Moi Avenue",
    address: "Iconic Business Plaza, Shop G13",
    title: "ParcelGrid Courier Services, Moi Avenue",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8182806741765!2d36.82043671079267!3d-1.2828584986995366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1190bea91a07%3A0x14f4fce39750d0df!2sParcelGrid%20Courier%20Services%E2%80%93%20Moi%20Avenue!5e0!3m2!1sen!2ske!4v1791380869461!5m2!1sen!2ske",
  },
];

export function NairobiHubs() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState<number[]>([0]);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const { ref, className } = useRevealOnScroll();

  function select(index: number) {
    setActive(index);
    setMounted((current) => (current.includes(index) ? current : [...current, index]));
    tabsRef.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      event.key === "ArrowRight" ? (index + 1) % hubs.length : (index - 1 + hubs.length) % hubs.length;
    select(next);
  }

  return (
    <section
      ref={ref}
      className={`reveal bg-white py-10 sm:py-14 ${className}`}
      aria-labelledby="nairobi-hubs-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 id="nairobi-hubs-heading" className="reveal-up mb-4 text-lg font-semibold text-[#071410]">
          Our Nairobi branches
        </h2>
        <div className="reveal-scale overflow-hidden rounded-2xl border border-black/10 bg-white">
          <div role="tablist" aria-label="Nairobi branches" className="grid grid-cols-3 bg-[#f4f5f2]">
            {hubs.map((hub, index) => {
              const selected = index === active;
              return (
                <button
                  key={hub.id}
                  ref={(node) => {
                    tabsRef.current[index] = node;
                  }}
                  id={`hub-tab-${hub.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`hub-panel-${hub.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`border-b px-3 py-4 text-left transition-colors sm:px-5 sm:py-5 ${
                    selected
                      ? "border-[#E9FF15] bg-white text-[#071410]"
                      : "border-black/10 bg-[#f4f5f2] text-[#5d6b68] hover:text-[#071410]"
                  } ${index > 0 ? "border-l border-l-black/10" : ""}`}
                >
                  <span className="block text-sm font-semibold leading-5 sm:text-[15px]">{hub.name}</span>
                  <span className="mt-1 hidden text-xs leading-4 text-[#5d6b68] sm:block">{hub.address}</span>
                </button>
              );
            })}
          </div>
          <div className="relative h-[420px] bg-[#f4f5f2] sm:h-[480px]">
            {hubs.map((hub, index) => {
              const selected = index === active;
              return (
                <div
                  key={hub.id}
                  id={`hub-panel-${hub.id}`}
                  role="tabpanel"
                  aria-labelledby={`hub-tab-${hub.id}`}
                  hidden={!selected}
                  className="absolute inset-0"
                >
                  {mounted.includes(index) ? (
                    <iframe
                      title={hub.title}
                      src={hub.src}
                      className="h-full w-full border-0"
                      loading="eager"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
