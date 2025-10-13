import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add your form submission logic here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section (background image only here) */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')`
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We're here to help! Get in touch with our team for support, partnerships, or any questions about ParcelGrid.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Phone Support */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-[#00473E]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-3">Call us directly</p>
            <div className="space-y-1">
              <p className="font-medium text-[#00473E]">0745 111 555</p>
              <p className="font-medium text-[#00473E]">0794 333 888</p>
            </div>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#00473E]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-3">Send us an email</p>
            <p className="font-medium text-[#00473E]">info@escrowcourier.com</p>
          </div>

          {/* WhatsApp Support */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-[#00473E]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600 mb-3">Chat with us</p>
            <div className="space-y-1">
              <p className="font-medium text-[#00473E]">0745 111 555</p>
              <p className="font-medium text-[#00473E]">0794 333 888</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-[#00473E]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
            <p className="text-gray-600 mb-3">We're available</p>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-[#00473E]">Mon - Fri: 8:00 AM - 6:00 PM</p>
              <p className="font-medium text-[#00473E]">Sat: 9:00 AM - 4:00 PM</p>
              <p className="text-gray-500">Sun: Closed</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#00473E] focus:ring-2 focus:ring-[#00473E]/20 outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#00473E] focus:ring-2 focus:ring-[#00473E]/20 outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#00473E] focus:ring-2 focus:ring-[#00473E]/20 outline-none transition-colors"
                    placeholder="0700 000 000"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#00473E] focus:ring-2 focus:ring-[#00473E]/20 outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="pickup-agent">Become a Pickup Agent</option>
                    <option value="booking-agent">Become a Booking Agent</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#00473E] focus:ring-2 focus:ring-[#00473E]/20 outline-none transition-colors resize-y"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00473E] text-white py-3 px-6 rounded-lg hover:bg-[#005d4f] transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Office Locations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Office Locations</h2>
            
            {/* Moi Avenue Branch */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#E9FF15] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#00473E]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Moi Avenue Branch</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Iconic Business Plaza, Ground Floor, Shop no: G13<br />
                    Moi Avenue, Between Sasa Mall and Sawa Mall<br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>

            {/* Taveta Road Branch */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#E9FF15] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#00473E]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Taveta Road Branch</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Jithada Shopping Complex, Ground Floor, Shop no: F7<br />
                    Taveta Road, Next to Taveta Shopping Mall<br />
                    Opposite Samagat Building<br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-[#00473E] to-[#006644] rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Need Quick Help?</h3>
              <div className="space-y-3">
                <a
                  href="/faq"
                  className="block text-white/90 hover:text-white transition-colors"
                >
                  → Check our FAQ section
                </a>
                <a
                  href="/pickup-points"
                  className="block text-white/90 hover:text-white transition-colors"
                >
                  → Learn how to use the app
                </a>
                <a
                  href="/#pickup-points"
                  className="block text-white/90 hover:text-white transition-colors"
                >
                  → Find pickup points near you
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;