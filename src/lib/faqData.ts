export type FaqAnswer = {
  /** Plain-text paragraph. Also used verbatim in FAQPage JSON-LD. */
  text: string
  /** Optional bullet / numbered list shown under the paragraph. */
  list?: string[]
  ordered?: boolean
}

export type FaqItem = { id: string; question: string; answer: FaqAnswer }
export type FaqTopic = { id: string; title: string; items: FaqItem[] }

export const faqAnswerToText = (a: FaqAnswer) =>
  [a.text, ...(a.list ?? []).map((l, i) => (a.ordered ? `${i + 1}. ${l}` : `- ${l}`))].filter(Boolean).join(' ')

export const FAQ_TOPICS: FaqTopic[] = [
  {
    id: 'about',
    title: 'About ParcelGrid',
    items: [
      {
        id: 'what-is-parcelgrid',
        question: 'What is ParcelGrid?',
        answer: {
          text: 'ParcelGrid® is a registered trademark of Escrow Courier Networks Limited, a licensed courier company regulated by the Communications Authority of Kenya (CA). We provide delivery infrastructure with drop-off branches in Nairobi CBD and pickup stations in all major towns across Kenya.',
        },
      },
      {
        id: 'courier-services-kenya',
        question: 'Which courier services does ParcelGrid offer in Kenya?',
        answer: {
          text: 'ParcelGrid offers courier services in Kenya focused on parcels from Nairobi CBD to upcountry towns: next-day delivery to 132 pickup stations, prepaid booking online or in-app, and Pay on Delivery (COD) with instant M-Pesa settlements for online sellers.',
        },
      },
      {
        id: 'where-located',
        question: 'Where are you located?',
        answer: {
          text: 'ParcelGrid has three drop-off branches in Nairobi CBD. Walk-in bookings are welcome at all of them:',
          list: [
            'City Centre Mall (Shop LG12), Ronald Ngala Street',
            'Iconic Business Plaza (Shop G13), Moi Avenue, between Sasa Mall and Sawa Mall',
            'Jithada Shopping Complex (Shop F7), Taveta Road, opposite Samagat Building',
          ],
        },
      },
      {
        id: 'licensed',
        question: 'Are you licensed?',
        answer: {
          text: 'Yes. Escrow Courier Networks Limited (the company behind ParcelGrid) is licensed by the Communications Authority of Kenya (CA) under License No. PL-025-0658.',
        },
      },
      {
        id: 'different',
        question: 'How is ParcelGrid different from other couriers?',
        answer: {
          text: 'ParcelGrid is built for online sellers, not general courier traffic:',
          list: [
            'One of the widest pickup networks in Kenya, covering 132 towns.',
            'Instant COD settlements to M-Pesa.',
            'A transparent 1.8% handling fee on COD settlements only, with no hidden charges.',
            'Smart SMS and app notifications for sellers and buyers.',
          ],
        },
      },
    ],
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      {
        id: 'join',
        question: 'How do I join ParcelGrid as a vendor?',
        answer: {
          text: 'It takes a few minutes:',
          ordered: true,
          list: [
            'Download the ParcelGrid app.',
            'Sign up as a vendor.',
            'Start booking parcels and dropping them off at any of our Nairobi CBD branches.',
          ],
        },
      },
      {
        id: 'cost-to-join',
        question: 'Is there a cost to join?',
        answer: {
          text: 'No registration fees. You only pay delivery fees, plus the 1.8% handling fee on COD transactions.',
        },
      },
      {
        id: 'mobile-app',
        question: 'Is there a mobile app?',
        answer: {
          text: 'Yes. The ParcelGrid app is available for Android and iOS. It lets vendors book parcels, choose Prepaid or COD, track deliveries and withdraw money instantly.',
        },
      },
    ],
  },
  {
    id: 'sending',
    title: 'Sending & Delivery',
    items: [
      {
        id: 'drop-off-cbd',
        question: 'Where can I drop off parcels in Nairobi CBD?',
        answer: {
          text: 'You can drop off parcels at any of our three central CBD branches: City Centre Mall (Shop LG12) on Ronald Ngala Street, Iconic Business Plaza (Shop G13) on Moi Avenue, or Jithada Shopping Complex (Shop F7) on Taveta Road. Walk-in bookings are welcome at all branches.',
        },
      },
      {
        id: 'delivery-time',
        question: 'How long does upcountry delivery take?',
        answer: {
          text: 'We deliver next-day to 132 upcountry towns across Kenya. Our Nairobi CBD branches are open 9:00 AM to 7:00 PM, Monday to Saturday. Parcels leave at night and are expected to arrive the following day.',
        },
      },
      {
        id: 'send-outside-nairobi',
        question: 'Can I send parcels from outside Nairobi?',
        answer: {
          text: 'Yes, you can send from both. In addition to our three Nairobi CBD branches, selected upcountry stations are fully enabled Send & Collect stations where you can drop off parcels destined for Nairobi or other regional towns. Look for the "Send & Collect" badge on the station card.',
        },
      },
      {
        id: 'tracking',
        question: 'How will I and my customers know the status of a parcel?',
        answer: {
          text: 'ParcelGrid sends automatic SMS and app alerts at every stage:',
          list: [
            'The vendor is notified when the parcel is dropped off.',
            'The customer is notified when the parcel arrives at the pickup station.',
            'Reminders are sent when the parcel is ready for collection.',
            'The vendor is notified once the parcel is collected, with payment confirmation for COD.',
          ],
        },
      },
    ],
  },
  {
    id: 'stations',
    title: 'Pickup Stations',
    items: [
      {
        id: 'what-is-pickup-point',
        question: 'What is a pickup station?',
        answer: {
          text: 'A pickup station is a verified local shop or business where customers collect their parcels at their convenience, including after work.',
        },
      },
      {
        id: 'cbd-branches',
        question: 'Where are your primary Nairobi CBD drop-off points located?',
        answer: {
          text: 'We operate three CBD drop-off branches, open Monday to Saturday:',
          list: [
            'Ronald Ngala: City Centre Mall, Shop LG12, Ronald Ngala Street',
            'Moi Avenue: Iconic Business Plaza, Ground Floor, Shop G13',
            'Taveta Road: Jithada Shopping Complex, Ground Floor, Shop F7',
          ],
        },
      },
      {
        id: 'recipient-needs',
        question: 'What does a recipient need to collect a parcel?',
        answer: {
          text: 'No ID is needed. When the parcel is booked, the sender enters the recipient\'s name, phone number and collection location. When the parcel arrives, we send a unique release code by SMS to the person collecting. They give this code to the station agent, and the parcel is released. For COD orders, they also need enough M-Pesa balance to pay the item amount.',
        },
      },
      {
        id: 'hold-time',
        question: 'How long will a station hold a parcel before returning it?',
        answer: {
          text: 'Stations securely hold arriving parcels for up to 1 month. We send automated SMS collection reminders to the buyer throughout this window.',
        },
      },
      {
        id: 'how-many-stations',
        question: 'How many pickup stations do you have?',
        answer: {
          text: 'ParcelGrid covers 132 towns across Kenya, and the network keeps growing. Search for your town on the Stations page.',
        },
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & COD',
    items: [
      {
        id: 'prepaid-and-cod',
        question: 'Do you handle both prepaid and Cash on Delivery (COD)?',
        answer: {
          text: "Yes. When booking a parcel, the vendor chooses whether it's Prepaid or COD.",
        },
      },
      {
        id: 'how-cod-works',
        question: 'How does Pay on Delivery (COD) work with ParcelGrid?',
        answer: {
          text: 'You drop off the parcel and enter the exact amount to collect. Your buyer inspects the package at their local station, pays by M-Pesa on collection, and the funds are credited to your seller wallet instantly.',
          ordered: true,
          list: [
            'The app prompts you to enter the exact amount to collect.',
            'At pickup, our station agent sends an M-Pesa prompt to the customer for that amount.',
            'Once payment is successful, the parcel is released.',
            'The money reflects instantly in your ParcelGrid wallet, minus a 1.8% handling fee.',
          ],
        },
      },
      {
        id: 'cod-collection',
        question: 'How does Cash on Delivery (COD) collection work at the station?',
        answer: {
          text: 'When your buyer arrives to collect their parcel, the station agent prompts them to pay the declared order amount via M-Pesa. Once the payment confirmation clears on the agent terminal, the parcel is released to the buyer.',
        },
      },
      {
        id: 'cod-refused',
        question: 'What happens if a customer refuses or fails to pick up a COD parcel?',
        answer: {
          text: 'Recipients have 1 month to collect their parcel before it is flagged as uncollected. If a buyer rejects the order or does not collect within 1 month, we alert you on your dashboard and coordinate a return dispatch back to your origin branch.',
        },
      },
      {
        id: 'cod-limit',
        question: 'What is the maximum cash limit per COD order?',
        answer: {
          text: 'COD orders follow standard M-Pesa single-transaction limits, up to KES 250,000 per transaction. All customer payments are processed digitally via M-Pesa. Our pickup stations do not accept physical cash.',
        },
      },
      {
        id: 'handling-fee',
        question: 'What does the 1.8% COD handling fee cover?',
        answer: {
          text: 'The 1.8% COD handling fee covers payment collection through the M-Pesa prompt our station agents send to the buyer, secure wallet remittance, and the automated reconciliation infrastructure that powers ParcelGrid®. This ensures fast, accurate settlements to vendors without additional withdrawal costs.',
        },
      },
      {
        id: 'prepaid',
        question: 'How do prepaid deliveries work?',
        answer: {
          text: 'For prepaid parcels, the customer has already paid the vendor before shipping. ParcelGrid delivers the parcel to the pickup station and releases it when the customer shows their release code.',
        },
      },
      {
        id: 'how-pricing-works',
        question: 'How do you calculate courier fees?',
        answer: {
          text: 'Fees depend on your drop-off branch (usually Nairobi CBD), your buyer’s pickup station, and either a weight band or a special item size. Use the live calculator for an exact quote before you book.',
        },
      },
      {
        id: 'pricing-same-as-app',
        question: 'What about Pay on Delivery (COD) fees?',
        answer: {
          text: 'You still pay the standard shipping fee (prepaid by M-Pesa). For COD parcels we also deduct a small escrow handling fee (1.8%) from the order amount when your buyer pays on collection — then the balance lands in your ParcelGrid wallet instantly.',
        },
      },
      {
        id: 'how-pay-courier-fee',
        question: 'How do I pay the courier fee?',
        answer: {
          text: 'Book online or in the app, then pay the prepaid courier fee by M-Pesa (Paybill 4157233). Your buyer can still use Pay on Delivery for the goods if you enable COD.',
        },
      },
    ],
  },
  {
    id: 'wallet',
    title: 'Settlements & Wallet',
    items: [
      {
        id: 'when-paid',
        question: 'When do I get paid for COD deliveries?',
        answer: {
          text: 'Settlements are instant. The moment your buyer pays on collection, your funds (minus the standard 1.8% handling fee) are credited to your ParcelGrid wallet. You can withdraw to your registered M-Pesa number at any time.',
        },
      },
      {
        id: 'withdraw',
        question: 'How do I withdraw my money?',
        answer: {
          text: 'You can withdraw from your ParcelGrid wallet to your M-Pesa number anytime, instantly.',
        },
      },
      {
        id: 'bank',
        question: 'Can I link my bank account?',
        answer: { text: 'Not yet. For now, withdrawals are only supported to M-Pesa.' },
      },
    ],
  },
  {
    id: 'policies',
    title: 'Shipping Policies',
    items: [
      {
        id: 'lost-damaged',
        question: 'What is your lost or damaged parcel policy?',
        answer: {
          text: 'ParcelGrid exercises due care across all road transit routes. Fragile and spill-prone goods must be declared and packaged with adequate bubble wrap or leak-proof materials, with visible red "FRAGILE" markings on all four sides. Under our standard carrier terms, verified loss or transit damage claims are capped at a maximum liability of KES 5,000 per parcel, unless specialised high-value transit insurance has been declared and approved in writing before dispatch.',
        },
      },
      {
        id: 'prohibited',
        question: 'Which items are prohibited or restricted?',
        answer: {
          text: 'In compliance with the Communications Authority of Kenya (CA) and domestic transport laws, ParcelGrid does not transport:',
          list: [
            'Hazardous, flammable or corrosive substances',
            'Explosives, weapons and ammunition',
            'Unpackaged liquids or unapproved perishable foodstuffs',
            'Cash, raw currency substitutes, bearer bonds or precious metals',
            'Live animals or pets',
            'Counterfeit goods, narcotics or unlicensed pharmaceuticals',
          ],
        },
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        id: 'contact-support',
        question: 'How do I contact support?',
        answer: {
          text: 'Our team is available on:',
          list: [
            'Phone and WhatsApp: 0745 111 555 / 0794 333 888',
            'Email: info@escrowcourier.com',
            'The support section inside the ParcelGrid app',
          ],
        },
      },
    ],
  },
]

const allItems = FAQ_TOPICS.flatMap((t) => t.items)

export const faqByIds = (ids: string[]): FaqItem[] =>
  ids.map((id) => {
    const item = allItems.find((i) => i.id === id)
    if (!item) throw new Error(`Unknown FAQ id: ${id}`)
    return item
  })

/** Short answers shown right above the footer on key landing pages. */
export const HOME_FAQ_IDS = [
  'courier-services-kenya',
  'drop-off-cbd',
  'delivery-time',
  'how-cod-works',
  'send-outside-nairobi',
]
export const COD_FAQ_IDS = ['cod-collection', 'when-paid', 'cod-refused', 'cod-limit']
export const STATIONS_FAQ_IDS = ['send-outside-nairobi', 'recipient-needs', 'hold-time', 'cbd-branches']
export const PRICING_FAQ_IDS = ['how-pricing-works', 'pricing-same-as-app', 'how-pay-courier-fee', 'send-outside-nairobi']

export const HOME_FAQ: FaqItem[] = faqByIds(HOME_FAQ_IDS).map((item) =>
  item.id === 'how-cod-works'
    ? {
        ...item,
        // Homepage uses the short paragraph form; the step list lives on /faq
        answer: {
          text: 'You drop off the parcel and specify the order amount. Your buyer inspects the package at their local upcountry station, pays via M-Pesa upon collection, and the funds are credited to your seller wallet instantly.',
        },
      }
    : item,
)
