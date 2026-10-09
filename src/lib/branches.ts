export type Branch = {
  id: string
  tab: string
  name: string
  street: string
  address: string
  hours: string
  hoursSpec: { days: string[]; opens: string; closes: string }
  phone: string
  phoneIntl: string
  services: string[]
  mapQuery: string
  mapSrc: string
  geo: { lat: number; lng: number }
}

const HOURS = 'Mon – Sat: 9:00 AM – 7:00 PM | Sun: Closed'
const HOURS_SPEC = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  opens: '09:00',
  closes: '19:00',
}

export const BRANCHES: Branch[] = [
  {
    id: 'ronald-ngala',
    tab: 'Ronald Ngala',
    name: 'City Centre Mall Branch',
    street: 'Ronald Ngala Street',
    address: 'City Centre Mall, Shop LG12, Basement, Ronald Ngala Street, Nairobi CBD',
    hours: HOURS,
    hoursSpec: HOURS_SPEC,
    phone: '0745 111 555',
    phoneIntl: '254745111555',
    services: ['Drop-Off & Dispatch', 'Upcountry Pickups', 'Cash on Delivery (COD) Inquiries', 'Walk-In Booking'],
    mapQuery: 'ParcelGrid Courier Services, Ronald Ngala Street, Nairobi',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.813395161258!2d36.824911410792836!3d-1.2859883986963683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11c43c98b89d%3A0x442d20dabf9264b5!2sParcelGrid%20Courier%20Services-%20Ronald%20Ngala%20Street!5e0!3m2!1sen!2ske!4v1791380783768!5m2!1sen!2ske",
    geo: { lat: -1.2859884, lng: 36.8249114 },
  },
  {
    id: 'moi-avenue',
    tab: 'Moi Avenue',
    name: 'Iconic Business Plaza Branch',
    street: 'Moi Avenue',
    address: 'Moi Avenue, Ground Floor, Shop G13 (Between Sasa Mall & Sawa Mall), Nairobi CBD',
    hours: HOURS,
    hoursSpec: HOURS_SPEC,
    phone: '0794 333 888',
    phoneIntl: '254794333888',
    services: ['Drop-Off & Dispatch', 'Online Seller Escrow Support', 'Walk-In Booking'],
    mapQuery: 'ParcelGrid Courier Services, Moi Avenue, Nairobi',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8182806741765!2d36.82043671079267!3d-1.2828584986995366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1190bea91a07%3A0x14f4fce39750d0df!2sParcelGrid%20Courier%20Services%E2%80%93%20Moi%20Avenue!5e0!3m2!1sen!2ske!4v1791380869461!5m2!1sen!2ske",
    geo: { lat: -1.2828585, lng: 36.8204367 },
  },
  {
    id: 'taveta-road',
    tab: 'Taveta Road',
    name: 'Jithada Shopping Complex Branch',
    street: 'Taveta Road',
    address: 'Taveta Road, Ground Floor, Shop F7 (Opposite Samagat Building), Nairobi CBD',
    hours: HOURS,
    hoursSpec: HOURS_SPEC,
    phone: '0745 111 555',
    phoneIntl: '254745111555',
    services: ['Drop-Off & Dispatch', 'Fast Collection', 'Walk-In Booking'],
    mapQuery: 'ParcelGrid Courier Services, Taveta Road, Nairobi',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817401352373!2d36.823271210792846!3d-1.2834223986989701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f116c2b88b5ff%3A0xdc1f0c637cd56f73!2sParcelGrid%20Courier%20Services%20%E2%80%93%20Taveta%20Road!5e0!3m2!1sen!2ske!4v1791380808173!5m2!1sen!2ske",
    geo: { lat: -1.2834224, lng: 36.8232712 },
  },
]

export const mapsLink = (b: Branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}`

export const SUPPORT_EMAIL = 'info@escrowcourier.com'
