'use client';

import { useState } from 'react';
import { useCustomerStore } from "@/stores/customerStore";
import Image from "next/image";
import OptionsModal from '@/components/customers/OptionsModal';
import toast from 'react-hot-toast';

type Option = { id: number; group_name: string; name: string; additional_price: number; };
type Product = { id: number; name: string; description: string | null; base_price: number; image_url: string | null; options: Option[]; };

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCustomerStore((state) => state.addToCart);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    if (product.options.length > 0) {
      setIsModalOpen(true);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        base_price: product.base_price,
        image_url: product.image_url,
      });
      toast.success(`${product.name} added to order!`);
    }
  };

  const groupOptions = (options: Option[]) => {
    return options.reduce((acc, option) => {
      (acc[option.group_name] = acc[option.group_name] || []).push(option);
      return acc;
    }, {} as Record<string, Option[]>);
  };
  const groupedOptions = groupOptions(product.options);

  return (
    <>
      {isModalOpen && <OptionsModal product={product} onClose={() => setIsModalOpen(false)} />}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={product.image_url || '/images/products/logo.png'}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          {product.description && <p className="text-neutral-500 text-sm mb-2">{product.description}</p>}
          <p className="text-2xl font-semibold text-green-700 mt-auto mb-3">
              {product.base_price > 0 && `₱${product.base_price}`}
          </p>
          {Object.entries(groupedOptions).map(([groupName, options]) => (
            <div key={groupName} className="mt-2 text-sm">
              <h4 className="font-semibold text-gray-700 capitalize">{groupName}:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {options.map((option) => (
                    <li key={option.id}>
                      {option.name} 
                      {option.additional_price > 0 && ` (+₱${option.additional_price})`}
                    </li>
                ))}
              </ul>
            </div>
          ))}
          <button 
            onClick={handleAddToCart}
            className="mt-4 w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {product.options.length > 0 ? 'Select Options' : 'Add to Order'}
          </button>
        </div>
      </div>
    </>
  );
} 