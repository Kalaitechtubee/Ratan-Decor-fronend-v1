import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building,
  MapPin,
  Shield,
  Plus,
  Edit3,
  Trash2,
  User,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../cart/context/CartContext';
import { useAuth } from '../../auth/hooks/useAuth';
import { ProfileAPI, ShippingAddressAPI, OrderAPI } from '../api';
import { getProductImageUrl } from '../../../utils/imageUtils';
import UpiPaymentButton from '../components/UpiPaymentButton';
import SubmitUTR from '../components/SubmitUTR';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, getCartSummary, clearCart } = useCart();

  // Address Management State
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Form States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressType, setAddressType] = useState('shipping'); // 'billing' or 'shipping'

  // Order States
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const fetched = useRef(false);

  // New Address Form State
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    addressType: 'Home',
    isDefault: false,
  });

  // Get cart summary
  const cartSummary = getCartSummary();

  // Helper function to validate address completeness
  const isAddressComplete = (address) => {
    return (
      address &&
      address.name &&
      address.name.trim() !== '' &&
      address.phone &&
      address.phone.trim() !== '' &&
      address.address &&
      address.address.trim() !== '' &&
      address.city &&
      address.city.trim() !== '' &&
      address.state &&
      address.state.trim() !== '' &&
      address.pincode &&
      address.pincode.trim() !== ''
    );
  };

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (cart.length === 0 && !showOrderConfirmation && !isNavigating) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cart.length, navigate, showOrderConfirmation, isNavigating]);

  // Fetch profile and shipping addresses on component mount
  useEffect(() => {
    const fetchProfileAndAddresses = async () => {
      if (!isAuthenticated || fetched.current) return;

      fetched.current = true;

      try {
        setAddressesLoading(true);
        setError(null);

        // Fetch user profile for billing address
        const profileResponse = await ProfileAPI.getProfile();
        const profileData = profileResponse.user || {};

        // Set billing address from profile
        setBillingAddress({
          name: profileData.name || '',
          phone: profileData.mobile || '',
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          country: profileData.country || 'India',
          pincode: profileData.pincode || '',
          addressType: 'Billing',
          isDefault: true,
          source: 'profile',
        });

        // Fetch shipping addresses
        const addressResponse = await ShippingAddressAPI.getShippingAddresses();
        const addresses = addressResponse.shippingAddresses || [];
        setShippingAddresses(addresses);

        // Select default shipping address if available, otherwise first address
        const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0] || null;
        setSelectedShippingAddress(defaultAddress);
      } catch (err) {
        console.error('Checkout: Error fetching profile or shipping addresses:', err);
        setError('Failed to load profile or shipping addresses. Please try again.');

        // Fallback to user context data for billing address
        if (user) {
          setBillingAddress({
            name: user.name || '',
            phone: user.mobile || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            country: user.country || 'India',
            pincode: user.pincode || '',
            addressType: 'Billing',
            isDefault: true,
            source: 'profile',
          });
        }
      } finally {
        setAddressesLoading(false);
      }
    };

    fetchProfileAndAddresses();
  }, [isAuthenticated, user]);

  // Handle address form changes
  const handleAddressFormChange = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save address
  const handleSaveAddress = async () => {
    try {
      if (
        !addressForm.name ||
        !addressForm.phone ||
        !addressForm.address ||
        !addressForm.city ||
        !addressForm.state ||
        !addressForm.pincode
      ) {
        setError('Please fill in all required fields');
        console.error('Checkout: Address save failed - incomplete fields', addressForm);
        return;
      }

      setLoading(true);

      if (addressType === 'billing') {
        // Update profile for billing address
        const profileData = {
          name: addressForm.name,
          mobile: addressForm.phone,
          address: addressForm.address,
          city: addressForm.city,
          state: addressForm.state,
          country: addressForm.country,
          pincode: addressForm.pincode,
        };

        const updatedProfile = await ProfileAPI.updateProfile(profileData);
        setBillingAddress({
          name: updatedProfile.user.name,
          phone: updatedProfile.user.mobile,
          address: updatedProfile.user.address,
          city: updatedProfile.user.city,
          state: updatedProfile.user.state,
          country: updatedProfile.user.country,
          pincode: updatedProfile.user.pincode,
          addressType: 'Billing',
          isDefault: true,
          source: 'profile',
        });
      } else {
        // Handle shipping address (create or update)
        const addressData = {
          name: addressForm.name,
          phone: addressForm.phone,
          address: addressForm.address,
          city: addressForm.city,
          state: addressForm.state,
          country: addressForm.country,
          pincode: addressForm.pincode,
          addressType: addressForm.addressType,
          isDefault: addressForm.isDefault,
        };

        let savedAddress;
        if (editingAddress && editingAddress.id) {
          // Update existing shipping address
          savedAddress = await ShippingAddressAPI.updateShippingAddress(editingAddress.id, addressData);
          savedAddress = savedAddress.shippingAddress;
        } else {
          // Create new shipping address
          savedAddress = await ShippingAddressAPI.createShippingAddress(addressData);
          savedAddress = savedAddress.shippingAddress;
        }

        // Update local state for shipping addresses
        if (editingAddress) {
          setShippingAddresses((prev) =>
            prev.map((addr) => (addr.id === editingAddress.id ? savedAddress : addr))
          );
          if (selectedShippingAddress?.id === editingAddress.id) {
            setSelectedShippingAddress(savedAddress);
          }
        } else {
          setShippingAddresses((prev) => [...prev, savedAddress]);
          if (!selectedShippingAddress || addressForm.isDefault) {
            setSelectedShippingAddress(savedAddress);
          }
        }

        // If set as default, update backend
        if (addressForm.isDefault && savedAddress.id) {
          await ShippingAddressAPI.setDefaultShippingAddress(savedAddress.id);
          setShippingAddresses((prev) =>
            prev.map((addr) => ({
              ...addr,
              isDefault: addr.id === savedAddress.id,
            }))
          );
        }
      }

      // Reset form and close modal
      setShowAddressModal(false);
      setEditingAddress(null);
      setAddressForm({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        addressType: 'Home',
        isDefault: false,
      });
      setError(null);
      console.log(`Checkout: Address saved successfully`, { addressType, address: addressForm });
    } catch (err) {
      console.error('Checkout: Save address error:', err);
      setError(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete shipping address
  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this shipping address?')) return;

    try {
      setLoading(true);
      await ShippingAddressAPI.deleteShippingAddress(addressId);

      // Update local state
      setShippingAddresses((prev) => prev.filter((addr) => addr.id !== addressId));

      // If deleted address was selected, select another one
      if (selectedShippingAddress?.id === addressId) {
        const remaining = shippingAddresses.filter((addr) => addr.id !== addressId);
        const defaultAddress = remaining.find((addr) => addr.isDefault) || remaining[0] || null;
        setSelectedShippingAddress(defaultAddress);
      }
      console.log('Checkout: Shipping address deleted successfully', { addressId });
    } catch (err) {
      console.error('Checkout: Delete shipping address error:', err);
      setError(err.message || 'Failed to delete shipping address');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit address
  const handleEditAddress = (address, type) => {
    setEditingAddress(address);
    setAddressType(type);
    setAddressForm({
      name: address.name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'India',
      pincode: address.pincode || '',
      addressType: address.addressType || 'Home',
      isDefault: address.isDefault || false,
    });
    setShowAddressModal(true);
  };

  // Handle add new address
  const handleAddNewAddress = (type) => {
    setEditingAddress(null);
    setAddressType(type);
    setAddressForm({
      name: user?.name || '',
      phone: user?.mobile || '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      addressType: type === 'billing' ? 'Billing' : 'Home',
      isDefault: false,
    });
    setShowAddressModal(true);
  };

  // Handle set default shipping address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      await ShippingAddressAPI.setDefaultShippingAddress(addressId);
      setShippingAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      const selected = shippingAddresses.find((addr) => addr.id === addressId);
      setSelectedShippingAddress(selected);
      console.log('Checkout: Default shipping address updated', { addressId });
    } catch (err) {
      console.error('Checkout: Set default shipping address error:', err);
      setError(err.message || 'Failed to set default shipping address');
    } finally {
      setLoading(false);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (loading) return;

    // Validate billing address
    if (!billingAddress) {
      setError('Please add a billing address');
      console.error('Checkout: Order placement failed - no billing address');
      return;
    }

    if (!isAddressComplete(billingAddress)) {
      setError(
        'Your billing address is incomplete. Please update it with all required fields (name, phone, address, city, state, pincode)'
      );
      console.error('Checkout: Order placement failed - incomplete billing address', billingAddress);
      return;
    }

    const finalShippingAddress = sameAsBilling ? billingAddress : selectedShippingAddress;
    if (!finalShippingAddress) {
      setError('Please select a shipping address');
      console.error('Checkout: Order placement failed - no shipping address selected');
      return;
    }

    if (!isAddressComplete(finalShippingAddress)) {
      setError('Your shipping address is incomplete. Please update it with all required fields');
      console.error('Checkout: Order placement failed - incomplete shipping address', finalShippingAddress);
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      console.error('Checkout: Order placement failed - no payment method selected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        paymentMethod,
        notes: notes || null,
        expectedDeliveryDate: expectedDeliveryDate || null,
        items: cart.map((item) => ({
          productId: item.product?.id || item.Product?.id,
          quantity: item.quantity,
          unitPrice: item.itemCalculations?.unitPrice || item.product?.price || item.Product?.price,
        })),
      };

      // Handle address selection
      if (sameAsBilling) {
        orderData.addressType = 'default';
        orderData.addressData = {
          name: billingAddress.name,
          phone: billingAddress.phone,
          address: billingAddress.address,
          city: billingAddress.city,
          state: billingAddress.state,
          country: billingAddress.country,
          pincode: billingAddress.pincode,
          addressType: 'default',
        };
      } else {
        orderData.addressType = 'shipping';
        orderData.shippingAddressId = finalShippingAddress.id;
      }

      console.log('Checkout: Placing order with data:', orderData);

      // Capture current total before clearing cart or if API response is partial
      const currentTotal = cartSummary.totalAmount;

      const response = await OrderAPI.createOrder(orderData);
      console.log('Checkout: Order creation response:', response);

      // Validate order response
      if (!response.order || !response.order.id) {
        throw new Error('Invalid order response: No order ID returned');
      }

      // Set order details and show confirmation popup
      // Ensure totalAmount is preserved even if API doesn't return it immediately or matches cart total
      setOrderDetails({
        ...response.order,
        totalAmount: response.order.totalAmount || currentTotal
      });
      setShowOrderConfirmation(true);
      console.log('Checkout: Order placed successfully', { orderId: response.order.id });

      // Clear cart after successful order creation
      await clearCart();
    } catch (err) {
      console.error('Checkout: Order creation error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price || 0);
  };

  // Close order confirmation popup
  const closeOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setOrderDetails(null);
  };

  // Handle View Order navigation
  const handleViewOrder = () => {
    if (!orderDetails?.id) {
      console.error('Checkout: Cannot navigate to order - invalid order ID', orderDetails);
      closeOrderConfirmation();
      navigate('/orders'); // Fallback to orders list or another appropriate page
      return;
    }

    console.log('Checkout: Navigating to order:', `/orders/${orderDetails.id}`);
    setIsNavigating(true);
    navigate(`/orders/${orderDetails.id}`);
    closeOrderConfirmation();
  };

  // Handle copy coupon code
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WELCOME10');
    console.log('Checkout: Coupon code copied to clipboard', { code: 'WELCOME10' });
  };

  if (!isAuthenticated || (cart.length === 0 && !showOrderConfirmation && !isNavigating)) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='px-4 py-8 mx-auto max-w-4xl'>
          <div className='py-20 text-center'>
            <h2 className='mb-2 text-2xl font-semibold text-gray-700'>
              {!isAuthenticated ? 'Please Login' : 'Your Cart is Empty'}
            </h2>
            <p className='mb-6 text-gray-600'>
              {!isAuthenticated ? 'You need to be logged in to checkout' : 'Add some products to your cart first'}
            </p>
            <button
              onClick={() => navigate(!isAuthenticated ? '/login' : '/products')}
              className='bg-[#ff4747] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors'
            >
              {!isAuthenticated ? 'Login Now' : 'Continue Shopping'}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex items-center mb-8'>
          <button
            onClick={() => navigate('/cart')}
            className='flex items-center p-2 text-gray-600 bg-white rounded-xl shadow-sm transition-colors hover:bg-gray-50'
          >
            <ArrowLeft className='mr-2 w-5 h-5' />
            Back to Cart
          </button>
          <h1 className='ml-4 text-2xl font-bold text-gray-900'>Checkout</h1>
        </div>

        {error && (
          <div className='mb-6 p-4 text-red-700 bg-red-100 rounded-lg border border-red-400'>
            <p className='font-medium'>Error</p>
            <p className='text-sm'>{error}</p>
          </div>
        )}

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Checkout Form */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Billing Address Section */}
            <div className='p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  <User className='mr-2 w-5 h-5 text-[#ff4747]' />
                  <h2 className='text-lg font-semibold text-gray-900'>Billing Address</h2>
                </div>
                <button
                  onClick={() => navigate('/profile?tab=personal')}
                  className='flex items-center px-3 py-1 text-sm text-[#ff4747] border border-[#ff4747] rounded-lg hover:bg-red-50'
                >
                  <Edit3 className='mr-1 w-4 h-4' />
                  Edit Profile
                </button>
              </div>

              {addressesLoading ? (
                <div className='p-4 text-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4747] mx-auto mb-2'></div>
                  <p className='text-sm text-gray-600'>Loading address...</p>
                </div>
              ) : billingAddress ? (
                <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-medium text-gray-900'>{billingAddress.name}</h3>
                      <p className='text-sm text-gray-600'>{billingAddress.phone}</p>
                      <p className='text-sm text-gray-600'>
                        {`${billingAddress.address}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.country} ${billingAddress.pincode}`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='p-4 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg'>
                  <p>No billing address found</p>
                  <button
                    onClick={() => handleAddNewAddress('billing')}
                    className='mt-2 text-[#ff4747] hover:underline'
                  >
                    Add billing address
                  </button>
                </div>
              )}
            </div>

            {/* Shipping Address Section */}
            <div className='p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  <Truck className='mr-2 w-5 h-5 text-[#ff4747]' />
                  <h2 className='text-lg font-semibold text-gray-900'>Shipping Address</h2>
                </div>
                <button
                  onClick={() => handleAddNewAddress('shipping')}
                  className='flex items-center px-3 py-1 text-sm text-[#ff4747] border border-[#ff4747] rounded-lg hover:bg-red-50'
                >
                  <Plus className='mr-1 w-4 h-4' />
                  Add New
                </button>
              </div>

              {/* Same as Billing Checkbox */}
              {billingAddress && (
                <div className='mb-4'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className='mr-2 text-[#ff4747]'
                    />
                    <span className='text-sm text-gray-700'>Same as billing address</span>
                  </label>
                </div>
              )}

              {!sameAsBilling && (
                <>
                  {addressesLoading ? (
                    <div className='p-4 text-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4747] mx-auto mb-2'></div>
                      <p className='text-sm text-gray-600'>Loading addresses...</p>
                    </div>
                  ) : (
                    <>
                      {/* Shipping Address List */}
                      {shippingAddresses.length > 0 ? (
                        <div className='space-y-3'>
                          {shippingAddresses.map((address) => (
                            <div key={address.id} className='mb-4'>
                              <label
                                className={`flex items-center p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${selectedShippingAddress?.id === address.id
                                  ? 'border-[#ff4747] bg-red-50'
                                  : 'border-gray-200'
                                  }`}
                              >
                                <input
                                  type='radio'
                                  name='shippingAddress'
                                  className='mr-3 text-[#ff4747]'
                                  checked={selectedShippingAddress?.id === address.id}
                                  onChange={() => setSelectedShippingAddress(address)}
                                />
                                <div className='flex-1'>
                                  <div className='flex justify-between items-start'>
                                    <div>
                                      <h3 className='font-medium text-gray-900'>{address.name}</h3>
                                      <p className='text-sm text-gray-600'>{address.phone}</p>
                                      <p className='text-sm text-gray-600'>
                                        {`${address.address}, ${address.city}, ${address.state}, ${address.country} ${address.pincode}`}
                                      </p>
                                      <div className='mt-1 space-x-2'>
                                        <span className='inline-block px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded'>
                                          {address.addressType}
                                        </span>
                                        {address.isDefault && (
                                          <span className='inline-block px-2 py-1 text-xs text-green-600 bg-green-100 rounded'>
                                            Default
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className='flex space-x-2'>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleEditAddress(address, 'shipping');
                                        }}
                                        className='p-1 text-gray-400 hover:text-blue-600'
                                      >
                                        <Edit3 className='w-4 h-4' />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteAddress(address.id);
                                        }}
                                        className='p-1 text-gray-400 hover:text-red-600'
                                      >
                                        <Trash2 className='w-4 h-4' />
                                      </button>
                                      {!address.isDefault && (
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleSetDefaultAddress(address.id);
                                          }}
                                          className='p-1 text-gray-400 hover:text-green-600'
                                        >
                                          <MapPin className='w-4 h-4' />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='p-4 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg'>
                          <p>No shipping addresses found</p>
                          <button
                            onClick={() => handleAddNewAddress('shipping')}
                            className='mt-2 text-[#ff4747] hover:underline'
                          >
                            Add your first shipping address
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Payment Method */}
            <div className='p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
              <div className='flex items-center mb-4'>
                <CreditCard className='mr-2 w-5 h-5 text-[#ff4747]' />
                <h2 className='text-lg font-semibold text-gray-900'>Payment Method</h2>
              </div>

              <div className='space-y-3'>
                <label className='flex items-center p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50'>
                  <input
                    type='radio'
                    name='payment'
                    value='UPI'
                    className='mr-3 text-[#ff4747]'
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className='flex items-center'>
                    <Smartphone className='mr-2 w-5 h-5 text-gray-600' />
                    <span className='font-medium'>UPI Payment</span>
                  </div>
                </label>

                {paymentMethod === 'UPI' && (
                  <div className='mt-4 p-4 bg-green-50 rounded-lg border border-green-200'>
                    <p className='text-sm text-green-800 mb-3'>Click the button below to proceed with UPI payment:</p>
                    <UpiPaymentButton
                      amount={cartSummary.totalAmount}
                      note={`Payment for Order - ${cart.length} items`}
                    />
                    {orderDetails && (
                      <SubmitUTR orderId={orderDetails.id} amount={cartSummary.totalAmount} />
                    )}
                  </div>
                )}

                <label className='flex items-center p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50'>
                  <input
                    type='radio'
                    name='payment'
                    value='BankTransfer'
                    className='mr-3 text-[#ff4747]'
                    checked={paymentMethod === 'BankTransfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className='flex items-center'>
                    <Building className='mr-2 w-5 h-5 text-gray-600' />
                    <span className='font-medium'>Bank Transfer</span>
                  </div>
                </label>

                {paymentMethod === 'BankTransfer' && (
                  <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                    <h4 className='text-sm font-semibold text-blue-900 mb-2'>Bank Details for Transfer:</h4>
                    <div className='space-y-1 text-sm text-blue-800'>
                      <p><span className='font-medium'>Account Name:</span> Ratan Decor</p>
                      <p><span className='font-medium'>Bank Name:</span> HDFC Bank</p>
                      <p><span className='font-medium'>Account Number:</span> 50200012345678</p>
                      <p><span className='font-medium'>IFSC Code:</span> HDFC0001234</p>
                      <p><span className='font-medium'>Branch:</span> Main Branch, New Delhi</p>
                    </div>
                    <p className='mt-3 text-xs text-blue-600 italic'>* Please share the payment screenshot or UTR number with our team after the transfer.</p>
                  </div>
                )}

                <label className='flex items-center p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50'>
                  <input
                    type='radio'
                    name='payment'
                    value='COD'
                    className='mr-3 text-[#ff4747]'
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className='flex items-center'>
                    <Building className='mr-2 w-5 h-5 text-gray-600' />
                    <span className='font-medium'>Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8'>
              <div className='p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
                <h2 className='mb-4 text-lg font-semibold text-gray-900'>Order Summary</h2>

                {/* Cart Items */}
                <div className='mb-4 space-y-3 max-h-64 overflow-y-auto'>
                  {cart.map((item) => {
                    const product = item.product || item.Product || {};
                    const unitPrice = item.itemCalculations?.unitPrice || product.price || 0;
                    const totalPrice = item.itemCalculations?.totalAmount || unitPrice * item.quantity;
                    const productImageUrl = getProductImageUrl(product) || 'https://via.placeholder.com/48';

                    return (
                      <div key={item.id} className='flex items-center space-x-3'>
                        <img
                          src={productImageUrl}
                          alt={product.name}
                          className='object-cover w-12 h-12 rounded-lg'
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48';
                          }}
                        />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {product.name || 'Unknown Product'}
                          </p>
                          <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                        </div>
                        <div className='text-sm font-medium text-gray-900'>{formatPrice(totalPrice)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className='pt-4 space-y-2 border-t border-gray-200'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='text-gray-900'>{formatPrice(cartSummary.subtotal)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>GST</span>
                    <span className='text-gray-900'>{formatPrice(cartSummary.gstAmount)}</span>
                  </div>
                  <div className='pt-2 border-t border-gray-200'>
                    <div className='flex justify-between font-semibold'>
                      <span className='text-gray-900'>Total</span>
                      <span className='text-lg text-[#ff4747]'>{formatPrice(cartSummary.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  className='px-6 py-3 mt-6 w-full font-semibold text-white rounded-lg transition-all bg-[#ff4747] hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                  onClick={handlePlaceOrder}
                  disabled={loading || !billingAddress || addressesLoading || showOrderConfirmation}
                >
                  {loading ? 'Processing...' : `Place Order - ${formatPrice(cartSummary.totalAmount)}`}
                </button>

                {/* Security Notice */}
                <div className='p-3 mt-4 bg-green-50 rounded-lg'>
                  <div className='flex items-start text-sm text-green-800'>
                    <Shield className='w-4 h-4 mr-2 mt-0.5' />
                    <div>
                      <p className='font-medium'>Secure Checkout</p>
                      <p className='mt-1 text-xs'>Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {editingAddress
                    ? `Edit ${addressType === 'billing' ? 'Billing' : 'Shipping'} Address`
                    : `Add New ${addressType === 'billing' ? 'Billing' : 'Shipping'} Address`}
                </h3>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                    setError(null);
                  }}
                  className='text-gray-400 hover:text-gray-600'
                >
                  ×
                </button>
              </div>

              {error && (
                <div className='mb-4 p-3 text-red-700 bg-red-100 rounded-lg border border-red-400'>
                  <p className='text-sm'>{error}</p>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveAddress();
                }}
                className='space-y-4'
              >
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name *</label>
                    <input
                      type='text'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                      value={addressForm.name}
                      onChange={(e) => handleAddressFormChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number *</label>
                    <input
                      type='tel'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                      value={addressForm.phone}
                      onChange={(e) => handleAddressFormChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Address *</label>
                  <textarea
                    rows={2}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                    value={addressForm.address}
                    onChange={(e) => handleAddressFormChange('address', e.target.value)}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>City *</label>
                    <input
                      type='text'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                      value={addressForm.city}
                      onChange={(e) => handleAddressFormChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>State *</label>
                    <input
                      type='text'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                      value={addressForm.state}
                      onChange={(e) => handleAddressFormChange('state', e.target.value)}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Country *</label>
                    <select
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                      value={addressForm.country}
                      onChange={(e) => handleAddressFormChange('country', e.target.value)}
                    >
                      <option value='India'>India</option>
                      <option value='USA'>USA</option>
                      <option value='UK'>UK</option>
                      <option value='Canada'>Canada</option>
                      <option value='Australia'>Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>PIN Code *</label>
                    <input
                      type='text'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                      value={addressForm.pincode}
                      onChange={(e) => handleAddressFormChange('pincode', e.target.value)}
                    />
                  </div>
                </div>

                {addressType !== 'billing' && (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Address Type</label>
                      <select
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4747] focus:border-[#ff4747]'
                        value={addressForm.addressType}
                        onChange={(e) => handleAddressFormChange('addressType', e.target.value)}
                      >
                        <option value='Home'>Home</option>
                        <option value='Office'>Office</option>
                        <option value='Other'>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={addressForm.isDefault}
                          onChange={(e) => handleAddressFormChange('isDefault', e.target.checked)}
                          className='mr-2 text-[#ff4747]'
                        />
                        <span className='text-sm text-gray-700'>Set as default shipping address</span>
                      </label>
                    </div>
                  </>
                )}

                <div className='flex space-x-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => {
                      setShowAddressModal(false);
                      setEditingAddress(null);
                      setError(null);
                    }}
                    className='flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 px-4 py-2 text-white bg-[#ff4747] rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors'
                  >
                    {loading ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Confirmation Popup */}
        {showOrderConfirmation && orderDetails && (
          <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300'>
            <div className='bg-white rounded-2xl p-8 w-full max-w-md mx-6 shadow-2xl transform transition-all scale-100 animate-fade-in-up border border-gray-100'>
              <div className='flex flex-col items-center text-center'>
                <div className='w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50'>
                  <CheckCircle className='w-10 h-10 text-green-500' strokeWidth={3} />
                </div>

                <h2 className='text-3xl font-bold text-gray-900 mb-2'>Order Confirmed!</h2>
                <p className='text-gray-500 mb-8 max-w-[80%] leading-relaxed'>
                  Thank you for your purchase. We have received your order and will begin processing it right away.
                </p>

                <div className='w-full bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100'>
                  <h3 className='text-sm uppercase tracking-wider font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2'>Order Summary</h3>
                  <div className='space-y-4'>
                    <div className='flex justify-between items-center group'>
                      <span className='text-sm text-gray-500 group-hover:text-gray-700 transition-colors'>Order ID</span>
                      <span className='font-mono font-medium text-gray-900 bg-white px-2 py-1 rounded border border-gray-200'>#{orderDetails.id}</span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500'>Amount Paid</span>
                      <span className='font-bold text-gray-900 text-lg'>
                        {formatPrice(orderDetails.totalAmount || cartSummary.totalAmount)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500'>Payment Method</span>
                      <span className='font-medium text-gray-900 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100'>
                        {paymentMethod}
                      </span>
                    </div>

                    <div className='border-t border-gray-200 mt-2 pt-3'>
                      <div className='flex justify-between items-start text-left'>
                        <span className='text-sm text-gray-500 mt-1'>Shipping to</span>
                        <span className='text-sm font-medium text-gray-900 max-w-[60%] text-right leading-snug'>
                          {sameAsBilling
                            ? `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.state}`
                            : `${selectedShippingAddress.address}, ${selectedShippingAddress.city}, ${selectedShippingAddress.state}`}
                        </span>
                      </div>
                      <div className='flex justify-end mt-1'>
                        <span className='text-xs text-gray-500'>
                          {sameAsBilling ? billingAddress.pincode : selectedShippingAddress.pincode}, {sameAsBilling ? billingAddress.country : selectedShippingAddress.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex w-full gap-4'>
                  <button
                    onClick={() => {
                      setIsNavigating(true);
                      navigate('/products');
                      closeOrderConfirmation();
                    }}
                    className='flex-1 px-6 py-3.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all duration-200 focus:ring-4 focus:ring-gray-100'
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleViewOrder}
                    className='flex-1 px-6 py-3.5 text-sm font-medium text-white bg-[#ff4747] rounded-xl hover:bg-[#e63e3e] hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 transform hover:-translate-y-0.5 focus:ring-4 focus:ring-red-100'
                  >
                    View Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;