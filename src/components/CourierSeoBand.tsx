import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

/**
 * Keyword-rich, crawlable content block for "courier services Kenya" and related queries.
 * Keeps copy natural and links internally to service/pricing/stations pages.
 */
export function CourierSeoBand() {
  return (
    <Reveal
      as="section"
      variant="up"
      className="section-blend-top border-t border-black/[0.06] bg-white py-14 sm:py-20"
      aria-labelledby="courier-services-heading"
      id="courier-services-kenya"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">
          COURIER SERVICES IN KENYA
        </p>
        <h2
          id="courier-services-heading"
          className="mt-3 max-w-3xl font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl"
        >
          Reliable courier services for Nairobi sellers and upcountry buyers
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <div className="space-y-4 text-base leading-relaxed text-[#5c6562] sm:text-[17px]">
            <p>
              ParcelGrid is a licensed{" "}
              <strong className="font-semibold text-[#071410]">courier service in Kenya</strong> built
              for online sellers, shops, and businesses that ship outside Nairobi. Drop off at our
              CBD branches on Ronald Ngala Street, Moi Avenue, or Taveta Road — we move parcels
              next-day to{" "}
              <Link to="/pickup-points" className="font-semibold text-[#00473E] underline-offset-2 hover:underline">
                pickup stations in 132 towns
              </Link>
              , including Mombasa, Nakuru, Eldoret, Kisumu, and trading centres across the country.
            </p>
            <p>
              Whether you need{" "}
              <Link
                to="/services/pay-on-delivery-courier-kenya"
                className="font-semibold text-[#00473E] underline-offset-2 hover:underline"
              >
                Pay on Delivery (COD) courier
              </Link>{" "}
              with instant M-Pesa settlements, or{" "}
              <Link to="/book-parcel" className="font-semibold text-[#00473E] underline-offset-2 hover:underline">
                prepaid parcel delivery
              </Link>{" "}
              booked online, every shipment is trackable and escrow-protected under Escrow Courier
              Networks Ltd (Communications Authority licensed).
            </p>
            <p>
              Compare{" "}
              <Link to="/pricing" className="font-semibold text-[#00473E] underline-offset-2 hover:underline">
                courier prices in Kenya
              </Link>{" "}
              with our live calculator, then{" "}
              <Link to="/track" className="font-semibold text-[#00473E] underline-offset-2 hover:underline">
                track your parcel
              </Link>{" "}
              from dispatch to collection — no WhatsApp quote spam, no waiting days for COD payouts.
            </p>
          </div>
          <ul className="reveal-stagger space-y-3 self-start rounded-2xl border border-black/10 bg-[#f7f8f6] p-5 sm:p-6">
            {[
              { to: "/services/upcountry-parcel-delivery", label: "Next-day upcountry parcel delivery" },
              { to: "/services/pay-on-delivery-courier-kenya", label: "Pay on Delivery courier Kenya" },
              { to: "/pricing", label: "Affordable courier rates & fee calculator" },
              { to: "/pickup-points", label: "Find drop-off & pickup stations" },
              { to: "/contact", label: "Nairobi CBD courier branches" },
              { to: "/faq", label: "Courier service FAQs" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-semibold text-[#071410] shadow-sm ring-1 ring-black/5 transition-colors hover:bg-[#00473E] hover:text-white hover:ring-[#00473E]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
