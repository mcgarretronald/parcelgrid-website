import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const faqData = [
    {
      category: "About ParcelGrid",
      items: [
        {
          id: "q1",
          question: "What is ParcelGrid?",
          answer: "ParcelGrid® is a registered trademark of Escrow Courier Networks Limited, a licensed courier company regulated by the Communications Authority of Kenya (CAK). We provide a delivery infrastructure with drop-off points in Nairobi and pickup points across 413+ towns in Kenya."
        },
        {
          id: "q2", 
          question: "Where are you located?",
          answer: (
            <div>
              <p>We currently serve vendors in Nairobi. Our drop-off branches are:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>📍 Moi Avenue Branch – Iconic Business Plaza, Ground Floor</li>
                <li>📍 Taveta Road Branch – Jitihada Shopping Complex, next to Taveta Shopping Mall, Ground Floor</li>
              </ul>
            </div>
          )
        }
      ]
    },
    {
      category: "Pickup & Drop-Off Points",
      items: [
        {
          id: "q3",
          question: "What is a pickup point?",
          answer: "A pickup point is a local shop or business where customers go to collect their parcels at their convenience."
        },
        {
          id: "q4",
          question: "Where do I drop off my parcels as a vendor?",
          answer: "Vendors can drop off parcels at our Moi Avenue or Taveta Road branches in Nairobi."
        },
        {
          id: "q5",
          question: "How many pickup points do you have?",
          answer: "We currently have 413+ verified pickup points across Kenya, and the network is growing."
        }
      ]
    },
    {
      category: "Deliveries & Payments",
      items: [
        {
          id: "q6",
          question: "Do you handle both prepaid and Cash on Delivery (COD)?",
          answer: "✅ Yes. When booking a parcel, the vendor chooses whether it's Prepaid or COD."
        },
        {
          id: "q7",
          question: "How does COD work with ParcelGrid?",
          answer: (
            <ol className="list-decimal ml-6">
              <li>The app prompts you to enter the exact amount to collect.</li>
              <li>At pickup, the customer receives an M-Pesa STK prompt for that amount.</li>
              <li>Once payment is successful, the parcel is released.</li>
              <li>The money reflects instantly in your ParcelGrid wallet, minus a 1.8% handling fee.</li>
            </ol>
          )
        },
        {
          id: "q8",
          question: "What does the 1.8% COD handling fee cover?",
          answer: (
            <ul className="list-disc ml-6">
              <li>💳 Secure M-Pesa collection from the customer.</li>
              <li>📲 Instant credit to your ParcelGrid wallet.</li>
              <li>⚡ Direct transfer to your M-Pesa number.</li>
              <li>🛡️ Safe, reliable COD systems, with fraud prevention and support included.</li>
            </ul>
          )
        },
        {
          id: "q9",
          question: "How do prepaid deliveries work?",
          answer: "For prepaid parcels, the customer has already paid the vendor before shipping. ParcelGrid delivers the parcel to the pickup point and releases it when the customer shows their release code."
        }
      ]
    },
    {
      category: "Settlements & Wallet",
      items: [
        {
          id: "q10",
          question: "When do I get my money after COD?",
          answer: "Immediately. COD payments reflect instantly in your ParcelGrid wallet after the customer pays."
        },
        {
          id: "q11",
          question: "How do I withdraw my money?",
          answer: "You can withdraw directly from your ParcelGrid wallet to your M-Pesa number anytime, instantly."
        },
        {
          id: "q12",
          question: "Can I link my bank account?",
          answer: "❌ No. For now, withdrawals are only supported to M-Pesa."
        }
      ]
    },
    {
      category: "Technology & Notifications",
      items: [
        {
          id: "q13",
          question: "How will I and my customers know the status of parcels?",
          answer: (
            <ul className="list-disc ml-6">
              <li>Vendor notified when parcel is dropped off.</li>
              <li>Customer notified when parcel arrives at pickup point.</li>
              <li>Reminders sent when parcel is ready for collection.</li>
              <li>Vendor notified once parcel is collected (with COD payment confirmation if applicable).</li>
            </ul>
          )
        },
        {
          id: "q14",
          question: "Is there a mobile app?",
          answer: "✅ Yes. The ParcelGrid app is available for Android and iOS. It allows vendors to book parcels, choose Prepaid or COD, track deliveries, and withdraw money instantly."
        }
      ]
    },
    {
      category: "Licensing & Trust",
      items: [
        {
          id: "q15",
          question: "Are you licensed?",
          answer: "✅ Yes. Escrow Courier Networks Limited (the company behind ParcelGrid) is licensed by the Communications Authority of Kenya (CAK) under License No. PL-025-0658."
        },
        {
          id: "q16",
          question: "How is ParcelGrid different from other couriers?",
          answer: (
            <ul className="list-disc ml-6">
              <li>Widest pickup network in Kenya (413+ points).</li>
              <li>Instant COD settlements to M-Pesa.</li>
              <li>Transparent 1.8% fee, no hidden charges.</li>
              <li>Smart notifications to keep vendors and customers informed.</li>
              <li>Built for online vendors, not general courier services.</li>
            </ul>
          )
        }
      ]
    },
    {
      category: "Getting Started",
      items: [
        {
          id: "q17",
          question: "How do I join ParcelGrid as a vendor?",
          answer: (
            <ol className="list-decimal ml-6">
              <li>Download the ParcelGrid app.</li>
              <li>Sign up as a vendor.</li>
              <li>Start booking parcels and dropping them off at our Nairobi branches.</li>
            </ol>
          )
        },
        {
          id: "q18",
          question: "Is there a cost to join?",
          answer: "❌ No registration fees. You only pay delivery fees + the 1.8% handling fee on COD transactions."
        },
        {
          id: "q19",
          question: "How do I contact support?",
          answer: (
            <div>
              <ul className="list-disc ml-6">
                <li>📞 Customer Care Number: 0745 111 555/ 0794 333 888</li>
                <li>WhatsApp: 0745 111 555/ 0794 333 888</li>
                <li>📧 Email: info@escrowcourier.com</li>
                <li>Or directly through the support section in the app.</li>
              </ul>
              <p className="mt-2 font-semibold text-[#00473E]">"Get the ParcelGrid App"</p>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Title and Subheading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#00473E] mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about ParcelGrid's delivery services, pickup points, and how we help vendors reach customers across Kenya.
        </p>
      </div>

      {faqData.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-8">
          <h3 className="text-2xl font-bold text-[#00473E] mb-4">{category.category}</h3>
          <div className="space-y-3">
            {category.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-[#00473E] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#00473E] flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-4 text-gray-700 border-t border-gray-100">
                    {typeof item.answer === 'string' ? (
                      <p className="pt-3">{item.answer}</p>
                    ) : (
                      <div className="pt-3">{item.answer}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
