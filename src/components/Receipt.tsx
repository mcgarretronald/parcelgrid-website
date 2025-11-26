import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

interface ReceiptProps {
  orderData: any;
  onClose: () => void;
}

interface PickupPointDetails {
  name: string;
  contact: string;
  location: string;
}

const Receipt: React.FC<ReceiptProps> = ({ orderData, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [pickupPointDetails, setPickupPointDetails] = useState<PickupPointDetails>({
    name: 'Loading...',
    contact: '+254XXXXXXXXX',
    location: 'Loading...'
  });

  useEffect(() => {
    const fetchPickupPointDetails = async () => {
      const pickupPointId = orderData.pickupPoint 
        || orderData.pickupPointId 
        || orderData.pickup_point_id
        || orderData.data?.pickupPointId
        || orderData.data?.pickupPoint;

      if (!pickupPointId) {
        setPickupPointDetails({
          name: 'N/A',
          contact: '+254XXXXXXXXX',
          location: 'N/A'
        });
        return;
      }

      try {
        const response = await fetch('https://app.escrowcourier.com/website-backend-services/api/pickup-points');
        if (!response.ok) {
          throw new Error('Failed to fetch pickup points');
        }

        const data = await response.json();
        const agents = Array.isArray(data) ? data : (data.data || []);
        
        // Find the matching agent by ID
        const matchedAgent = agents.find((agent: any) => 
          String(agent.id) === String(pickupPointId) ||
          String(agent._id) === String(pickupPointId) ||
          String(agent.agentId) === String(pickupPointId)
        );

        if (matchedAgent) {
          setPickupPointDetails({
            name: matchedAgent.name 
              || matchedAgent.businessName 
              || matchedAgent.business_name 
              || matchedAgent.company 
              || 'N/A',
            contact: matchedAgent.phone 
              || matchedAgent.phoneNumber 
              || matchedAgent.phone_number 
              || matchedAgent.contact 
              || '+254XXXXXXXXX',
            location: matchedAgent.address 
              || matchedAgent.location 
              || matchedAgent.county 
              || matchedAgent.town 
              || 'N/A'
          });
        } else {
          setPickupPointDetails({
            name: 'N/A',
            contact: '+254XXXXXXXXX',
            location: 'N/A'
          });
        }
      } catch (error) {
        console.error('Error fetching pickup point details:', error);
        setPickupPointDetails({
          name: 'N/A',
          contact: '+254XXXXXXXXX',
          location: 'N/A'
        });
      }
    };

    fetchPickupPointDetails();
  }, [orderData]);

  const handleDownload = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
        });
        
        const link = document.createElement('a');
        link.download = `receipt-${orderData.trackingNo || 'order'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating receipt:', error);
      }
    }
  };

  // Debug: Log the orderData to see its structure
  console.log('Receipt orderData:', orderData);
  console.log('OrderData keys:', Object.keys(orderData || {}));

  // Extract data from orderData - handle nested structure and formData
  // For preview mode, data comes directly from bookingData/formData
  const trackingNo = orderData.trackingNo 
    || orderData.tracking_no 
    || orderData.data?.trackingNo 
    || orderData.data?.tracking_no
    || orderData.data?.order?.[0]?.trackingNo
    || 'PENDING';
    
  const customerName = orderData.customerName 
    || orderData.customer_name 
    || orderData.data?.customerName
    || orderData.data?.order?.[0]?.customerName
    || 'N/A';
    
  const customerPhone = orderData.customerPhone 
    || orderData.customer_phone 
    || orderData.data?.customerPhone
    || orderData.data?.order?.[0]?.customerPhone
    || 'N/A';
    
  const customerCounty = orderData.customerCounty
    || orderData.customer_county
    || orderData.customerAddress
    || orderData.data?.customerCounty
    || orderData.data?.customerAddress
    || orderData.data?.order?.[0]?.customerCounty
    || 'N/A';
    
  const customerAddress = customerCounty;
  
  const vendorName = orderData.vendorName 
    || orderData.vendor_name 
    || orderData.data?.vendorName
    || orderData.data?.order?.[0]?.vendorName
    || 'N/A';
    
  const vendorBusiness = orderData.vendorBusiness 
    || orderData.vendor_business 
    || orderData.businessName
    || orderData.data?.vendorBusiness
    || orderData.data?.order?.[0]?.vendorBusiness
    || 'N/A';
    
  const vendorPhone = orderData.vendorPhone 
    || orderData.vendor_phone 
    || orderData.data?.vendorPhone
    || orderData.data?.order?.[0]?.vendorPhone
    || 'N/A';
    
  const isFragile = orderData.isFragile 
    || orderData.is_fragile 
    || orderData.data?.isFragile
    || orderData.data?.order?.[0]?.isFragile
    || false;
    
  const packageCondition = isFragile ? 'Fragile' : 'Standard';
  
  const weightRange = orderData.weightRange 
    || orderData.weight_range 
    || orderData.data?.weightRange
    || orderData.data?.order?.[0]?.weightRange
    || '0 - 4 KG';
    
  const paymentStatus = orderData.paymentStatus 
    || orderData.payment_status
    || orderData.data?.paymentStatus
    || 'Pre-paid';
    
  const amountToCollect = orderData.packageValue
    || orderData.package_value
    || orderData.parcelValue
    || orderData.amountToCollect 
    || orderData.amount_to_collect 
    || orderData.data?.packageValue
    || orderData.data?.amountToCollect
    || orderData.data?.order?.[0]?.packageValue
    || orderData.data?.order?.[0]?.parcelValue
    || '0.00';
    
  const deliveryFee = orderData.deliveryFee 
    || orderData.delivery_fee 
    || orderData.shippingCharges
    || orderData.data?.deliveryFee
    || orderData.data?.shippingCharges
    || orderData.data?.order?.[0]?.deliveryFee
    || orderData.data?.order?.[0]?.shippingCharges
    || '200.00';
    
  const paymentReference = orderData.paymentReference 
    || orderData.payment_reference 
    || orderData.data?.paymentReference
    || orderData.data?.order?.[0]?.paymentReference
    || 'PENDING';

  const currentDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div ref={receiptRef} className="p-6 bg-white">
          {/* QR Code Placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <rect x="0" y="0" width="20" height="20" fill="black"/>
                <rect x="25" y="0" width="5" height="5" fill="black"/>
                <rect x="35" y="0" width="10" height="10" fill="black"/>
                <rect x="50" y="0" width="5" height="15" fill="black"/>
                <rect x="60" y="0" width="10" height="5" fill="black"/>
                <rect x="75" y="0" width="5" height="10" fill="black"/>
                <rect x="80" y="0" width="20" height="20" fill="black"/>
                <rect x="0" y="25" width="5" height="15" fill="black"/>
                <rect x="10" y="30" width="10" height="5" fill="black"/>
                <rect x="25" y="25" width="15" height="10" fill="black"/>
                <rect x="45" y="30" width="10" height="5" fill="black"/>
                <rect x="60" y="25" width="5" height="15" fill="black"/>
                <rect x="70" y="30" width="10" height="10" fill="black"/>
                <rect x="85" y="25" width="15" height="5" fill="black"/>
                <rect x="0" y="45" width="10" height="10" fill="black"/>
                <rect x="15" y="50" width="15" height="5" fill="black"/>
                <rect x="35" y="45" width="5" height="15" fill="black"/>
                <rect x="45" y="50" width="10" height="10" fill="black"/>
                <rect x="60" y="45" width="15" height="5" fill="black"/>
                <rect x="80" y="50" width="10" height="10" fill="black"/>
                <rect x="0" y="65" width="5" height="15" fill="black"/>
                <rect x="10" y="70" width="15" height="10" fill="black"/>
                <rect x="30" y="65" width="10" height="5" fill="black"/>
                <rect x="45" y="70" width="5" height="10" fill="black"/>
                <rect x="55" y="65" width="15" height="15" fill="black"/>
                <rect x="75" y="70" width="10" height="5" fill="black"/>
                <rect x="90" y="65" width="10" height="10" fill="black"/>
                <rect x="0" y="80" width="20" height="20" fill="black"/>
                <rect x="25" y="85" width="15" height="5" fill="black"/>
                <rect x="45" y="80" width="10" height="15" fill="black"/>
                <rect x="60" y="85" width="5" height="10" fill="black"/>
                <rect x="70" y="80" width="10" height="5" fill="black"/>
                <rect x="80" y="80" width="20" height="20" fill="black"/>
              </svg>
            </div>
          </div>

          {/* Company Info */}
          <div className="flex items-center gap-3 mb-4 border-b pb-4">
            <div className="w-12 h-12 bg-[#00473E] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-9l1.96 2.5H17V9h2.5zm-1.5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">ESCROW COURIER</h1>
              <p className="text-sm text-gray-600">www.escrowcourier.com</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">TEL: 0745 111 555 {currentDate}</p>

          {/* Customer Details */}
          <div className="mb-4 border-b pb-4">
            <h2 className="font-bold text-lg mb-2">Customer Details</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient's Name</span>
                <span className="font-medium text-right">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient's Phone</span>
                <span className="font-medium text-right">{customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient's Address</span>
                <span className="font-medium text-right">{customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Sender Details */}
          <div className="mb-4 border-b pb-4">
            <h2 className="font-bold text-lg mb-2">Sender Details</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-right">{vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name</span>
                <span className="font-medium text-right">{vendorBusiness}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number</span>
                <span className="font-medium text-right">{vendorPhone}</span>
              </div>
            </div>
          </div>

          {/* Pickup Point */}
          <div className="mb-4 border-b pb-4">
            <h2 className="font-bold text-lg mb-2">Pickup Point</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name</span>
                <span className="font-medium text-right">{pickupPointDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact</span>
                <span className="font-medium text-right">{pickupPointDetails.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-right max-w-[60%]">{pickupPointDetails.location}</span>
              </div>
            </div>
          </div>

          {/* Parcel Summary */}
          <div className="mb-4 border-b pb-4">
            <h2 className="font-bold text-lg mb-2">Parcel Summary</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking Number</span>
                <span className="font-bold text-right">{trackingNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Packaging Condition</span>
                <span className="font-medium text-right">{packageCondition} {packageCondition === 'Fragile' && '⚠️'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Reference</span>
                <span className="font-medium text-right">{paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight</span>
                <span className="font-medium text-right">{weightRange}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium text-right">{paymentStatus}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Amount to Collect</span>
                <span className="text-right">KES {amountToCollect}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Delivery Fee</span>
                <span className="text-right">KES {deliveryFee}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 flex items-start gap-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <p className="text-sm italic text-gray-700">Do NOT Pay Cash to the Pickup Agent</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-[#00473E] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#00473E]/90 transition-colors"
          >
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
