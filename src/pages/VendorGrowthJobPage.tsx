import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const VendorGrowthJobPage: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white">
      <Header transparent={false} />

      {/* Top bar */}
      <section className="pt-15 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/careers"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Careers
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Nairobi
            </span>
            <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Full-time · Mon–Sat
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
            Vendor Growth and Customer Relations Officer
          </h1>
          <p className="text-lg text-gray-500">KES 30,000 basic pay + commission</p>
        </div>
      </section>

      {/* Body — two column on desktop */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* About the role */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">About the Role</h2>
                <p className="text-gray-600 leading-relaxed">
                  ParcelGrid is looking for a confident, smart and energetic person to help us grow our vendor base
                  and strengthen relationships with existing vendors.
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">What You Will Do</h2>
                <ul className="space-y-2 text-gray-600">
                  {[
                    'Cold calling potential customers and visiting vendor shops and businesses to introduce ParcelGrid',
                    'Onboarding new vendors and following up on leads',
                    'Training vendors on how ParcelGrid works and educating them on our services',
                    'Creating simple social media content that helps attract and engage sellers on TikTok, Facebook, Instagram and WhatsApp',
                    'Representing ParcelGrid professionally both in the field and online',
                    'Handling objections and helping vendors understand how ParcelGrid can grow their businesses outside Nairobi',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00473E]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who we're looking for */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Who We Are Looking For</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  This role is ideal for someone who can sell confidently, communicate clearly, teach patiently,
                  and represent ParcelGrid professionally both in the field and online. You should be comfortable
                  speaking to business owners, explaining our parcel delivery and Pay on Delivery services,
                  answering questions, and following up prospects.
                </p>
                <ul className="space-y-2 text-gray-600">
                  {[
                    'Strong communication skills in English and Kiswahili',
                    'Confidence in sales and field marketing',
                    'Good people skills and discipline in reporting',
                    'Smartphone literacy and ability to create simple digital content',
                    'Ability to work under targets',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00473E]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Qualifications & Experience</h2>
                <p className="text-gray-600 leading-relaxed mb-2">
                  A Diploma in Sales, Marketing, Business, Communication, Customer Service, Public Relations or a
                  related field is an added advantage.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  At least 1 to 3 years of relevant experience in field sales, direct marketing, customer
                  engagement, activations, merchant onboarding, business development, content creation or vendor
                  relationship management is preferred.
                </p>
              </div>

              {/* Salary & terms */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Salary & Terms</h2>
                <ul className="space-y-2 text-gray-600">
                  {[
                    'KES 30,000 basic pay, plus commission',
                    'This is a full-time, physical role, not remote. You will be required to report in person from Monday to Saturday.',
                    'The ideal candidate must be familiar with Nairobi CBD, since the role involves visiting sellers with shops in Nairobi CBD.',
                    'Academic certificates should not be sent immediately. You will be guided on where to send them after your presentation video has been reviewed and accepted',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00473E]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to apply — mobile only (repeated in sidebar on desktop) */}
              <div className="lg:hidden rounded-2xl border border-[#00473E]/20 bg-[#00473E]/5 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How to Apply</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Start with a <strong>2-minute video presentation</strong> selling ParcelGrid — showing your
                  communication, persuasion and brand representation skills.
                </p>
                <a
                  href="https://wa.me/254745111555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00473E] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#00362f] transition-colors duration-150 w-full justify-center mb-4"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp: 0745 111 555
                </a>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800 font-medium mb-1">Please Note</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    CVs and documents are only accepted <strong>after</strong> your video is reviewed and approved.
                  </p>
                </div>
              </div>

            </div>

            {/* Sidebar — desktop only */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">

                {/* Apply card */}
                <div className="rounded-2xl border border-[#00473E]/20 bg-[#00473E]/5 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">How to Apply</h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Start with a <strong>2-minute video presentation</strong> selling ParcelGrid — showing your
                    communication, persuasion and brand representation skills.
                  </p>
                  <a
                    href="https://wa.me/254745111555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#00473E] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#00362f] transition-colors duration-150 w-full mb-4 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp: 0745 111 555
                  </a>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-800 font-medium mb-1">Please Note</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      CVs and documents are only accepted <strong>after</strong> your video has been reviewed and approved.
                      You will be guided on where to send them.
                    </p>
                  </div>
                </div>

                {/* Quick facts */}
                <div className="rounded-2xl border border-gray-200 p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Job Details</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Nairobi
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Full-time · Mon–Sat
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      KES 30,000 + commission
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M5 21H3m14 0H7" />
                      </svg>
                      ParcelGrid
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      1–3 years experience preferred
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VendorGrowthJobPage;