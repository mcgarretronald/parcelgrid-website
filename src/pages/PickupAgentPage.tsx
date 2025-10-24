import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const PickupAgentPage: React.FC = () => {
  useScrollToTop();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://app.escrowcourier.com/support-services/api/pickup-agent-requests', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        e.currentTarget.reset();
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Pickup Agent Opportunities</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Join Kenya's widest pickup point network and earn commission on every parcel handled.
          </p>
          <div className="mt-6">
            <Link 
              to="/opportunities" 
              className="text-white hover:text-[#E9FF15] transition-colors inline-flex items-center gap-2"
            >
              ← Back to All Opportunities
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="prose max-w-none">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Apply to Become a Pickup Agent</h2>

            <p className="text-gray-700 mb-6">Join Kenya's Widest Pickup Point Network</p>

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

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">How You'll Earn</h3>
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
            <p className="text-gray-700 mb-4">Before approval, you'll need to upload or attach:</p>

            <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
              <li className="bg-gray-50 p-3 rounded">Copy of Business Permit.</li>
              <li className="bg-gray-50 p-3 rounded">Copy of Shop Lease Agreement or Ownership Proof.</li>
              <li className="bg-gray-50 p-3 rounded">Clear Photos of the Shop (inside and outside).</li>
              <li className="bg-gray-50 p-3 rounded">National ID copy of the business owner.</li>
              <li className="bg-gray-50 p-3 rounded">Active business phone number (for customer contact).</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Training and Activation</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-6">
              <li>You'll receive a training invite from our regional supervisor.</li>
              <li>You'll be guided on how to use the ParcelGrid Agent App for parcel check-in, photo uploads, and customer pickups.</li>
              <li>Your pickup point will be activated on the ParcelGrid map for customers to select during checkout.</li>
              <li>You'll start receiving parcels from the nearest hub or Nairobi Hubs within days.</li>
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
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto px-6 py-2 rounded-md bg-[#00473E] text-white font-semibold shadow hover:brightness-110 transition"
                >
                  Apply Now →
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Modal for Application */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl z-10 max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#00473E] to-[#006644] px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Pickup Agent Application</h3>
                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition">×</button>
              </div>
              <p className="text-white/90 mt-2 text-sm">
                Join our network of pickup points across Kenya
              </p>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">✓ Application submitted successfully!</p>
                  <p className="text-green-700 text-sm mt-1">We will review your application and contact you soon.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">✗ Submission failed</p>
                  <p className="text-red-700 text-sm mt-1">Please try again or contact support.</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-[#00473E] to-[#006644] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-4 text-gray-600 font-medium hover:text-gray-800 transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DownloadCTA />
      <Footer />
    </div>
  );
};

export default PickupAgentPage;
