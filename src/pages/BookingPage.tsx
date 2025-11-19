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

        const resp = await fetch('/api/calculate-delivery-fee', {
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
        const tokenResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/token`);
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          authToken = tokenData.token || tokenData.access_token || tokenData.bearer_token;
          console.log('Auth token fetched from backend');
        }
      } catch (error) {
        console.warn('Could not fetch auth token:', error);
      }

      // Create order via API
      const response = await fetch('/api/booking-agent-orders', {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Motivational Banner */}
        <div className="mb-8 mt-20">
          <div className="text-center p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#00473E] mb-3">
              BOOK A PARCEL IN UNDER A MINUTE.
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 font-semibold">
              Share the receipt with your customer NOW, and drop your parcel later.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
          {/* Step 1: Vendor & Customer Information Combined */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Vendor Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-[#00473E]" />
                  <h2 className="text-2xl font-bold text-[#00473E]">Vendor Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name <span className="text-red-500">*</span>
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
                    Vendor Phone Number <span className="text-red-500">*</span>
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
                    Customer County/Location <span className="text-red-500">*</span>
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
  );
};

export default BookingPage;
