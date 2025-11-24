import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, ArrowRight, Package, User, MapPin, CheckCircle } from 'lucide-react';
import { useAgentData } from '../components/Map/GoogleMap';

interface FormData {
  // Vendor Info
  vendorName: string;
  vendorPhone: string;
  
  // Customer Info
  customerName: string;
  customerPhone: string;
  customerCounty: string;
  pickupPoint: string;
  
  // Package Details
  packageType: string;
  packageTypeOther: string;
  weightRange: string;
  packageValue: string;
  isFragile: boolean;
  isSpillProne: boolean;
  specialInstructions: string;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Add custom CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce-slow {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      @keyframes float {
        0%, 100% {
          transform: translateY(0) translateX(0);
        }
        25% {
          transform: translateY(-10px) translateX(5px);
        }
        50% {
          transform: translateY(-15px) translateX(-5px);
        }
        75% {
          transform: translateY(-10px) translateX(5px);
        }
      }
      @keyframes motion {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(3px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      @keyframes roadAnimation {
        0% {
          transform: translateX(0px);
        }
        100% {
          transform: translateX(-100%);
        }
      }
      @keyframes lampPostAnimation {
        0% {
          transform: translateX(0px);
        }
        100% {
          transform: translateX(calc(-100vw - 90px));
        }
      }
      .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      .delay-300 {
        animation-delay: 0.3s;
      }
      .delay-500 {
        animation-delay: 0.5s;
      }
      .delay-700 {
        animation-delay: 0.7s;
      }
      .delay-1000 {
        animation-delay: 1s;
      }
      
      /* Truck Loader Styles */
      .loader {
        width: 100%;
        max-width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
      }
      
      .truckWrapper {
        width: 100%;
        max-width: 95vw;
        height: 150px;
        display: flex;
        flex-direction: column;
        position: relative;
        align-items: center;
        justify-content: flex-end;
        overflow-x: hidden;
      }
      
      .truckBody {
        width: 40%;
        min-width: 130px;
        height: fit-content;
        margin-bottom: 6px;
        animation: motion 1s linear infinite;
      }
      
      .truckTires {
        width: 40%;
        min-width: 130px;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 10px 0px 15px;
        position: absolute;
        bottom: 0;
      }
      
      .truckTires svg {
        width: 24px;
      }
      
      .road {
        width: 100%;
        height: 1.5px;
        background-color: #282828;
        position: relative;
        bottom: 0;
        align-self: flex-end;
        border-radius: 3px;
      }
      
      .road::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 100%;
        background-color: #282828;
        right: -50%;
        border-radius: 3px;
        animation: roadAnimation 1.4s linear infinite;
        border-left: 10px solid white;
      }
      
      .road::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 100%;
        background-color: #282828;
        right: -65%;
        border-radius: 3px;
        animation: roadAnimation 1.4s linear infinite;
        border-left: 4px solid white;
      }
      
      .lampPost {
        position: absolute;
        bottom: 0;
        right: -90px;
        height: 90px;
        animation: lampPostAnimation 1.4s linear infinite;
      }
      
      /* Desktop view - slower lamp post animation */
      @media (min-width: 768px) {
        .lampPost {
          animation: lampPostAnimation 3s linear infinite;
        }
      }
      
      /* Mobile view - full screen animation section */
      @media (max-width: 1023px) {
        .mobile-animation-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
      }
      
      /* Animated Scroll Indicator */
      .scrolldown {
        --color: #E9FF15;
        --sizeX: 24px;
        --sizeY: 40px;
        position: relative;
        width: var(--sizeX);
        height: var(--sizeY);
        border: calc(var(--sizeX) / 10) solid var(--color);
        border-radius: 50px;
        box-sizing: border-box;
        margin: 0 auto;
        cursor: pointer;
      }
      
      @media (min-width: 1024px) {
        .scrolldown {
          --sizeX: 30px;
          --sizeY: 50px;
        }
      }

      .scrolldown::before {
        content: "";
        position: absolute;
        top: 30px;
        left: 50%;
        width: 6px;
        height: 6px;
        margin-left: -3px;
        background-color: var(--color);
        border-radius: 100%;
        animation: scrolldown-anim 2s infinite;
        box-sizing: border-box;
        box-shadow: 0px 5px 3px 1px rgba(233, 255, 21, 0.4);
      }

      @keyframes scrolldown-anim {
        0% {
          opacity: 0;
          height: 6px;
        }
        40% {
          opacity: 1;
          height: 10px;
        }
        80% {
          transform: translate(0, -20px);
          height: 10px;
          opacity: 0;
        }
        100% {
          height: 3px;
          opacity: 0;
        }
      }

      .chevrons {
        padding: 6px 0 0 0;
        margin-left: -3px;
        margin-top: 48px;
        width: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .chevrondown {
        margin-top: -6px;
        position: relative;
        border: solid var(--color);
        border-width: 0 3px 3px 0;
        display: inline-block;
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
      }

      .chevrondown:nth-child(odd) {
        animation: pulse54012 500ms ease infinite alternate;
      }

      .chevrondown:nth-child(even) {
        animation: pulse54012 500ms ease infinite alternate 250ms;
      }

      @keyframes pulse54012 {
        from {
          opacity: 0;
        }
        to {
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    vendorName: '',
    vendorPhone: '+254',
    customerName: '',
    customerPhone: '+254',
    customerCounty: '',
    pickupPoint: '',
    packageType: '',
    packageTypeOther: '',
    weightRange: '',
    packageValue: '',
    isFragile: false,
    isSpillProne: false,
    specialInstructions: '',
  });

  const { points } = useAgentData();
  const [filteredPickupPoints, setFilteredPickupPoints] = useState<any[]>([]);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);

  // Filter pickup points based on county - only show active agents
  useEffect(() => {
    if (formData.customerCounty) {
      const filtered = points.filter((point) => {
        // Check if point matches the county/location
        const matchesLocation = point.info?.toLowerCase().includes(formData.customerCounty.toLowerCase());
        
        // Check if agent is active (using rawData which contains original API response)
        const status = point.rawData?.status ?? point.rawData?.accountStatus ?? point.rawData?.active ?? point.rawData?.isActive;
        
        let isActive = true;
        if (typeof status === 'string') {
          isActive = status.toLowerCase() === 'active';
        } else if (typeof status === 'boolean') {
          isActive = status === true;
        }
        // If no status field, include the agent (backward compatibility)
        
        return matchesLocation && isActive;
      });
      setFilteredPickupPoints(filtered);
    } else {
      // Show only active agents when no county filter
      const activePoints = points.filter((point) => {
        const status = point.rawData?.status ?? point.rawData?.accountStatus ?? point.rawData?.active ?? point.rawData?.isActive;
        
        if (typeof status === 'string') {
          return status.toLowerCase() === 'active';
        }
        if (typeof status === 'boolean') {
          return status === true;
        }
        // If no status field, include the agent (backward compatibility)
        return true;
      });
      setFilteredPickupPoints(activePoints);
    }
  }, [formData.customerCounty, points]);

  const packageTypes = [
    'Box',
    'Non-woven bag',
    'Sack',
    'Wrapped with cellotape',
    'Not sealed',
    'Other',
  ];

  const weightRanges = [
    '0-4 KG',
    '4-8 KG',
    '8-12 KG',
    '12-15 KG',
    '15-20 KG',
    '20-25 KG',
    '25-30 KG',
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate delivery fee when both pickupPoint and weightRange are set
  useEffect(() => {
    let active = true;
    // only calculate when both values exist
    if (!formData.pickupPoint || !formData.weightRange) {
      setDeliveryFee(null);
      setFeeError(null);
      setFeeLoading(false);
      return;
    }

    const controller = new AbortController();

    const calculate = async () => {
      setFeeLoading(true);
      setFeeError(null);
      setDeliveryFee(null);

      try {
        // Find the selected pickup point to get distanceFromHQ
        // Look in all points, not just filtered, in case user went back and forward
        const selectedPoint = points.find(
          (point) => String(point.id) === String(formData.pickupPoint)
        );

        // Debug logging
        console.log('Selected pickup point ID:', formData.pickupPoint);
        console.log('Found point object:', selectedPoint);
        console.log('Distance from HQ:', selectedPoint?.distanceFromHQ);
        console.log('Raw data:', selectedPoint?.rawData);

        if (!selectedPoint) {
          setFeeError('Selected pickup point not found');
          setFeeLoading(false);
          return;
        }

        if (!selectedPoint.distanceFromHQ) {
          setFeeError('Distance information not available for this pickup point');
          setFeeLoading(false);
          return;
        }

        // Build payload with weightRange and distance as required
        // Remove " KG" from weight range (e.g., "0-4 KG" becomes "0-4")
        const weightRangeValue = formData.weightRange.replace(/\s*KG$/i, '').trim();
        
        const payload = {
          weightRange: weightRangeValue,
          distance: selectedPoint.distanceFromHQ,
        };

        console.log('Sending payload to pricing API:', payload);

        const resp = await fetch('https://app.escrowcourier.com/website-backend-services/api/calculate-delivery-fee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || `Status ${resp.status}`);
        }

        const data = await resp.json();
        
        console.log('Pricing API response:', data);

        // The pricing API returns totalFee. Also check other common field names as fallback.
        const fee = data?.totalFee ?? data?.fee ?? data?.deliveryFee ?? data?.price ?? data?.amount ?? null;

        if (active) {
          if (typeof fee === 'number') {
            setDeliveryFee(fee);
          } else if (typeof fee === 'string' && !isNaN(Number(fee))) {
            setDeliveryFee(Number(fee));
          } else {
            // If API returned a complex object, try common places
            if (data && typeof data === 'object') {
              // try nested 'data' or 'result'
              const nested = data.data ?? data.result ?? null;
              const nestedFee = nested?.totalFee ?? nested?.fee ?? nested?.amount ?? nested?.price ?? null;
              if (typeof nestedFee === 'number') setDeliveryFee(nestedFee);
              else setFeeError('Unable to parse fee from pricing response');
            } else {
              setFeeError('Unable to parse fee from pricing response');
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Delivery fee error', err);
        if (active) setFeeError(err.message || 'Failed to calculate delivery fee');
      } finally {
        if (active) setFeeLoading(false);
      }
    };

    // small debounce to avoid rapid calls when user is typing
    const timer = setTimeout(calculate, 400);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [formData.pickupPoint, formData.weightRange, points]);

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      // Validate both vendor and customer information on step 1
      return !!(
        formData.vendorName &&
        formData.vendorPhone &&
        formData.vendorPhone.length >= 12 &&
        formData.customerName &&
        formData.customerPhone &&
        formData.customerPhone.length >= 12 &&
        formData.customerCounty &&
        formData.pickupPoint
      );
    }
    if (currentStep === 2) {
      // Validate package information on step 2
      return !!(
        formData.packageType &&
        (formData.packageType !== 'Other' || formData.packageTypeOther) &&
        formData.weightRange &&
        formData.packageValue
      );
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      // Find the selected pickup point to get full details
      const selectedPoint = points.find(
        (point) => String(point.id) === String(formData.pickupPoint)
      );

      // Prepare order payload with correct field names for the API
      const orderPayload = {
        vendorName: formData.vendorName,
        vendorPhone: formData.vendorPhone,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerCounty, // Required field - just the county/location string as entered
        customerCounty: formData.customerCounty,
        pickupPointId: formData.pickupPoint,
        pickupPointName: selectedPoint?.name || '',
        agentId: selectedPoint?.id || formData.pickupPoint, // Required field - using pickup point as agent
        packagingType: formData.packageType === 'Other' ? formData.packageTypeOther : formData.packageType, // Required field (renamed from packageType)
        weightRange: formData.weightRange,
        distanceRange: selectedPoint?.distanceFromHQ || 0, // Required field - distance from HQ
        parcelValue: parseFloat(formData.packageValue), // Required field (renamed from packageValue)
        shippingCharges: deliveryFee || 0, // Required field (renamed from deliveryFee)
        isFragile: formData.isFragile,
        isSpillProne: formData.isSpillProne,
        specialInstructions: formData.specialInstructions,
      };

      console.log('Creating order with payload:', orderPayload);
      // Persist booking form for summary restoration
      localStorage.setItem('currentBookingForm', JSON.stringify(formData));

      // Get auth token from backend server
      let authToken = '';
      try {
        const tokenResponse = await fetch('https://app.escrowcourier.com/website-backend-services/api/auth/token');
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          authToken = tokenData.token || tokenData.access_token || tokenData.bearer_token;
          console.log('Auth token fetched from backend');
        }
      } catch (error) {
        console.warn('Could not fetch auth token:', error);
      }

      // Create order via API
      const response = await fetch('https://app.escrowcourier.com/website-backend-services/api/booking-agent-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to create order: ${response.status}`);
      }

      const orderData = await response.json();
      console.log('=== ORDER CREATED SUCCESSFULLY ===');
      console.log('Full order response:', orderData);
      console.log('Order data type:', typeof orderData);
      console.log('Order data keys:', Object.keys(orderData));
      
      // Log all possible tracking number fields
      console.log('orderData.trackingNo:', orderData.trackingNo);
      console.log('orderData.trackingNumber:', orderData.trackingNumber);
      console.log('orderData.tracking_no:', orderData.tracking_no);
      console.log('orderData.data:', orderData.data);
      console.log('orderData.order:', orderData.order);
      
      if (orderData.data) {
        console.log('orderData.data keys:', Object.keys(orderData.data));
      }

      // Store the complete order response in localStorage for later use
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      localStorage.setItem('currentOrderTimestamp', Date.now().toString());

      // Extract tracking number from various possible locations in the response
      const trackingNo = orderData.trackingNo 
        || orderData.trackingNumber 
        || orderData.tracking_no 
        || orderData.data?.trackingNo 
        || orderData.data?.trackingNumber 
        || orderData.data?.tracking_no
        || orderData.data?.order?.[0]?.trackingNo
        || orderData.data?.order?.[0]?.trackingNumber
        || orderData.order?.trackingNo
        || orderData.order?.trackingNumber;
      
      const orderId = orderData.id || orderData.orderId || orderData._id || orderData.data?.id || orderData.data?.order?.[0]?.id;

      console.log('Extracted tracking number:', trackingNo);
      console.log('Extracted order ID:', orderId);
      console.log('Order data stored in localStorage');
      console.log('=================================');

      // Navigate to payment page with booking data and order response
      navigate('/payment', {
        state: {
          bookingData: {
            ...formData,
            deliveryFee,
          },
          trackingNo: trackingNo,
          orderId: orderId,
          orderData: orderData,
          fromSummary: true,
        },
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Failed to create order: ${error.message || 'Please try again'}`);
    }
  };

  // If returning from payment or localStorage contains previous booking, set step to summary (3)
  useEffect(() => {
    // Check for stale data and clear if older than 1 hour
    const storedTimestamp = localStorage.getItem('currentOrderTimestamp');
    if (storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      const oneHour = 60 * 60 * 1000;
      const now = Date.now();
      
      if (now - timestamp > oneHour) {
        console.log('Clearing stale booking data');
        localStorage.removeItem('currentOrder');
        localStorage.removeItem('currentOrderTimestamp');
        localStorage.removeItem('currentBookingForm');
        return; // Don't restore stale data
      }
    }
    
    const showSummary = location.state?.showSummary;
    if (showSummary) {
      const existing = location.state?.existingData;
      if (existing) {
        setFormData(prev => ({ ...prev, ...existing }));
      } else {
        const stored = localStorage.getItem('currentBookingForm');
        if (stored) {
          try { setFormData(prev => ({ ...prev, ...JSON.parse(stored) })); } catch {}
        }
      }
      setStep(3);
    } else if (!showSummary) {
      // Browser back without state but with persisted form & order
      const stored = localStorage.getItem('currentBookingForm');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // If there is also an order in localStorage, assume user was at summary
          if (localStorage.getItem('currentOrder')) {
            setFormData(prev => ({ ...prev, ...parsed }));
            setStep(3);
          }
        } catch {}
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Animated Illustration */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#00473E] to-[#006644] flex items-center justify-center p-4 lg:p-8 relative overflow-hidden mobile-animation-container">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-[#E9FF15] rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 bg-[#E9FF15] rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-[#E9FF15] rounded-full animate-bounce"></div>
          </div>

          {/* Main Illustration Content */}
          <div className="relative z-10 text-center space-y-4 lg:space-y-8 max-w-lg flex-1 flex flex-col justify-center py-4">
            {/* Motivational Banner */}
            <div className="mb-2 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                BOOK A PARCEL IN UNDER 60 SECONDS.
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-white/90">
                Skip the long process & book a parcel in seconds. Drop Off When You're Ready.
              </p>
            </div>

            {/* Animated Truck Delivery */}
            <div className="relative mx-auto w-full max-w-md my-2 lg:my-0">
              <div className="loader">
                <div className="truckWrapper">
                  <div className="truckBody">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 198 93" className="trucksvg">
                      <path strokeWidth={3} stroke="#282828" fill="#F83D3D" d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" />
                      <path strokeWidth={3} stroke="#282828" fill="#7D7C7C" d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" />
                      <path strokeWidth={2} stroke="#282828" fill="#282828" d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" />
                      <rect strokeWidth={2} stroke="#282828" fill="#FFFCAB" rx={1} height={7} width={5} y={63} x={187} />
                      <rect strokeWidth={2} stroke="#282828" fill="#282828" rx={1} height={11} width={4} y={81} x={193} />
                      <rect strokeWidth={3} stroke="#282828" fill="#DFDFDF" rx="2.5" height={90} width={121} y="1.5" x="6.5" />
                      <rect strokeWidth={2} stroke="#282828" fill="#DFDFDF" rx={2} height={4} width={6} y={84} x={1} />
                    </svg>
                  </div>
                  <div className="truckTires">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tiresvg">
                      <circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
                      <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tiresvg">
                      <circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
                      <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
                    </svg>
                  </div>
                  <div className="road" />
                  <svg xmlSpace="preserve" viewBox="0 0 453.459 453.459" xmlns="http://www.w3.org/2000/svg" id="Capa_1" version="1.1" fill="#000000" className="lampPost">
                    <path d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
h78.747C231.693,100.736,232.77,106.162,232.77,111.694z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature Points */}
            <div className="space-y-2 lg:space-y-3 text-left">
              <div className="flex items-center gap-2 lg:gap-3 text-white text-sm lg:text-base">
                <div className="w-2 h-2 bg-[#E9FF15] rounded-full animate-pulse flex-shrink-0"></div>
                <span>Track your parcel in real-time</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 text-white text-sm lg:text-base">
                <div className="w-2 h-2 bg-[#E9FF15] rounded-full animate-pulse delay-300 flex-shrink-0"></div>
                <span>Instant COD settlements</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 text-white text-sm lg:text-base">
                <div className="w-2 h-2 bg-[#E9FF15] rounded-full animate-pulse delay-700 flex-shrink-0"></div>
                <span>Fast, Secure & Reliable Delivery</span>
              </div>
              
              {/* Animated Scroll Indicator - Only visible on mobile */}
              <div className="lg:hidden mt-4 flex justify-center">
                <div 
                  className="scrolldown"
                  onClick={() => {
                    const formSection = document.querySelector('.lg\\:w-1\\/2.py-8');
                    formSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="chevrons">
                    <div className="chevrondown" />
                    <div className="chevrondown" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto">
            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100">
          {/* Step 1: Vendor & Customer Information Combined */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Vendor Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-[#00473E]" />
                  <h2 className="text-2xl font-bold text-[#00473E]">Vendor/Sender Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor/Sender Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => handleInputChange('vendorName', e.target.value)}
                    placeholder="Enter vendor name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor/Sender Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.vendorPhone}
                    onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                    placeholder="+254712345678"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +254)</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Customer Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-[#00473E]" />
                  <h2 className="text-2xl font-bold text-[#00473E]">Customer Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="+254712345678"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.customerCounty}
                    onChange={(e) => handleInputChange('customerCounty', e.target.value)}
                    placeholder="e.g., Nairobi, Mombasa, Nakuru"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Point <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.pickupPoint}
                    onChange={(e) => handleInputChange('pickupPoint', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00473E] focus:border-transparent"
                  >
                    <option value="">Select a pickup point</option>
                    {filteredPickupPoints.length > 0 ? (
                      filteredPickupPoints.map((point) => (
                        <option key={point.id} value={point.id}>
                          {point.name} - {point.info}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No pickup points found for this county
                      </option>
                    )}
                  </select>
                  {filteredPickupPoints.length === 0 && formData.customerCounty && (
                    <p className="text-xs text-amber-600 mt-1">
                      No pickup points found. Try a different county or contact us.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Package Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-[#00473E]" />
                <h2 className="text-2xl font-bold text-[#00473E]">Package Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.packageType}
                  onChange={(e) => handleInputChange('packageType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00473E] focus:border-transparent"
                >
                  <option value="">Select package type</option>
                  {packageTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {formData.packageType === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specify Package Type <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.packageTypeOther}
                    onChange={(e) => handleInputChange('packageTypeOther', e.target.value)}
                    placeholder="Describe your package type"
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Range <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.weightRange}
                  onChange={(e) => handleInputChange('weightRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00473E] focus:border-transparent"
                >
                  <option value="">Select weight range</option>
                  {weightRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                {/* Delivery fee display */}
                <div className="mt-3">
                  {feeLoading ? (
                    <p className="text-sm text-gray-500">Calculating delivery fee...</p>
                  ) : feeError ? (
                    <p className="text-sm text-amber-600">{feeError}</p>
                  ) : deliveryFee !== null ? (
                    <p className="text-sm text-[#00473E] font-semibold">Estimated delivery fee: KES {deliveryFee.toLocaleString()}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Select pickup point and weight to see delivery fee</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Value (KES) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.packageValue}
                  onChange={(e) => handleInputChange('packageValue', e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full"
                  min="0"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Package Properties</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="fragile"
                    checked={formData.isFragile}
                    onChange={(e) => handleInputChange('isFragile', e.target.checked)}
                    className="w-4 h-4 text-[#00473E] border-gray-300 rounded focus:ring-[#00473E]"
                  />
                  <label htmlFor="fragile" className="text-sm text-gray-700">
                    Fragile
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="spillProne"
                    checked={formData.isSpillProne}
                    onChange={(e) => handleInputChange('isSpillProne', e.target.checked)}
                    className="w-4 h-4 text-[#00473E] border-gray-300 rounded focus:ring-[#00473E]"
                  />
                  <label htmlFor="spillProne" className="text-sm text-gray-700">
                    Spill Prone
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any special handling instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00473E] focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Checkout/Summary */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-[#00473E]" />
                <h2 className="text-2xl font-bold text-[#00473E]">Checkout - Review Your Booking</h2>
              </div>

              <div className="space-y-6">
                {/* Vendor Info Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-[#00473E] mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Vendor Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {formData.vendorName}</p>
                    <p><strong>Phone:</strong> {formData.vendorPhone}</p>
                  </div>
                </div>

                {/* Customer Info Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-[#00473E] mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {formData.customerName}</p>
                    <p><strong>Phone:</strong> {formData.customerPhone}</p>
                    <p><strong>County:</strong> {formData.customerCounty}</p>
                    <p><strong>Pickup Point:</strong> {
                      points.find(p => String(p.id) === String(formData.pickupPoint))?.name || formData.pickupPoint
                    }</p>
                  </div>
                </div>

                {/* Package Info Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-[#00473E] mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Package Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Type:</strong>{' '}
                      {formData.packageType === 'Other'
                        ? formData.packageTypeOther
                        : formData.packageType}
                    </p>
                    <p><strong>Weight:</strong> {formData.weightRange}</p>
                    <p><strong>Value:</strong> KES {formData.packageValue}</p>
                    {(formData.isFragile || formData.isSpillProne) && (
                      <p>
                        <strong>Properties:</strong>{' '}
                        {[formData.isFragile && 'Fragile', formData.isSpillProne && 'Spill Prone']
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {formData.specialInstructions && (
                      <p><strong>Special Instructions:</strong> {formData.specialInstructions}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Fee Summary */}
                {deliveryFee !== null && (
                  <div className="bg-[#00473E] text-white rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Delivery Fee:</span>
                      <span className="text-2xl font-bold">KES {deliveryFee.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#E9FF15]/20 border border-[#E9FF15] rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Our team will contact you within 24 hours to confirm your
                  booking and provide delivery estimates.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            <div className={step === 1 ? 'ml-auto' : ''}>
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-[#00473E] hover:bg-[#006644] text-white flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-[#E9FF15] hover:bg-[#d4e614] text-[#00473E] font-bold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Proceed to Payment
                </Button>
              )}
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
