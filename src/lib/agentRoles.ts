export type AgentSection = {
  id: string
  title: string
  body?: string
  list?: string[]
  ordered?: boolean
}

export type AgentRole = {
  id: 'pickup' | 'booking'
  name: string
  tagline: string
  summary: string
  tags: string[]
  highlights: string[]
  sections: AgentSection[]
  quickFacts: string[]
  applyNote: string
}

export const AGENT_ROLES: AgentRole[] = [
  {
    id: 'pickup',
    name: 'Pickup Agent',
    tagline: "Join Kenya's widest pickup point network and earn commission on every parcel handled.",
    summary:
      'Turn your shop into a trusted collection point where customers pick up their prepaid or COD parcels, even after work.',
    tags: ['Outside Nairobi', 'Flexible hours'],
    highlights: [
      '20% commission on the net courier fee',
      'Listed free on our national station directory',
      'COD settled by ParcelGrid, no cash handling',
    ],
    sections: [
      {
        id: 'who',
        title: 'Who can apply',
        list: [
          'A physical shop or business premises that is open from 8:00 a.m. to 7:00 p.m.',
          'Adequate and secure space to store customer parcels safely.',
          'A strong, lockable structure or building (no temporary kiosks).',
          'At least one smartphone that can install and use the ParcelGrid Agent App.',
          'A business permit or a lease agreement for the premises.',
          'A reliable telephone number that can be published on our public pickup list.',
          'Readiness to undergo ParcelGrid training and follow operational standards.',
        ],
      },
      {
        id: 'earn',
        title: "How you'll earn",
        body: 'Pickup Agents earn commission for every parcel handled through their location.',
        list: [
          'You earn 20% commission on the net courier fee charged to vendors for every prepaid or Cash on Delivery (COD) parcel collected at your pickup point.',
          'Your earnings are credited automatically to your ParcelGrid Agent Wallet in the app. Withdraw anytime to your M-Pesa business line.',
          'The more parcels you handle, the more you earn, with no limit on your monthly income.',
        ],
      },
      {
        id: 'benefits',
        title: 'Benefits',
        list: [
          'Increased foot traffic to your shop, which boosts your main business.',
          'Listing on our national pickup directory (free marketing for your shop).',
          'Automated COD handling, so there is no chasing payments.',
          'Digital tracking of all parcels via the ParcelGrid Agent App.',
          'Support from our regional coordinators and Nairobi head office.',
        ],
      },
      {
        id: 'documents',
        title: 'Documents required',
        body: "Before approval, you'll need to share:",
        ordered: true,
        list: [
          'Copy of Business Permit.',
          'Copy of Shop Lease Agreement or Ownership Proof.',
          'Clear photos of the shop (inside and outside).',
          'National ID copy of the business owner.',
          'Active business phone number (for customer contact).',
        ],
      },
      {
        id: 'training',
        title: 'Training and activation',
        ordered: true,
        list: [
          "You'll receive a training invite from our regional supervisor.",
          "You'll be guided on how to use the ParcelGrid Agent App for parcel check-in, photo uploads, and customer pickups.",
          'Your pickup point will be activated on the ParcelGrid map for customers to select during checkout.',
          "You'll start receiving parcels from the nearest station or Nairobi branches within days.",
        ],
      },
      {
        id: 'notes',
        title: 'Important notes',
        list: [
          'Pickup Agents must remain open daily (Mon–Sat, 8 a.m.–7 p.m.).',
          'All parcels must be stored in clean, organized, and secure conditions.',
          'The agent is responsible for timely customer communication through the app.',
          'Customer payments (COD) are settled automatically via ParcelGrid systems. You do not handle cash directly.',
        ],
      },
    ],
    quickFacts: [
      'Commission-based earnings',
      'Open Mon–Sat, 8:00 a.m. – 7:00 p.m.',
      'Physical shop and secure parcel space required',
      'Smartphone with the ParcelGrid Agent App required',
    ],
    applyNote: 'Call or WhatsApp customer care to start. We will review your details and share the next steps.',
  },
  {
    id: 'booking',
    name: 'Booking Agent',
    tagline:
      'Help vendors and customers send parcels across Kenya by receiving drops, booking in-app, and coordinating dispatch from your location.',
    summary:
      'Be a ParcelGrid drop-off point in Nairobi CBD, Ngara, Eastleigh or Gikomba and earn on every parcel you book.',
    tags: ['Nairobi', 'Full-time'],
    highlights: [
      '20% commission on courier fees (excl. VAT)',
      'Weekly payouts to your M-Pesa business line',
      'Training and support from our Nairobi operations team',
    ],
    sections: [
      {
        id: 'overview',
        title: 'Become a ParcelGrid Booking Agent',
        body: "ParcelGrid is expanding its drop-off network in Nairobi CBD, Ngara, Eastleigh, and Gikomba. We're looking for reliable booking agents to help vendors and customers send parcels to several pickup points across Kenya.",
      },
      {
        id: 'do',
        title: "What you'll do",
        body: "As a ParcelGrid Booking Agent, you'll collect parcels from senders, book them on the ParcelGrid App, and make sure they are safely handed over to our Nairobi branch team for dispatch.",
      },
      {
        id: 'earn',
        title: 'How you earn',
        body: 'You earn 20% commission of courier fees (excluding VAT) for every prepaid and COD parcel you book. All earnings are credited automatically to your ParcelGrid Agent Wallet inside the app. Withdraw your money directly to your M-Pesa business line. Payouts are done every week.',
      },
      {
        id: 'requirements',
        title: 'Minimum requirements',
        list: [
          'Must be located in Nairobi CBD, Ngara, Eastleigh, or Gikomba.',
          'Must have at least 20 square feet (about 5ft x 4ft) of safe, dry, and clean space with shelves for storing parcels.',
          'Must operate on the ground floor of your building for easy access.',
          'Must open from 9:00 a.m. to 7:00 p.m., Monday to Saturday.',
          'Must have a smartphone capable of running the ParcelGrid App.',
          'Must hold a valid business permit.',
          'Must be the actual shop owner. No brokers or employees applying on behalf of owners.',
          'Must ensure the premises are secure, visible, and accessible to customers.',
        ],
      },
      {
        id: 'documents',
        title: 'Documents to share',
        ordered: true,
        list: [
          'Copy of Business Permit',
          'Shop Lease Agreement or Proof of Ownership',
          'Clear photos of the shop (front and interior showing storage shelves)',
          'Copy of National ID',
          'Active business phone number (will appear on ParcelGrid platforms)',
        ],
      },
      {
        id: 'why',
        title: 'Why join ParcelGrid',
        list: [
          'Earn steady weekly income through digital bookings.',
          'Join a licensed national courier network trusted by thousands of online vendors.',
          'Enjoy full transparency through your ParcelGrid Agent Wallet.',
          'Get professional training and support from our Nairobi operations team.',
        ],
      },
    ],
    quickFacts: [
      'Nairobi CBD, Ngara, Eastleigh, or Gikomba',
      'Open Mon–Sat, 9:00 a.m. – 7:00 p.m.',
      'At least 20 sq ft of secure storage space',
      'Smartphone with the ParcelGrid app required',
    ],
    applyNote: 'Only businesses within Nairobi CBD, Ngara, Eastleigh, or Gikomba are eligible. Call or WhatsApp customer care to start.',
  },
]

export const AGENT_PROCESS = [
  { title: 'Contact customer care', body: 'Call or WhatsApp us and tell us which role you want.' },
  { title: 'We review', body: 'Our team checks your details and shares the next steps.' },
  { title: 'Train and activate', body: 'Get trained on the ParcelGrid Agent App and go live.' },
  { title: 'Start earning', body: 'Commission is credited to your Agent Wallet on every parcel.' },
]

