'use client';

import { useState } from 'react';
import { useCustomerStore } from '@/stores/customerStore';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Option = { id: number; group_name: string; name: string; additional_price: number };
type Product = { id: number; name: string; description: string | null; base_price: number; image_url: string | null; options: Option[] };

type Props = {
  product: Product;
  onClose: () => void;
};

export default function OptionsModal({ product, onClose }: Props) {
  const addToCart = useCustomerStore((state) => state.addToCart);
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  const groupedOptions = product.options.reduce((acc, option) => {
    (acc[option.group_name] = acc[option.group_name] || []).push(option);
    return acc;
  }, {} as Record<string, Option[]>);

  const handleOptionChange = (groupName: string, optionName: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupName]: optionName }));
  };

  const handleAddToCart = () => {
    const finalSelectedOptions = Object.entries(selectedOptions).map(([groupName, optionName]) => {
      const option = product.options.find(o => o.group_name === groupName && o.name === optionName);
      return {
        group_name: groupName,
        name: optionName,
        additional_price: option?.additional_price || 0,
      };
    });

    addToCart(product, finalSelectedOptions);
    toast.success(`${product.name} added to order!`);
    onClose();
  };
  
  const isAddToCartDisabled = Object.keys(groupedOptions).length !== Object.keys(selectedOptions).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-start space-x-4">
          <Image
            src={product.image_url || '/images/products/logo.png'}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {Object.entries(groupedOptions).map(([groupName, options]) => (
            <div key={groupName}>
              <h3 className="font-semibold capitalize">{groupName}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {options.map((option) => (
                  <label key={option.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name={groupName}
                      value={option.name}
                      className="sr-only"
                      onChange={() => handleOptionChange(groupName, option.name)}
                    />
                    <div className={`px-4 py-2 border rounded-full ${selectedOptions[groupName] === option.name ? 'bg-yellow-500 text-black' : 'bg-gray-100'}`}>
                      {option.name} {option.additional_price > 0 && `(+₱${option.additional_price})`}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button 
            onClick={handleAddToCart} 
            disabled={isAddToCartDisabled}
            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
} 