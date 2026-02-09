import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const BookingAgentPage: React.FC = () => {
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
      const response = await fetch('https://app.escrowcourier.com/support-services/api/booking-agent-requests', {
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Booking Agent Opportunities</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Expand our drop-off network in Nairobi and earn commission on every parcel booked.
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
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Become a ParcelGrid Booking Agent</h2>

            <p className="text-gray-700 mb-6">ParcelGrid is expanding its drop-off network in Nairobi CBD, Ngara, Eastleigh, and Gikomba. We're looking for reliable booking agents to help vendors and customers send parcels to several pickup points across Kenya.</p>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">What You'll Do</h3>
            <p className="text-gray-700 mb-4">As a ParcelGrid Booking Agent, you'll collect parcels from senders, book them on the ParcelGrid App, and ensure they are safely handed over to our Nairobi hub team for dispatch.</p>

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
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto px-6 py-2 rounded-md bg-[#00473E] text-white font-semibold shadow hover:brightness-110 transition"
                >
                  Apply Now
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
                <h3 className="text-2xl font-bold">Booking Agent Application</h3>
                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition">×</button>
              </div>
              <p className="text-white/90 mt-2 text-sm">
                Help expand our drop-off network in Nairobi
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

export default BookingAgentPage;
