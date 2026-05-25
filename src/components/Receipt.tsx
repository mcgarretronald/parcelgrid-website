import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

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
  const [courierPaymentRef, setCourierPaymentRef] = useState<string>('Loading...');

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
            contact: matchedAgent.shopAttendantMobileNumber
              || matchedAgent.shop_attendant_mobile_number
              || matchedAgent.phone 
              || matchedAgent.phoneNumber 
              || matchedAgent.phone_number 
              || matchedAgent.contact 
              || matchedAgent.mobile 
              || '+254XXXXXXXXX',
            location: matchedAgent.fullDetailedAddress 
              || matchedAgent.full_detailed_address
              || matchedAgent.detailedAddress 
              || matchedAgent.detailed_address 
              || matchedAgent.address 
              || matchedAgent.location 
              || `${matchedAgent.town || ''}, ${matchedAgent.county || ''}`.trim()
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

  // Fetch courier payment reference from orders API
  useEffect(() => {
    const fetchCourierPaymentRef = async () => {
      const trackingNo = 
        orderData?.trackingNo || 
        orderData?.['Tracking Number'] || 
        orderData?.trackingNumber || 
        '';

      if (!trackingNo) {
        setCourierPaymentRef('N/A');
        return;
      }

      try {
        const response = await fetch('https://app.escrowcourier.com/order-services/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const orders = await response.json();
        const matchingOrder = orders.find((order: any) => 
          order.trackingnumber === trackingNo || 
          order.trackingNumber === trackingNo ||
          order.trackingno === trackingNo
        );

        if (matchingOrder && matchingOrder.courierPaymentReference) {
          setCourierPaymentRef(matchingOrder.courierPaymentReference);
        } else {
          setCourierPaymentRef('N/A');
        }
      } catch (error) {
        console.error('Error fetching courier payment reference:', error);
        setCourierPaymentRef('N/A');
      }
    };

    fetchCourierPaymentRef();
  }, [orderData]);

  const handleDownload = async () => {
    console.log('Download button clicked!');
    if (!receiptRef.current) {
      console.log('No receiptRef found');
      return;
    }

    try {
      console.log('Starting PDF generation...');

      console.log('Generating canvas...');
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      console.log('Canvas generated successfully');

      // Convert to PDF
      console.log('Converting to PDF...');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions based on canvas size (with small margins)
      const margin = 5; // 5mm margin
      const imgWidthMM = (canvas.width * 25.4) / (96 * 2); // Convert pixels to mm (96 DPI, scale 2)
      const imgHeightMM = (canvas.height * 25.4) / (96 * 2);
      
      const pdfWidth = imgWidthMM + (2 * margin);
      const pdfHeight = imgHeightMM + (2 * margin);

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidthMM, imgHeightMM);

      const filename = `receipt-${orderData.trackingNo || orderData.trackingNumber || 'order'}.pdf`;
      console.log('Saving PDF:', filename);
      pdf.save(filename);
      console.log('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  // Debug: Log the orderData to see its structure
  console.log('Receipt orderData:', orderData);
  console.log('OrderData keys:', Object.keys(orderData || {}));

  // Extract data from orderData - handle nested structure and formData
  // For preview mode, data comes directly from bookingData/formData
  const trackingNo = orderData.trackingNo 
    || orderData.trackingNumber
    || orderData.tracking_no 
    || orderData.tracking_number
    || orderData.data?.trackingNo 
    || orderData.data?.trackingNumber
    || orderData.data?.tracking_no
    || orderData.data?.tracking_number
    || orderData.data?.order?.[0]?.trackingNo
    || orderData.data?.order?.[0]?.trackingNumber
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
    
  const amountToCollect = '0.00';
    
  const deliveryFee = orderData.deliveryFee 
    || orderData.delivery_fee 
    || orderData.shippingCharges
    || orderData.data?.deliveryFee
    || orderData.data?.shippingCharges
    || orderData.data?.order?.[0]?.deliveryFee
    || orderData.data?.order?.[0]?.shippingCharges
    || '200.00';
    
  const paymentReference = courierPaymentRef;

  const currentDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide" style={{ backgroundColor: '#ffffff' }}>
        <div ref={receiptRef} data-receipt-content className="p-6" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="w-44 h-44 rounded-xl flex items-center justify-center p-3" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff' }}>
              <QRCodeSVG 
                value={trackingNo} 
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {/* Company Info with Logo - Centered */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="flex items-center gap-3 mb-3">
              <img src="/logo2.png" alt="ParcelGrid Courier Service Logo" width="48" height="48" className="w-12 h-12 object-contain" />
              <div className="text-left">
                <h1 className="text-xl font-bold leading-tight whitespace-nowrap" style={{ color: '#000000' }}>ESCROW COURIER</h1>
                <p className="text-sm" style={{ color: '#000000' }}>www.escrowcourier.com</p>
              </div>
            </div>
          </div>

          <p className="text-sm mb-4 pb-3 text-center" style={{ color: '#4b5563' }}>TEL: 0745 111 555 {currentDate}</p>

          {/* Customer Details */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <h2 className="font-bold text-lg mb-2" style={{ color: '#000000' }}>Customer Details</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Recipient's Name</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Recipient's Phone</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Recipient's Address</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Sender Details */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <h2 className="font-bold text-lg mb-2" style={{ color: '#000000' }}>Sender Details</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Name</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Business Name</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{vendorBusiness}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Phone Number</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{vendorPhone}</span>
              </div>
            </div>
          </div>

          {/* Pickup Point */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <h2 className="font-bold text-lg mb-2" style={{ color: '#000000' }}>Pickup Point</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Business Name</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{pickupPointDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Contact</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{pickupPointDetails.contact}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Location</span>
                <span className="font-medium text-right max-w-[60%]" style={{ color: '#000000' }}>{pickupPointDetails.location}</span>
              </div>
            </div>
          </div>

          {/* Parcel Summary */}
          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <h2 className="font-bold text-lg mb-2" style={{ color: '#000000' }}>Parcel Summary</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Tracking Number</span>
                <span className="font-bold text-right" style={{ color: '#000000' }}>{trackingNo}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Packaging Condition</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{packageCondition} {packageCondition === 'Fragile' && '⚠️'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Payment Reference</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Weight</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{weightRange}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#4b5563' }}>Payment Status</span>
                <span className="font-medium text-right" style={{ color: '#000000' }}>{paymentStatus}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span style={{ color: '#000000' }}>Amount to Collect</span>
                <span className="text-right" style={{ color: '#000000' }}>KES {amountToCollect}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span style={{ color: '#000000' }}>Delivery Fee</span>
                <span className="text-right" style={{ color: '#000000' }}>KES {deliveryFee}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div style={{ backgroundColor: '#fefce8', borderLeft: '4px solid #facc15' }} className="p-3 flex items-start gap-2">
            <span style={{ color: '#ca8a04' }} className="text-xl">⚠️</span>
            <p className="text-sm italic" style={{ color: '#374151' }}>Do NOT Pay Cash to the Pickup Agent</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex gap-3" style={{ borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleDownload}
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#00473E', color: '#ffffff' }}
          >
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
