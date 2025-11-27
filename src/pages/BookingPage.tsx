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
      
      /* Enhanced Dropdown Styles */
      .custom-select-wrapper {
        position: relative;
      }
      
      .custom-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300473E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 20px;
        padding-right: 44px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background-color: white;
        border: 2px solid #e5e7eb;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      }
      
      .custom-select:hover {
        border-color: #00473E;
        box-shadow: 0 4px 6px -1px rgba(0, 71, 62, 0.1), 0 2px 4px -1px rgba(0, 71, 62, 0.06);
      }
      
      .custom-select:focus {
        outline: none;
        border-color: #00473E;
        box-shadow: 0 0 0 3px rgba(0, 71, 62, 0.1), 0 4px 6px -1px rgba(0, 71, 62, 0.15);
        transform: translateY(-1px);
      }
      
      .custom-select option {
        padding: 16px 20px;
        font-size: 15px;
        line-height: 1.6;
        background-color: white;
        color: #1f2937;
        border-bottom: 1px solid #f3f4f6;
        font-weight: 400;
        letter-spacing: 0.01em;
      }
      
      .custom-select option:first-child {
        color: #6b7280;
        font-weight: 500;
        background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      }
      
      .custom-select option:not(:first-child):not(:disabled) {
        background: linear-gradient(to right, white 0%, #fafafa 100%);
        position: relative;
      }
      
      .custom-select option:hover,
      .custom-select option:focus,
      .custom-select option:checked {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        color: #00473E;
        font-weight: 600;
        border-left: 4px solid #00473E;
        padding-left: 16px;
      }
      
      .custom-select option:disabled {
        color: #9ca3af;
        font-style: italic;
        background: #fef3c7;
        border-left: 3px solid #f59e0b;
      }
      
      .custom-select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f9fafb;
      }
      
      @keyframes selectPulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(0, 71, 62, 0.2);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(0, 71, 62, 0);
        }
      }
      
      .custom-select.has-value {
        background-color: #f0fdf4;
        border-color: #00473E;
      }
      
      /* Custom Radio Dropdown Styles */
      .custom-radio-select {
        width: 100%;
        cursor: pointer;
        position: relative;
        transition: 300ms;
        color: #1f2937;
        border-radius: 8px;
      }

      .custom-radio-selected {
        background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
        padding: 14px 16px;
        border-radius: 8px;
        border: 2px solid #e5e7eb;
        position: relative;
        z-index: 10;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      }
      
      .custom-radio-selected:hover {
        border-color: #00473E;
        box-shadow: 0 4px 6px -1px rgba(0, 71, 62, 0.1);
      }

      .custom-radio-selected.active {
        border-color: #00473E;
        background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
        box-shadow: 0 4px 12px -1px rgba(0, 71, 62, 0.15);
      }

      .custom-radio-arrow {
        height: 20px;
        width: 20px;
        fill: #00473E;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .custom-radio-select.open .custom-radio-arrow {
        transform: rotate(180deg);
      }

      .custom-radio-options {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        padding: 8px;
        background: white;
        border: 2px solid #00473E;
        position: absolute;
        width: 100%;
        max-height: 280px;
        overflow-y: auto;
        top: calc(100% + 4px);
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 10px 25px -5px rgba(0, 71, 62, 0.2), 0 8px 10px -6px rgba(0, 71, 62, 0.1);
      }

      .custom-radio-select.open .custom-radio-options {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }

      .custom-radio-option {
        border-radius: 6px;
        padding: 12px 14px;
        transition: all 200ms ease;
        background-color: white;
        font-size: 14px;
        line-height: 1.5;
        cursor: pointer;
        border-left: 3px solid transparent;
        margin-bottom: 4px;
      }
      
      .custom-radio-option:hover {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border-left-color: #00473E;
        padding-left: 18px;
        transform: translateX(2px);
      }

      .custom-radio-option.selected {
        background: linear-gradient(135deg, #00473E 0%, #005a4d 100%);
        color: white;
        font-weight: 600;
        border-left-color: #e9ff15;
        box-shadow: 0 2px 8px rgba(0, 71, 62, 0.3);
      }

      .custom-radio-option.disabled {
        color: #9ca3af;
        font-style: italic;
        background: #fef3c7;
        border-left-color: #f59e0b;
        cursor: not-allowed;
      }

      .custom-radio-option.disabled:hover {
        transform: none;
        padding-left: 14px;
      }

      .custom-radio-options::-webkit-scrollbar {
        width: 6px;
      }

      .custom-radio-options::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 3px;
      }

      .custom-radio-options::-webkit-scrollbar-thumb {
        background: #00473E;
        border-radius: 3px;
      }

      .custom-radio-options::-webkit-scrollbar-thumb:hover {
        background: #005a4d;
      }
      
      /* Typing Animation Styles */
      @keyframes typing1 {
        0% {
          width: 0;
        }
        25%, 45% {
          width: 100%;
        }
        60% {
          width: 0;
        }
        60.01%, 100% {
          width: 0;
        }
      }

      @keyframes typing2 {
        0%, 60% {
          width: 0;
        }
        75%, 95% {
          width: 100%;
        }
        100% {
          width: 0;
        }
      }

      @keyframes blink-caret {
        50% {
          border-color: transparent;
        }
      }

      @keyframes show1 {
        0%, 50% {
          opacity: 1;
          visibility: visible;
        }
        50.01%, 100% {
          opacity: 0;
          visibility: hidden;
        }
      }

      @keyframes show2 {
        0%, 50% {
          opacity: 0;
          visibility: hidden;
        }
        50.01%, 100% {
          opacity: 1;
          visibility: visible;
        }
      }

      .typing-container {
        position: relative;
        min-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .typing-animation {
        font-family: 'Consolas', 'Monaco', monospace;
        font-weight: 700;
        border-right: 0.15em solid #E9FF15;
        width: 0;
        white-space: nowrap;
        overflow: hidden;
        margin: 0 auto;
        display: inline-block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: clamp(0.75rem, 3.5vw, 2rem);
        max-width: 95%;
      }

      @media (min-width: 640px) {
        .typing-animation {
          font-size: clamp(1rem, 3.5vw, 2rem);
        }
      }

      @media (min-width: 1024px) {
        .typing-animation {
          font-size: clamp(1.25rem, 2.5vw, 2rem);
        }
      }

      @media (min-width: 1280px) {
        .typing-animation {
          font-size: clamp(1.5rem, 2vw, 2rem);
        }
      }

      .typing-animation.line1 {
        animation: 
          typing1 12s steps(39, end) infinite,
          blink-caret 0.75s step-end infinite,
          show1 12s step-end infinite;
      }

      .typing-animation.line2 {
        animation: 
          typing2 12s steps(36, end) infinite,
          blink-caret 0.75s step-end infinite,
          show2 12s step-end infinite;
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
          justify-content: center;
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPointLabel, setSelectedPointLabel] = useState('Select a pickup point');

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

 

  const weightRanges = [
    '0-4 KG',
    '4-8 KG',
    '8-12 KG',
    '12-15 KG',
    '15-20 KG',
    '20-25 KG',
    '25-30 KG',
  ];

  const packageTypes = [
    'Box',
    'Non-woven bag',
    'Sack',
    'Wrapped with cellotape',
    'Not sealed',
    'Other',
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
      <div className="min-h-screen">
        {/* Form Section */}
        <div className="py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Animated Header Banner */}
            <div className="bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl p-8 mb-4 relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-24 h-24 bg-[#E9FF15] rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-20 h-20 bg-[#E9FF15] rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-20 w-12 h-12 bg-[#E9FF15] rounded-full animate-bounce"></div>
              </div>

              {/* Typing Animation Content */}
              <div className="relative z-10 text-center">
                <div className="typing-container">
                  <div className="typing-animation line1 text-white">
                    BOOK A PARCEL IN UNDER 60 SECONDS.
                  </div>
                  <div className="typing-animation line2 text-white">
                    FAST, SECURE & RELIABLE DELIVERY.
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-xl text-[#E9FF15]/90 mt-3" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)' }}>
                  Skip the long process & book a parcel in seconds. Drop Off When You're Ready.
                </p>
              </div>
            </div>

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
                    placeholder="e.g., Kisumu, Mombasa, Nakuru"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00473E]" />
                    Preferred Pickup Point <span className="text-red-500">*</span>
                  </label>
                  <div 
                    className={`custom-radio-select ${dropdownOpen ? 'open' : ''}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    tabIndex={0}
                  >
                    <div className={`custom-radio-selected ${formData.pickupPoint ? 'active' : ''}`}>
                      <span className={formData.pickupPoint ? 'font-medium text-[#00473E]' : 'text-gray-500'}>
                        {selectedPointLabel}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="custom-radio-arrow">
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                    </div>
                    <div className="custom-radio-options">
                      {filteredPickupPoints.length > 0 ? (
                        filteredPickupPoints.map((point) => (
                          <div
                            key={point.id}
                            className={`custom-radio-option ${formData.pickupPoint === point.id ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInputChange('pickupPoint', point.id);
                              setSelectedPointLabel(point.info);
                              setDropdownOpen(false);
                            }}
                          >
                            {point.info}
                          </div>
                        ))
                      ) : (
                        <div className="custom-radio-option disabled">
                          {formData.customerCounty 
                            ? '⚠️ No pickup points found for this county'
                            : '📍 Please select a customer location first'
                          }
                        </div>
                      )}
                    </div>
                  </div>
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
                  Parcel Details
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Enter items name, pieces, and variations.E.g., 2 phones, 1 tablet (Samsung), chargers, etc."
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
                      points.find(p => String(p.id) === String(formData.pickupPoint))?.info || formData.pickupPoint
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
                      <p><strong>Parcel Description:</strong> {formData.specialInstructions}</p>
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
                  <strong>Note:</strong> Your Parcel Tracking number has been created. Pay the parcel fees so that you get a receipt NOW
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
