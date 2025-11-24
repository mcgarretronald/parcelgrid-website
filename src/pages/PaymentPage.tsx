import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CheckCircle, Loader2, AlertCircle, Smartphone } from 'lucide-react';

interface LocationState {
  bookingData: any;
  orderId?: string;
  trackingNo?: string;
  orderData?: any;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Try to get order data from localStorage if not in state
  const getOrderData = () => {
    if (state?.orderData) {
      return state.orderData;
    }
    
    const storedOrder = localStorage.getItem('currentOrder');
    const storedTimestamp = localStorage.getItem('currentOrderTimestamp');
    
    if (storedOrder && storedTimestamp) {
      try {
        const timestamp = parseInt(storedTimestamp, 10);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        const now = Date.now();
        
        // Clear stale data (older than 1 hour)
        if (now - timestamp > oneHour) {
          console.log('Clearing stale order data');
          localStorage.removeItem('currentOrder');
          localStorage.removeItem('currentOrderTimestamp');
          localStorage.removeItem('currentBookingForm');
          return null;
        }
        
        return JSON.parse(storedOrder);
      } catch (error) {
        console.error('Error parsing stored order:', error);
        return null;
      }
    }
    return null;
  };


  const [phoneNumber, setPhoneNumber] = useState('+254');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [orderId, setOrderId] = useState<string>(state?.orderId || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [statusTimeoutId, setStatusTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [, setMerchantRequestId] = useState<string>('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isStatusSuccess, setIsStatusSuccess] = useState<boolean>(false);
  const handleBackToSummary = () => {
    navigate('/book-parcel', {
      state: {
        showSummary: true,
        existingData: state?.bookingData || getOrderData()?.data?.order?.[0] || {},
      },
    });
  };

  // Redirect if no booking data
  useEffect(() => {
    console.log('Payment page state:', state);
    console.log('Tracking number from state:', state?.trackingNo);
    console.log('Order ID from state:', state?.orderId);
    console.log('Full order data:', state?.orderData);
    
    if (!state?.bookingData && !orderId) {
      navigate('/book-parcel');
    }
  }, [state, orderId, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutId) {
        clearTimeout(statusTimeoutId);
      }
    };
  }, [statusTimeoutId]);

  const validatePhone = (phone: string): boolean => {
    // Must start with +254 and have 12 digits total
    const phoneRegex = /^\+254\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleCreateOrder = async () => {
    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid phone number (+254XXXXXXXXX)');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get order data from localStorage or state
      const cachedOrderData = getOrderData();
      
      console.log('=== PAYMENT PAGE - TRACKING NUMBER SEARCH ===');
      console.log('Cached order data:', cachedOrderData);
      console.log('Cached order data type:', typeof cachedOrderData);
      
      if (cachedOrderData) {
        console.log('Cached order data keys:', Object.keys(cachedOrderData));
        console.log('All values in cached order:', JSON.stringify(cachedOrderData, null, 2));
      }
      
      // Get the tracking number from cached order data - try multiple sources
      const trackingNumber = cachedOrderData?.trackingNo 
        || cachedOrderData?.trackingNumber 
        || cachedOrderData?.tracking_no 
        || cachedOrderData?.data?.trackingNo
        || cachedOrderData?.data?.trackingNumber 
        || cachedOrderData?.data?.tracking_no
        || cachedOrderData?.data?.order?.[0]?.trackingNo
        || cachedOrderData?.data?.order?.[0]?.trackingNumber
        || cachedOrderData?.order?.trackingNo
        || cachedOrderData?.order?.trackingNumber
        || state?.trackingNo 
        || state?.orderId 
        || orderId;
      
      console.log('Final tracking number:', trackingNumber);
      console.log('state?.bookingData?.deliveryFee:', state?.bookingData?.deliveryFee);
      console.log('============================================');
      
      if (!trackingNumber) {
        throw new Error('No tracking number found. Please create an order first.');
      }

      // Remove '+' from phone number for the API
      const cleanPhoneNumber = phoneNumber.replace('+', '');

      // Prepare payment payload
      const paymentPayload = {
        phoneNumber: cleanPhoneNumber,
        amount: state?.bookingData?.deliveryFee || 0,
        trackingNo: trackingNumber,
        paymentDesc: "courierFee"
      };

      console.log('Initiating payment with payload:', paymentPayload);

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

      // Send payment prompt
      const response = await fetch('https://app.escrowcourier.com/payment-services/api/payments/prompts/courier-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        },
        body: JSON.stringify(paymentPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Payment initiation failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment prompt sent successfully:', data);
      
      // Extract merchantRequestId from response
      const merchantReqId = data.merchantRequestId 
        || data.MerchantRequestID 
        || data.merchant_request_id 
        || data.data?.merchantRequestId 
        || data.data?.MerchantRequestID;
      
      console.log('Extracted merchantRequestId:', merchantReqId);
      
      if (!merchantReqId) {
        console.warn('No merchantRequestId found in payment prompt response');
      }
      
      setMerchantRequestId(merchantReqId);
      setOrderId(trackingNumber);
      setPaymentInitiated(true);

      // Schedule single payment status confirmation after 15 seconds
      schedulePaymentStatusCheck(merchantReqId, authToken);
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const schedulePaymentStatusCheck = (merchantReqId: string, authToken: string) => {
    if (statusTimeoutId) {
      clearTimeout(statusTimeoutId);
    }
    const timeout = setTimeout(async () => {
      setCheckingStatus(true);
      try {
        console.log('Checking payment status for merchantRequestId:', merchantReqId);
        const statusResp = await fetch('https://app.escrowcourier.com/payment-services/api/payments/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          },
          body: JSON.stringify({ merchantRequestId: merchantReqId }),
        });
        const rawText = await statusResp.text();
        let statusData: any = null;
        try { statusData = rawText ? JSON.parse(rawText) : {}; } catch { statusData = { raw: rawText }; }
        console.log('Payment status response raw:', rawText);
        console.log('Parsed status data:', statusData);

        if (!statusResp.ok) {
          throw new Error(`Status check failed: ${statusResp.status}`);
        }

        // Extract status message from various possible locations
        const statusMsg = statusData.message 
          || statusData.statusMessage 
          || statusData.data?.message 
          || statusData.data?.statusMessage
          || statusData.ResultDesc
          || statusData.resultDesc
          || '';

        // Attempt to determine paid state
        const paidFlag = statusData.paid
          || statusData.success && /paid|success|complete/i.test(String(statusData.message || ''))
          || /paid|success|complete/i.test(String(statusData.status || ''))
          || /paid|success|complete/i.test(String(statusData.data?.status || ''))
          || /paid|success|complete/i.test(String(statusData.data?.paymentStatus || ''))
          || /paid|success|complete/i.test(String(statusData.data?.state || ''))
          || statusData.ResultCode === '0'
          || statusData.resultCode === '0';

        if (paidFlag) {
          setSuccess(true);
          setIsProcessing(false);
          setError(null);
          setIsStatusSuccess(true);
          setStatusMessage(statusMsg || 'Payment completed successfully!');
          setShowStatusModal(true);
          // Clear all cached booking and order data
          localStorage.removeItem('currentOrder');
          localStorage.removeItem('currentOrderTimestamp');
          localStorage.removeItem('currentBookingForm');
        } else {
          setIsProcessing(false);
          setIsStatusSuccess(false);
          setStatusMessage(statusMsg || 'Payment was not completed. Please try again.');
          setShowStatusModal(true);
        }
      } catch (err: any) {
        console.error('Payment status check error:', err);
        setIsProcessing(false);
        setIsStatusSuccess(false);
        setStatusMessage('Unable to confirm payment status. Please try again.');
        setShowStatusModal(true);
      } finally {
        setCheckingStatus(false);
        setStatusTimeoutId(null);
      }
    }, 15000); // 15 seconds
    setStatusTimeoutId(timeout);
  };

  const handleTryAgain = () => {
    setError(null);
    setPaymentInitiated(false);
    setIsProcessing(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#00473E] mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-2">Your order has been confirmed</p>
            <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
            <div className="bg-[#E9FF15]/20 border border-[#E9FF15] rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Your parcel is now <strong>awaiting handover</strong>. We will contact you with pickup details shortly.
              </p>
            </div>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#00473E] hover:bg-[#006644] text-white"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mt-20">
        <div className="mb-4">
          <Button variant="outline" onClick={handleBackToSummary} className="flex items-center gap-2">
            Back to Summary
          </Button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-[#00473E]" />
            </div>
            <h1 className="text-3xl font-bold text-[#00473E] mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Enter your M-Pesa number to pay for delivery</p>
          </div>

          {!paymentInitiated ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254712345678"
                  className="w-full text-lg"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the phone number registered with M-Pesa
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                onClick={handleCreateOrder}
                disabled={isProcessing || !validatePhone(phoneNumber)}
                className="w-full bg-[#E9FF15] hover:bg-[#d4e614] text-[#00473E] font-bold text-lg py-6"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 text-center">
                  You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the payment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-6">
                  <Loader2 className="w-16 h-16 mx-auto text-[#00473E] animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-[#00473E] mb-3">
                  Waiting for Payment Confirmation
                </h2>
                <p className="text-gray-600 mb-2">
                  Please check your phone for the M-Pesa payment prompt
                </p>
                <p className="text-sm text-gray-500">
                  Phone: {phoneNumber}
                </p>
                {checkingStatus && (
                  <p className="text-xs text-gray-500 mt-2">Checking payment status...</p>
                )}
                {!checkingStatus && paymentInitiated && (
                  <p className="text-xs text-gray-500 mt-2">We will auto-check status after 15 seconds.</p>
                )}
              </div>

              <div className="bg-[#E9FF15]/20 border border-[#E9FF15] rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00473E] font-bold">1.</span>
                    <span>Check your phone for the M-Pesa payment request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00473E] font-bold">2.</span>
                    <span>Enter your M-Pesa PIN to confirm payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00473E] font-bold">3.</span>
                    <span>Wait for confirmation (this may take a few moments)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Status Modal Popup */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all animate-in zoom-in duration-300 ${
              isStatusSuccess ? 'border-4 border-green-500' : 'border-4 border-red-500'
            }`}>
              <div className="text-center">
                {/* Animated Icon */}
                <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 ${
                  isStatusSuccess ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isStatusSuccess ? (
                    <CheckCircle className="w-16 h-16 text-green-600 animate-in zoom-in duration-700" />
                  ) : (
                    <AlertCircle className="w-16 h-16 text-red-600 animate-in zoom-in duration-700" />
                  )}
                </div>

                {/* Status Title */}
                <h2 className={`text-2xl font-bold mb-4 ${
                  isStatusSuccess ? 'text-green-700' : 'text-red-700'
                }`}>
                  {isStatusSuccess ? 'Payment Successful!' : 'Payment Failed'}
                </h2>

                {/* Status Message */}
                <p className="text-gray-700 mb-6 text-lg">
                  {statusMessage}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {isStatusSuccess ? (
                    <Button
                      onClick={() => {
                        setShowStatusModal(false);
                        navigate('/');
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                    >
                      Go to Home
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setShowStatusModal(false);
                          handleTryAgain();
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                      >
                        Try Again
                      </Button>
                      <Button
                        onClick={() => {
                          setShowStatusModal(false);
                          navigate('/book-parcel', { state: { showSummary: true } });
                        }}
                        variant="outline"
                        className="w-full py-3 text-lg"
                      >
                        Back to Summary
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
