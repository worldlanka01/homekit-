import React, { useState, useEffect, useRef } from 'react';
import { CartItem, CustomerOrder } from '../types/product';
import { ProductImage } from './ProductImage';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  AlertCircle, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { recordProductSale } from '../utils/socialProof';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: CustomerOrder) => void;
}

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Sargodha',
  'Bahawalpur',
  'Abbottabad',
  'Gujrat',
  'Mardan',
  'Sukkur',
  'Rahim Yar Khan',
  'Other City'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess
}) => {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Lahore');
  const [customCity, setCustomCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');

  // Mandatory confirmation checkbox: MUST NOT BE CHECKED AUTOMATICALLY
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [showConfirmationError, setShowConfirmationError] = useState<boolean>(false);

  // Field-level error messages
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Reset form whenever modal opens with fresh cart items
  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
      setShowConfirmationError(false);
      setErrors({});
      setIsSubmitting(false);
      setCompletedOrder(null);
      setWhatsappUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountSavings = items.reduce((sum, item) => sum + 600 * item.quantity, 0);
  const grandTotal = subtotal; // Zero delivery fees nationwide

  const effectiveCity = city === 'Other City' ? customCity.trim() || 'Other City' : city;

  // Handle confirmation checkbox toggle
  const handleCheckboxChange = (checked: boolean) => {
    setIsConfirmed(checked);
    // Automatically remove the red warning once customer checks the box
    if (checked) {
      setShowConfirmationError(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      newErrors.phone = 'Please enter a valid WhatsApp or mobile number (e.g. 0300 1234567).';
    }

    if (!address.trim() || address.trim().length < 5) {
      newErrors.address = 'Please enter your complete delivery address.';
    }

    if (city === 'Other City' && !customCity.trim()) {
      newErrors.city = 'Please specify your city name.';
    }

    setErrors(newErrors);

    // Rule: Confirmation checkbox MUST be checked before proceeding
    if (!isConfirmed) {
      setShowConfirmationError(true);
      // Scroll to confirmation box so customer immediately notices it
      confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const hasNoFieldErrors = Object.keys(newErrors).length === 0;
    return hasNoFieldErrors && isConfirmed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const orderId = `HK-CART-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedPostal = postalCode.trim() ? postalCode.trim() : 'Not Provided';

    // Format products list for WhatsApp
    const productsListText = items
      .map((item, index) => {
        const itemTotal = item.product.price * item.quantity;
        return `${index + 1}. *${item.product.name}* (ID: #${item.product.id})\n   Qty: ${item.quantity} x Rs. ${item.product.price.toLocaleString()} = Rs. ${itemTotal.toLocaleString()}`;
      })
      .join('\n\n');

    // Generate WhatsApp Order Message
    const whatsappMessage = 
`*HOMEKIT - NEW CART ORDER*

*Customer Details:*
• Name: ${fullName.trim()}
• Phone: ${phone.trim()}
• Address: ${address.trim()}
• City: ${effectiveCity}
• Postal Code: ${formattedPostal}

*Cart Products (${items.length} products, ${totalQuantity} items):*
${productsListText}

*Order Financials:*
• Items Subtotal: Rs. ${subtotal.toLocaleString()}
• Promotional Discount Savings: - Rs. ${discountSavings.toLocaleString()}
• Nationwide Courier Delivery: FREE
• *Total Payable Amount (COD): Rs. ${grandTotal.toLocaleString()}*

*Order Confirmation:* Yes, I confirm that my order details are correct and I want to place this order.

Please confirm and dispatch my order via Cash on Delivery. Thank you!`;

    const whatsappNumber = '923292284120';
    const targetUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    setWhatsappUrl(targetUrl);

    // Create completed order record
    const newOrder: CustomerOrder = {
      orderId,
      customerName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: effectiveCity,
      items: [...items],
      totalAmount: grandTotal,
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Record real store sales for social-proof features
    items.forEach((item) => {
      recordProductSale(item.product.id, item.quantity, orderId);
    });

    setCompletedOrder(newOrder);
    onOrderSuccess(newOrder);
    setIsSubmitting(false);

    // Open WhatsApp with complete order details ready to send
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white max-w-xl w-full rounded-2xl shadow-2xl relative border border-neutral-100 overflow-hidden my-4 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-checkout-title"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* WhatsApp Logo */}
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div>
              <h3 id="cart-checkout-title" className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight">
                HomeKit WhatsApp Checkout
              </h3>
              <p className="text-[11px] text-neutral-300">
                Cart to Order · Cash on Delivery Nationwide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {completedOrder ? (
            /* SUCCESS STATE AFTER SUBMISSION */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Order Successfully Prepared
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  WhatsApp Opened With Your Order!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-neutral-900">{completedOrder.customerName}</strong>! Your order details have been populated in WhatsApp. Please press send in WhatsApp to finalize your dispatch.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500 font-medium">Order Reference:</span>
                  <span className="font-mono font-bold text-neutral-900">{completedOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Total Products:</span>
                  <span className="font-bold text-neutral-900">{completedOrder.items.length} items</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-neutral-500 font-medium">Delivery Address:</span>
                  <span className="font-medium text-neutral-900 text-right max-w-[65%]">
                    {completedOrder.address}, {completedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Payment Mode:</span>
                  <span className="font-semibold text-emerald-700">Cash on Delivery (Free Shipping)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-sm font-bold">
                  <span>Payable Amount:</span>
                  <span className="text-emerald-700 font-bold font-mono">
                    PKR {completedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open WhatsApp Again</span>
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Return to Store
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* EMPTY CART STATE */
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-neutral-700">Your shopping cart is currently empty.</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            /* ACTIVE CHECKOUT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Cart Items Review Card */}
              <div className="bg-neutral-50 rounded-xl p-3.5 sm:p-4 border border-neutral-200/80">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200/70 text-xs font-bold text-neutral-800">
                  <span className="uppercase tracking-wider">Order Summary ({totalQuantity} items)</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                    <Truck className="w-3.5 h-3.5" />
                    Free Delivery
                  </span>
                </div>

                {/* Items preview list */}
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 bg-white border border-neutral-200 rounded-md overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                          <ProductImage
                            productId={item.product.id}
                            src={item.product.images[0] || `/products/${item.product.id}/image-1.webp`}
                            alt={item.product.name}
                            category={item.product.category}
                            aspectClassName="aspect-square"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-neutral-900 truncate leading-tight">
                            {item.product.name}
                          </h5>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            Qty: {item.quantity} × PKR {item.product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-neutral-900 font-mono shrink-0">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="pt-3 mt-3 border-t border-neutral-200/80 space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Items Subtotal</span>
                    <span className="font-mono font-medium">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promotional Savings</span>
                    <span className="font-mono">- PKR {discountSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Nationwide Delivery</span>
                    <span className="font-semibold text-emerald-700 uppercase">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1.5 border-t border-neutral-200">
                    <span>Total Payable (Cash on Delivery)</span>
                    <span className="font-mono text-emerald-700">PKR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 2. Customer Delivery Details */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                  Customer & Delivery Details
                </span>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="e.g. Muhammad Ali"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border transition-colors focus:outline-hidden ${
                      errors.fullName
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* WhatsApp / Phone */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    WhatsApp / Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="0300 1234567"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border font-mono transition-colors focus:outline-hidden ${
                      errors.phone
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {errors.phone ? (
                    <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  ) : (
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Courier will contact you on this number for delivery confirmation.
                    </p>
                  )}
                </div>

                {/* Complete Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Complete Home Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="House #, Street #, Sector / Area / Colony, Landmark"
                    className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border transition-colors focus:outline-hidden ${
                      errors.address
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City & Postal Code Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                      }}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 bg-white focus:border-neutral-900 focus:outline-hidden"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {/* Custom City input if 'Other City' selected */}
                    {city === 'Other City' && (
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => {
                          setCustomCity(e.target.value);
                          if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                        }}
                        placeholder="Type your city name"
                        className="w-full mt-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 focus:border-neutral-900 focus:outline-hidden"
                      />
                    )}
                    {errors.city && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Postal Code (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Postal Code <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 focus:border-neutral-900 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* 3. CONFIRM YOUR ORDER CHECKBOX & RED WARNING VALIDATION */}
              {/* ======================================================== */}
              <div
                ref={confirmationRef}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  showConfirmationError
                    ? 'bg-red-50/90 border-red-500 ring-2 ring-red-400 shadow-sm animate-pulse'
                    : isConfirmed
                      ? 'bg-emerald-50/80 border-emerald-400'
                      : 'bg-neutral-50 border-neutral-200/90 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      showConfirmationError ? 'text-red-700' : 'text-neutral-900'
                    }`}
                  >
                    Confirm Your Order
                  </span>
                  {showConfirmationError && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Confirmation Required
                    </span>
                  )}
                  {isConfirmed && !showConfirmationError && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      Confirmed
                    </span>
                  )}
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                    className={`mt-0.5 w-4 h-4 rounded transition-all cursor-pointer ${
                      showConfirmationError
                        ? 'border-2 border-red-600 text-red-600 accent-red-600 focus:ring-red-500'
                        : 'border-neutral-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500'
                    }`}
                  />
                  <span
                    className={`text-xs sm:text-sm leading-snug transition-colors ${
                      showConfirmationError
                        ? 'text-red-700 font-bold'
                        : isConfirmed
                          ? 'text-emerald-950 font-bold'
                          : 'text-neutral-800 font-medium'
                    }`}
                  >
                    Yes, I confirm that my order details are correct and I want to place this order.
                  </span>
                </label>

                {/* Explicit Red Warning message if clicked without confirmation */}
                {showConfirmationError && (
                  <div className="mt-2.5 pt-2 border-t border-red-200 flex items-center gap-1.5 text-xs font-bold text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Please confirm your order before proceeding.</span>
                  </div>
                )}
              </div>

              {/* Trust Guarantees */}
              <div className="flex items-center justify-between py-2 text-[11px] text-neutral-500 border-t border-neutral-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Cash on Delivery
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Free Delivery Across Pakistan
                </span>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1ca64f] text-white text-sm sm:text-base font-bold tracking-wide rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>{isSubmitting ? 'Preparing WhatsApp Order...' : 'Place Order'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
