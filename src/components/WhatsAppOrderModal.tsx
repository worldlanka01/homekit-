import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { ProductImage } from './ProductImage';
import { FreeDeliveryBadge } from './FreeDeliveryBadge';
import { X, CheckCircle2, ShieldCheck, AlertCircle, Plus, Minus, ArrowRight } from 'lucide-react';
import { recordProductSale } from '../utils/socialProof';

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  initialQuantity?: number;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  isOpen,
  onClose,
  product,
  initialQuantity = 1
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Lahore');
  const [postalCode, setPostalCode] = useState<string>('');
  
  // Mandatory checkbox: MUST BE UNCHECKED BY DEFAULT
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [showConfirmationError, setShowConfirmationError] = useState<boolean>(false);
  
  // Field errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
  }>({});

  const [orderSent, setOrderSent] = useState<boolean>(false);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState<string>('');

  // Reset state whenever the modal opens with a product
  useEffect(() => {
    if (isOpen) {
      setQuantity(Math.max(1, initialQuantity));
      setIsConfirmed(false);
      setShowConfirmationError(false);
      setErrors({});
      setOrderSent(false);
    }
  }, [isOpen, initialQuantity, product?.id]);

  if (!isOpen || !product) return null;

  const totalAmount = product.price * quantity;

  const handleCheckboxChange = (checked: boolean) => {
    setIsConfirmed(checked);
    // Rule: Automatically remove the warning when the customer checks the box
    if (checked) {
      setShowConfirmationError(false);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1) {
      setQuantity(newQty);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      newErrors.phone = 'Please enter a valid WhatsApp or mobile number.';
    }

    if (!address.trim() || address.trim().length < 5) {
      newErrors.address = 'Please enter your complete delivery address.';
    }

    if (!city.trim()) {
      newErrors.city = 'Please enter your city.';
    }

    setErrors(newErrors);

    // Rule: Checkbox must be checked!
    if (!isConfirmed) {
      setShowConfirmationError(true);
    }

    const isFormValid = Object.keys(newErrors).length === 0 && isConfirmed;
    return isFormValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Build the exact required WhatsApp Message Format
    const formattedPostal = postalCode.trim() ? postalCode.trim() : 'Not Provided';
    const message = 
`HOMEKIT - NEW ORDER

Customer Details:
Name: ${fullName.trim()}
Phone: ${phone.trim()}
Address: ${address.trim()}
City: ${city.trim()}
Postal Code: ${formattedPostal}

Order Details:
Product: ${product.name}
Product ID: ${product.id}
Quantity: ${quantity}
Total Amount: Rs. ${totalAmount.toLocaleString()}

Order Confirmation: Yes, I confirm that my order details are correct and I want to place this order.

Please confirm my order. Thank you!`;

    const whatsappNumber = '923292284120';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Record real store sales for social-proof features
    recordProductSale(product.id, quantity);

    setLastGeneratedUrl(whatsappUrl);
    setOrderSent(true);

    // Direct redirect to WhatsApp
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white max-w-lg w-full rounded-2xl shadow-2xl relative border border-neutral-100 overflow-hidden my-4 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* WhatsApp Logo */}
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div>
              <h3 id="order-modal-title" className="text-sm sm:text-base font-bold tracking-tight text-white leading-none">
                HomeKit WhatsApp Order
              </h3>
              <p className="text-[11px] text-neutral-300 mt-1">
                Cash on Delivery · Verified Official Channel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {orderSent ? (
            /* Success confirmation screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 mb-2">
                Order Generated!
              </h4>
              <p className="text-sm text-neutral-600 mb-6 max-w-sm mx-auto">
                Your order details have been prepared for WhatsApp chat with <span className="font-semibold text-neutral-900">+92 329 2284120</span>.
              </p>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-left mb-6 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Customer:</span>
                  <span className="font-semibold text-neutral-900">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Product:</span>
                  <span className="font-semibold text-neutral-900 line-clamp-1">{product.name} (x{quantity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Payable:</span>
                  <span className="font-bold text-emerald-700 font-mono">Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment:</span>
                  <span className="font-medium text-neutral-900">Cash on Delivery</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={lastGeneratedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Re-open WhatsApp Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
                >
                  Done & Back to Store
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Selected Product Summary Card */}
              <div className="p-3.5 sm:p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex gap-3.5 items-center">
                <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white border border-neutral-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  <ProductImage
                    productId={product.id}
                    src={product.images[0] || `/products/${product.id}/image-1.webp`}
                    alt={product.name}
                    category={product.category}
                    aspectClassName="aspect-square"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">
                      #{product.id}
                    </span>
                    <FreeDeliveryBadge size="sm" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 leading-snug">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-neutral-900 tabular-nums font-mono">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-neutral-400 line-through tabular-nums">
                      Rs. {(product.price + 600).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] uppercase font-semibold text-neutral-500">
                    Qty
                  </span>
                  <div className="flex items-center border border-neutral-300 rounded bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Total Highlight */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs">
                <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Total Amount (Cash on Delivery)
                </span>
                <span className="text-sm font-extrabold text-emerald-800 font-mono">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Customer Information Fields */}
              <div className="space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Customer Delivery Information
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="e.g. Muhammad Usman"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-lg focus:outline-hidden transition-colors ${
                      errors.fullName
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-neutral-300 focus:border-neutral-900 bg-white'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* WhatsApp / Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="e.g. 0300 1234567"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-lg focus:outline-hidden transition-colors ${
                      errors.phone
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-neutral-300 focus:border-neutral-900 bg-white'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Complete Home Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Complete Home Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="House / Apartment #, Street #, Sector or Area"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-lg focus:outline-hidden transition-colors resize-none ${
                      errors.address
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-neutral-300 focus:border-neutral-900 bg-white'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City & Postal Code (2-column grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                      }}
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm border rounded-lg focus:outline-hidden transition-colors ${
                        errors.city
                          ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                          : 'border-neutral-300 focus:border-neutral-900 bg-white'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Postal Code <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* MANDATORY ORDER CONFIRMATION CHECKBOX */}
              <div 
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  showConfirmationError
                    ? 'border-red-500 bg-red-50/90 ring-2 ring-red-400 shadow-sm animate-pulse'
                    : isConfirmed
                    ? 'border-emerald-400 bg-emerald-50/80'
                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
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
                      <CheckCircle2 className="w-3.5 h-3.5" />
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

                {/* Explicit Red Warning message required by prompt */}
                {showConfirmationError && (
                  <div className="mt-2.5 pt-2 border-t border-red-200 flex items-center gap-1.5 text-xs font-bold text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Please confirm your order before proceeding.</span>
                  </div>
                )}
              </div>

              {/* WhatsApp Order Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1ca64f] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Confirm & Order on WhatsApp</span>
                </button>

                <p className="text-[11px] text-center text-neutral-400 mt-2.5">
                  Official HomeKit WhatsApp Support · +92 329 2284120
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
