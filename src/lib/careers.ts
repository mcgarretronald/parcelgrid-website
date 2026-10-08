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
}

export const JOBS: Job[] = [
  {
    slug: 'vendor-growth-officer',
    title: 'Vendor Growth and Customer Relations Officer',
    summary:
      'Help ParcelGrid grow its vendor base across Kenya. You will cold-call prospects, visit shops, onboard new vendors, train them on our services, and create social media content to drive sign-ups.',
    location: 'Nairobi',
    type: 'Full-time · Mon–Sat',
    salary: 'KES 30,000 basic pay + commission',
    experience: '1–3 years experience preferred',
    sections: [
      {
        id: 'about',
        title: 'About the role',
        paragraphs: [
          'ParcelGrid is looking for a confident, smart and energetic person to help us grow our vendor base and strengthen relationships with existing vendors.',
        ],
      },
      {
        id: 'do',
        title: 'What you will do',
        list: [
          'Cold calling potential customers and visiting vendor shops and businesses to introduce ParcelGrid',
          'Onboarding new vendors and following up on leads',
          'Training vendors on how ParcelGrid works and educating them on our services',
          'Creating simple social media content that helps attract and engage sellers on TikTok, Facebook, Instagram and WhatsApp',
          'Representing ParcelGrid professionally both in the field and online',
          'Handling objections and helping vendors understand how ParcelGrid can grow their businesses outside Nairobi',
        ],
      },
      {
        id: 'who',
        title: 'Who we are looking for',
        paragraphs: [
          'This role is ideal for someone who can sell confidently, communicate clearly, teach patiently, and represent ParcelGrid professionally both in the field and online. You should be comfortable speaking to business owners, explaining our parcel delivery and Pay on Delivery services, answering questions, and following up prospects.',
        ],
        list: [
          'Strong communication skills in English and Kiswahili',
          'Confidence in sales and field marketing',
          'Good people skills and discipline in reporting',
          'Smartphone literacy and ability to create simple digital content',
          'Ability to work under targets',
        ],
      },
      {
        id: 'qualifications',
        title: 'Qualifications and experience',
        paragraphs: [
          'A Diploma in Sales, Marketing, Business, Communication, Customer Service, Public Relations or a related field is an added advantage.',
          'At least 1 to 3 years of relevant experience in field sales, direct marketing, customer engagement, activations, merchant onboarding, business development, content creation or vendor relationship management is preferred.',
        ],
      },
      {
        id: 'terms',
        title: 'Salary and terms',
        list: [
          'KES 30,000 basic pay, plus commission',
          'This is a full-time, physical role, not remote. You will be required to report in person from Monday to Saturday.',
          'The ideal candidate must be familiar with Nairobi CBD, since the role involves visiting sellers with shops in Nairobi CBD.',
          'Academic certificates should not be sent immediately. You will be guided on where to send them after your presentation video has been reviewed and accepted',
        ],
      },
    ],
    applyIntro:
      'Start with a 2-minute video presentation selling ParcelGrid, showing your communication, persuasion and brand representation skills.',
    applyNote: 'CVs and documents are only accepted after your video has been reviewed and approved. You will be guided on where to send them.',
  },
]

export const CAREER_VALUES = [
  { title: 'Flat hierarchies', body: 'Good ideas count, whoever has them.' },
  { title: 'Clear communication', body: 'Say what you mean and keep each other informed.' },
  { title: 'Full ownership', body: 'You take responsibility for your work from start to finish.' },
]
