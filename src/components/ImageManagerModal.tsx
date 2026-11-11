import React, { useState } from 'react';
import { Product } from '../types/product';
import { X, Upload, RotateCcw, Check } from 'lucide-react';

interface ImageManagerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdated: (productId: string) => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  product,
  isOpen,
  onClose,
  onImageUpdated
}) => {
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen || !product) return null;

  const currentCustom = localStorage.getItem(`custom_product_image_${product.id}`);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        // STRICT ISOLATION: Keyed strictly to this unique product.id
        localStorage.setItem(`custom_product_image_${product.id}`, dataUrl);
        setSuccessMsg(true);
        onImageUpdated(product.id);
        setTimeout(() => setSuccessMsg(false), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    // STRICT ISOLATION: Keyed strictly to this unique product.id
    localStorage.setItem(`custom_product_image_${product.id}`, imageUrlInput.trim());
    setImageUrlInput('');
    setSuccessMsg(true);
    onImageUpdated(product.id);
    setTimeout(() => setSuccessMsg(false), 2000);
  };

  const handleResetToDefault = () => {
    localStorage.removeItem(`custom_product_image_${product.id}`);
    setSuccessMsg(true);
    onImageUpdated(product.id);
    setTimeout(() => setSuccessMsg(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-neutral-900 mb-1">
          Custom Image for Product #{product.id}
        </h3>
        <p className="text-xs text-neutral-500 mb-4 line-clamp-1">
          {product.name}
        </p>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Image updated strictly for Product #{product.id}!</span>
          </div>
        )}

        <div className="space-y-5">
          {/* File Upload Option */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
              Upload Original Image File
            </label>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 hover:border-black cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <Upload className="w-6 h-6 text-neutral-400 mb-2" />
              <span className="text-xs font-semibold text-neutral-700">Choose PNG, JPG, or WEBP</span>
              <span className="text-[10px] text-neutral-400 mt-1">Applies only to Product #{product.id}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Direct URL Option */}
          <form onSubmit={handleUrlSubmit}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Or Paste Direct Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/product.webp"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-neutral-300 focus:border-black focus:outline-hidden font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          </form>

          {/* Reset button if custom image exists */}
          {currentCustom && (
            <button
              onClick={handleResetToDefault}
              className="w-full py-2 border border-neutral-300 hover:border-neutral-400 text-neutral-600 hover:text-black text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Asset</span>
            </button>
          )}

          <div className="pt-3 border-t border-neutral-200">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
