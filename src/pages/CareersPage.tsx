import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';

const CareersPage: React.FC = () => {
  useScrollToTop();
  const [modalMode, setModalMode] = useState<'pickup' | 'booking' | null>(null);

  // Hash navigation now only scrolls to sections, doesn't open modals
  // Modals are only opened by clicking Apply Now buttons

  return (
    <div className="min-h-screen bg-white">
      <Header transparent={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[48vh] sm:min-h-[56vh] lg:min-h-[64vh]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1687422809654-579d81c29d32?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1112)',
            backgroundPosition: 'center right',
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-[#E9FF15] pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Careers</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Become part of our national network — flexible opportunities for shop owners and agents.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pickup Agent Section */}
            <section id="pickup-agent" className="prose max-w-none">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Apply to Become a Pickup Agent</h2>

                  <p className="text-gray-700 mb-6">Join Kenya’s Widest Pickup Point Network</p>

                  <p className="text-gray-600 mb-4">
                    Become part of <strong>ParcelGrid®</strong>, a licensed national courier network by Escrow Courier Networks Ltd, connecting over 400 towns and trading centers across Kenya. As a Pickup Agent, your shop becomes a trusted collection point where customers pick their prepaid or COD parcels conveniently even after work.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Who Can Apply</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 bg-gray-50 p-4 rounded-lg break-words">
                    <li>A physical shop or business premises that is open from 8:00 a.m. to 7:00 p.m.</li>
                    <li>Adequate and secure space to store customer parcels safely.</li>
                    <li>A strong, lockable structure / building (no temporary kiosks).</li>
                    <li>At least one smartphone that can install and use the ParcelGrid Agent App.</li>
                    <li>A business permit or a lease agreement for the premises.</li>
                    <li>A reliable telephone number that can be published on our public pickup list.</li>
                    <li>Readiness to undergo ParcelGrid training and follow operational standards.</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">How You’ll Earn</h3>
                  <p className="text-gray-700 mb-4">Pickup Agents earn commissions for every parcel handled through their location:</p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li className="bg-white p-3 rounded-md shadow-sm break-words">You earn <strong>20% commission</strong> on the net courier fee charged to vendors for every prepaid or Cash on Delivery (COD) parcel collected at your pickup point.</li>
                    <li className="bg-white p-3 rounded-md shadow-sm break-words">Your earnings are automatically credited to your ParcelGrid Agent Wallet in the app. Withdraw anytime to your M-Pesa business line.</li>
                    <li className="bg-white p-3 rounded-md shadow-sm break-words">The more parcels you handle, the more you earn — no limit on your monthly income.</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Benefits of Becoming a Pickup Agent</h3>
                  <ul className="text-gray-700 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <li className="flex items-start space-x-2"><span className="text-green-600">✅</span><span>Increased foot traffic to your shop (boosts your main business).</span></li>
                    <li className="flex items-start space-x-2"><span className="text-green-600">✅</span><span>Listing on our national pickup directory (free marketing for your shop).</span></li>
                    <li className="flex items-start space-x-2"><span className="text-green-600">✅</span><span>Automated COD handling — no chasing payments.</span></li>
                    <li className="flex items-start space-x-2"><span className="text-green-600">✅</span><span>Digital tracking of all parcels via the ParcelGrid Agent App.</span></li>
                    <li className="flex items-start space-x-2"><span className="text-green-600">✅</span><span>Support from our regional coordinators and Nairobi head office.</span></li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Documents Required</h3>
                  <p className="text-gray-700 mb-4">Before approval, you’ll need to upload or attach:</p>

                  <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
                    <li className="bg-gray-50 p-3 rounded">Copy of Business Permit.</li>
                    <li className="bg-gray-50 p-3 rounded">Copy of Shop Lease Agreement or Ownership Proof.</li>
                    <li className="bg-gray-50 p-3 rounded">Clear Photos of the Shop (inside and outside).</li>
                    <li className="bg-gray-50 p-3 rounded">National ID copy of the business owner.</li>
                    <li className="bg-gray-50 p-3 rounded">Active business phone number (for customer contact).</li>
                  </ol>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Training and Activation</h3>
                  <ol className="list-decimal list-inside text-gray-700 mb-6">
                    <li>You’ll receive a training invite from our regional supervisor.</li>
                    <li>You’ll be guided on how to use the ParcelGrid Agent App for parcel check-in, photo uploads, and customer pickups.</li>
                    <li>Your pickup point will be activated on the ParcelGrid map for customers to select during checkout.</li>
                    <li>You’ll start receiving parcels from the nearest hub or Nairobi Hubs within days.</li>
                  </ol>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Important Notes</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-6">
                    <li>Pickup Agents must remain open daily (Mon–Sat, 8 a.m.–7 p.m.).</li>
                    <li>All parcels must be stored in clean, organized, and secure conditions.</li>
                    <li>The agent is responsible for ensuring timely customer communication through the app.</li>
                    <li>Customer payments (COD) are automatically settled via ParcelGrid systems — you do not handle cash directly.</li>
                  </ul>

                        <div className="mt-6 border-t pt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Start Your Application</h4>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
                                                          <small className="text-sm text-gray-500 sm:ml-4">We will review your application and contact you with next steps.</small>

                              <button
                                type="button"
                                onClick={() => setModalMode('pickup')}
                                className="w-full sm:w-auto px-6 py-2 rounded-md bg-[#00473E] text-white font-semibold shadow hover:brightness-110 transition"
                              >
                                Apply Now →
                              </button>
                            </div>
                        </div>
            </section>

            {/* Booking Agent Section */}
            <div className="mt-10 border-t pt-8">
              <section id="booking-agent">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Become a ParcelGrid Booking Agent</h2>

                  <p className="text-gray-700 mb-6">ParcelGrid is expanding its drop-off network in Nairobi CBD, Ngara, Eastleigh, and Gikomba. We’re looking for reliable booking agents to help vendors and customers send parcels to several pickup points across Kenya.</p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">What You’ll Do</h3>
                  <p className="text-gray-700 mb-4">As a ParcelGrid Booking Agent, you’ll collect parcels from senders, book them on the ParcelGrid App, and ensure they are safely handed over to our Nairobi hub team for dispatch.</p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">How You Earn</h3>
                  <p className="text-gray-700 mb-4">You earn 20% commission of courier fees (excluding VAT) for every prepaid and COD parcel you book. All earnings are automatically credited to your ParcelGrid Agent Wallet inside the app. Withdraw your money directly to your M-Pesa business line — payouts are done every week.</p>

                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Minimum Requirements</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>✅ Must be located in Nairobi CBD, Ngara, Eastleigh, or Gikomba</li>
                    <li>✅ Must have at least 20 square feet (about 5ft x 4ft) of safe, dry, and clean space with shelves for storing parcels</li>
                    <li>✅ Must operate on the ground floor of your building for easy access</li>
                    <li>✅ Must open from 9:00am to 7:00pm, Monday to Saturday</li>
                    <li>✅ Must have a smartphone capable of running the ParcelGrid App</li>
                    <li>✅ Must hold a valid business permit</li>
                    <li>✅ Must be the actual shop owner — no brokers or employees applying on behalf of owners</li>
                    <li>✅ Must ensure the premises are secure, visible, and accessible to customers</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Documents to Upload</h3>
                  <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                    <li>Copy of Business Permit</li>
                    <li>Shop Lease Agreement or Proof of Ownership</li>
                    <li>Clear Photos of the Shop (front and interior showing storage shelves)</li>
                    <li>Copy of National ID</li>
                    <li>Active Business Phone Number (will appear on ParcelGrid platforms)</li>
                  </ol>

                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Why Join ParcelGrid</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>Earn steady weekly income through digital bookings</li>
                    <li>Join a licensed national courier network trusted by thousands of online vendors</li>
                    <li>Enjoy full transparency through your ParcelGrid Agent Wallet</li>
                    <li>Get professional training and support from our Nairobi operations team</li>
                  </ul>

                  <div className="mt-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-gray-600 mb-0">Only businesses within Nairobi CBD, Ngara, Eastleigh, or Gikomba are eligible.</p>
                    <button
                      type="button"
                      onClick={() => setModalMode('booking')}
                      className="w-full sm:w-auto px-6 py-2 rounded-md bg-[#00473E] text-white font-semibold shadow hover:brightness-110 transition"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
                </section>
            </div>
        </div>
      </section>

      {/* Modal for Applications */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalMode(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl z-10 max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#00473E] to-[#006644] px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{modalMode === 'pickup' ? 'Pickup Agent Application' : 'Booking Agent Application'}</h3>
                <button onClick={() => setModalMode(null)} className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition">×</button>
              </div>
              <p className="text-white/90 mt-2 text-sm">
                {modalMode === 'pickup' 
                  ? 'Join our network of pickup points across Kenya' 
                  : 'Help expand our drop-off network in Nairobi'
                }
              </p>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">

              {modalMode === 'pickup' ? (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00473E] focus:border-transparent transition-colors" placeholder="Enter your full name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00473E] focus:border-transparent transition-colors" placeholder="+254 700 000 000" name="phone" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00473E] focus:border-transparent transition-colors" placeholder="your.email@example.com" name="email" />
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Required Documents</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Business Permit *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00473E] transition-colors">
                          <input type="file" name="businessPermit" accept=".pdf,image/*" className="w-full" />
                          <p className="text-xs text-gray-500 mt-1">PDF or Image files</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Lease Agreement *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00473E] transition-colors">
                          <input type="file" name="ownershipProof" accept=".pdf,image/*" className="w-full" />
                          <p className="text-xs text-gray-500 mt-1">PDF or Image files</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Shop Photos *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00473E] transition-colors">
                          <input type="file" name="shopPhotos" accept="image/*" multiple className="w-full" />
                          <p className="text-xs text-gray-500 mt-1">Multiple images (inside & outside)</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">National ID *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00473E] transition-colors">
                          <input type="file" name="nationalId" accept="image/*,.pdf" className="w-full" />
                          <p className="text-xs text-gray-500 mt-1">PDF or Image files</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button type="submit" className="flex-1 px-8 py-4 bg-gradient-to-r from-[#00473E] to-[#006644] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                      Submit Application
                    </button>
                    <button type="button" onClick={() => setModalMode(null)} className="px-6 py-4 text-gray-600 font-medium hover:text-gray-800 transition-colors">Cancel</button>
                  </div>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00473E] focus:border-transparent transition-colors" placeholder="Enter your full name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00473E] focus:border-transparent transition-colors" placeholder="+254 700 000 000" name="phone" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00473E] focus:border-transparent transition-colors" placeholder="your.email@example.com" name="email" />
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Required Documents</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Business Permit *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00473E] transition-colors">
                          <input type="file" name="businessPermit" accept=".pdf,image/*" className="w-full" />
                          <p className="text-xs text-gray-500 mt-1">PDF or Image files</p>
                        </div>
                      </div>
                      
                  
                      
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Shop Photos *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00473E] transition-colors">
                          <input type="file" name="shopPhotos" accept="image/*" multiple className="w-full" />
                          <p className="text-xs text-gray-500 mt-1">Multiple images (inside & outside)</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">National ID *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00473E] transition-colors">
                          <input type="file" name="nationalId" accept="image/*,.pdf" className="w-full" />
                          <p className="text-xs text-gray-500 mt-1">PDF or Image files</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button type="submit" className="flex-1 px-8 py-4 bg-gradient-to-r from-[#00473E] to-[#006644] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                      Submit Application
                    </button>
                    <button type="button" onClick={() => setModalMode(null)} className="px-6 py-4 text-gray-600 font-medium hover:text-gray-800 transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <DownloadCTA />
      <Footer />
    </div>
  );
};

export default CareersPage;
