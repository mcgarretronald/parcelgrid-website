import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, ArrowRight, Package, User, MapPin, CheckCircle } from 'lucide-react';
import { useAgentData } from '../components/Map/GoogleMap';

interface FormData {
  // Vendor Info
  vendorName: string;
  vendorPhone: string;
  vendorAddress: string;
  
  // Customer Info
  customerName: string;
  customerPhone: string;
  customerAltPhone: string;
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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    vendorName: '',
    vendorPhone: '+254',
    vendorAddress: '',
    customerName: '',
    customerPhone: '+254',
    customerAltPhone: '+254',
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

  // Filter pickup points based on county
  useEffect(() => {
    if (formData.customerCounty) {
      const filtered = points.filter((point) =>
        point.info?.toLowerCase().includes(formData.customerCounty.toLowerCase())
      );
      setFilteredPickupPoints(filtered);
    } else {
      setFilteredPickupPoints(points);
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
    'Over 30 KG',
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      return !!(
        formData.vendorName &&
        formData.vendorPhone &&
        formData.vendorPhone.length >= 12 &&
        formData.vendorAddress
      );
    }
    if (currentStep === 2) {
      return !!(
        formData.customerName &&
        formData.customerPhone &&
        formData.customerPhone.length >= 12 &&
        formData.customerCounty &&
        formData.pickupPoint
      );
    }
    if (currentStep === 3) {
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
      setStep((prev) => Math.min(prev + 1, 4));
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // TODO: Submit form data to backend
    console.log('Booking submitted:', formData);
    alert('Booking submitted successfully! We will contact you shortly.');
    // Reset form or redirect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00473E] mb-3">
            Book Your Parcel
          </h1>
          <p className="text-lg text-gray-600">Fast and reliable delivery across Kenya</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= 1 ? 'bg-[#00473E] text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  1
                </div>
                <div className="flex-1 h-1 mx-2 bg-gray-300">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step >= 2 ? 'bg-[#00473E]' : 'bg-gray-300'
                    }`}
                    style={{ width: step >= 2 ? '100%' : '0%' }}
                  />
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-600">Vendor & Customer</p>
            </div>

            <div className="flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= 3 ? 'bg-[#00473E] text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <div className="flex-1 h-1 mx-2 bg-gray-300">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step >= 4 ? 'bg-[#00473E]' : 'bg-gray-300'
                    }`}
                    style={{ width: step >= 4 ? '100%' : '0%' }}
                  />
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-600">Package & Summary</p>
            </div>

            <div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step === 4 ? 'bg-[#00473E] text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-center mt-2 text-gray-600">Review</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
          {/* Step 1: Vendor Information */}
          {step === 1 && (
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.vendorAddress}
                  onChange={(e) => handleInputChange('vendorAddress', e.target.value)}
                  placeholder="Enter full address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00473E] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Customer Information */}
          {step === 2 && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Alternative Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.customerAltPhone}
                    onChange={(e) => handleInputChange('customerAltPhone', e.target.value)}
                    placeholder="+254712345678"
                    className="w-full"
                  />
                </div>
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
                      <option key={point.id} value={point.name}>
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
          )}

          {/* Step 3: Package Details */}
          {step === 3 && (
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

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-[#00473E]" />
                <h2 className="text-2xl font-bold text-[#00473E]">Booking Summary</h2>
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
                    <p><strong>Address:</strong> {formData.vendorAddress}</p>
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
                    {formData.customerAltPhone !== '+254' && (
                      <p><strong>Alt Phone:</strong> {formData.customerAltPhone}</p>
                    )}
                    <p><strong>County:</strong> {formData.customerCounty}</p>
                    <p><strong>Pickup Point:</strong> {formData.pickupPoint}</p>
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
              {step < 4 ? (
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
                  Submit Booking
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
