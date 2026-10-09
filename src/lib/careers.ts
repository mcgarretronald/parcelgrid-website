export type JobSection = {
  id: string
  title: string
  paragraphs?: string[]
  list?: string[]
}

export type Job = {
  slug: string
  title: string
  summary: string
  location: string
  type: string
  salary: string
  experience: string
  sections: JobSection[]
  applyIntro: string
  applyNote: string
  applyEmail?: string
  applyDeadline?: string
}

export const JOBS: Job[] = [
  {
    slug: 'accountant',
    title: 'Accountant',
    summary:
      'Own our day-to-day accounting: financial reporting, M-Pesa and bank reconciliations, cost and profitability analysis, tax compliance, payroll and physical parcel audits across our Nairobi operations.',
    location: 'Nairobi, Kenya',
    type: 'Full-Time',
    salary: 'KES 40,000 gross per month',
    experience: '3+ years practical accounting experience',
    sections: [
      {
        id: 'about',
        title: 'About the role',
        paragraphs: [
          'Escrow Courier Networks Limited (ParcelGrid®) is a fast-growing technology-driven parcel delivery company operating a network of pickup stations across Kenya. We are looking for a highly competent, analytical and trustworthy Accountant to join our team and take responsibility for financial reporting, reconciliations, cost monitoring and financial controls.',
          'We need someone who is not just good at recording transactions, but can also analyze financial information, identify discrepancies and help management make better financial decisions.',
        ],
      },
      {
        id: 'financial-management',
        title: '1. Financial Management & Reporting',
        list: [
          'Maintain accurate and up-to-date financial records.',
          'Prepare daily, weekly and monthly financial reports.',
          'Prepare profit and loss statements, cash flow reports and other management accounts.',
          'Monitor company expenditure, budgets and overall financial performance.',
          'Provide management with clear financial insights and recommendations.',
        ],
      },
      {
        id: 'reconciliation',
        title: '2. Payment Reconciliation & Controls',
        list: [
          'Perform daily reconciliation of M-Pesa, bank and internal system transactions.',
          'Reconcile customer payments, vendor settlements, commissions and other financial transactions.',
          'Identify and investigate missing payments, incorrect charges, duplicate transactions and financial discrepancies.',
          'Ensure proper accountability for all company funds and money collected on behalf of customers and vendors.',
          'Establish and maintain effective financial controls to prevent revenue leakage.',
        ],
      },
      {
        id: 'cost-analysis',
        title: '3. Cost Analysis & Profitability',
        list: [
          'Analyze operating expenses and identify opportunities to reduce unnecessary costs.',
          'Prepare profitability reports for different branches, routes and company operations.',
          'Monitor transport, fuel, maintenance and other operational expenses.',
          'Track financial performance against budgets and targets.',
          'Recommend practical ways of improving profitability and financial efficiency.',
        ],
      },
      {
        id: 'tax-payroll',
        title: '4. Tax Compliance & Payroll',
        list: [
          'Prepare and submit statutory tax returns accurately and on time.',
          'Ensure compliance with KRA requirements, including VAT, PAYE, eTIMS and applicable statutory deductions.',
          'Prepare payroll and maintain accurate employee payment records.',
          'Support financial audits and ensure proper documentation of transactions.',
        ],
      },
      {
        id: 'systems',
        title: '5. Financial Systems & Process Improvement',
        list: [
          "Work with the company's internal software and financial records to ensure accuracy.",
          'Identify weaknesses in financial procedures and recommend improvements.',
          'Develop efficient reporting and reconciliation processes.',
          'Support management in strengthening financial accountability across the organization.',
        ],
      },
      {
        id: 'parcel-auditing',
        title: '6. Parcel Auditing & Dispatch Verification',
        list: [
          'Conduct regular and random physical parcel audits to ensure accuracy and accountability.',
          'Verify that physical parcel quantities match system records and dispatch manifests.',
          'Check parcel weights and confirm that the correct courier charges have been applied.',
          'Identify undercharging, unauthorized discounts and other revenue losses.',
          'Investigate missing, unscanned or incorrectly recorded parcels.',
          'Verify return parcels and ensure applicable charges are properly recorded.',
          'Participate in evening dispatch audits and report any discrepancies to management.',
        ],
      },
      {
        id: 'qualifications',
        title: 'Qualifications & Experience',
        list: [
          "Bachelor's degree or diploma in Accounting, Finance, Commerce or a related field.",
          'Minimum CPA Part II, with CPA finalists or fully qualified accountants having an added advantage.',
          'At least 3 years of practical accounting experience in a busy business environment.',
          'Strong practical experience in financial reconciliation, reporting and cost management.',
          'Advanced Microsoft Excel skills, including formulas, PivotTables and data analysis.',
          'Experience using accounting software such as QuickBooks, Sage, Xero or similar systems.',
          'Good understanding of M-Pesa transactions, banking processes and payment reconciliations.',
          'Strong knowledge of Kenyan taxation and statutory compliance.',
          'Experience handling high volumes of financial transactions is an added advantage.',
        ],
      },
      {
        id: 'industry',
        title: 'Industry experience',
        paragraphs: [
          'Experience in the courier or logistics industry is NOT a requirement. We welcome competent accountants from any industry.',
        ],
      },
      {
        id: 'attributes',
        title: 'Personal Attributes',
        paragraphs: ['We are particularly interested in someone who is:'],
        list: [
          'Highly analytical: able to interpret financial data, identify problems and recommend solutions.',
          'Extremely accurate: pays close attention to figures and does not overlook discrepancies.',
          'Honest and trustworthy: demonstrates a high level of integrity and confidentiality.',
          'Proactive: identifies financial issues before they become bigger problems.',
          'Independent: can work with minimal supervision and consistently meet deadlines.',
          'Technology-oriented: comfortable using digital financial systems and learning new software.',
          'Results-driven: understands that accounting should support business efficiency, cost control and profitability.',
        ],
      },
      {
        id: 'expect',
        title: 'What we expect',
        paragraphs: [
          "The successful candidate should be able to independently manage the company's day-to-day accounting responsibilities, maintain accurate and reconciled financial records, prepare meaningful management reports and continuously identify opportunities to strengthen financial controls.",
          'We are looking for a practical, competent and dependable accountant who takes ownership of their work, not someone who requires constant follow-up to complete basic responsibilities.',
        ],
      },
      {
        id: 'remuneration',
        title: 'Remuneration',
        paragraphs: ['KES 40,000 gross per month.'],
      },
    ],
    applyIntro:
      'Interested and qualified candidates should submit their updated CV, relevant academic/professional qualifications and a brief cover letter explaining their practical accounting experience.',
    applyNote: 'Only shortlisted candidates will be contacted.',
    applyEmail: 'info@escrowcourier.com',
    applyDeadline: '25th Oct 2026',
  },
]

export const CAREER_VALUES = [
  { title: 'Flat hierarchies', body: 'Good ideas count, whoever has them.' },
  { title: 'Clear communication', body: 'Say what you mean and keep each other informed.' },
  { title: 'Full ownership', body: 'You take responsibility for your work from start to finish.' },
]
