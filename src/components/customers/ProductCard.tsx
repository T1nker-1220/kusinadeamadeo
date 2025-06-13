'use client';

import { useState } from 'react';
import { useCustomerStore } from "@/stores/customerStore";
import Image from "next/image";
import OptionsModal from '@/components/customers/OptionsModal';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';

type Option = { id: number; group_name: string; name: string; additional_price: number; };
type Product = { id: number; name: string; description: string | null; base_price: number; image_url: string | null; options: Option[]; };

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCustomerStore((state) => state.addToCart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      <OptionsModal product={product} onClose={() => setIsModalOpen(false)} open={isModalOpen} />
      <Modal open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
        <div className="flex flex-col items-center">
          <Image
            src={product.image_url || '/images/products/logo.png'}
            alt={product.name}
            width={600}
            height={450}
            className="rounded-lg object-contain max-h-[70vh] w-auto h-auto bg-white"
            priority
          />
          <button
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full font-semibold shadow hover:bg-orange-600 transition"
            onClick={() => setIsImageModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
      <Card className="flex flex-col h-full transition-transform hover:scale-[1.03]">
        <div
          className="relative w-full aspect-[4/3] bg-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden cursor-pointer group"
          onClick={() => setIsImageModalOpen(true)}
          tabIndex={0}
          aria-label={`View full image of ${product.name}`}
          role="button"
        >
          <Image
            src={product.image_url || '/images/products/logo.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="p-0 flex flex-col flex-grow mt-4">
          <h3 className="text-xl font-bold text-[var(--color-foreground)]">{product.name}</h3>
          {product.description && <p className="text-[var(--color-muted)] text-sm mb-2">{product.description}</p>}
          <p className="text-2xl font-semibold text-[var(--color-success)] mt-auto mb-3">
              {product.base_price > 0 && `₱${product.base_price}`}
          </p>
          {Object.entries(groupedOptions).map(([groupName, options]) => (
            <div key={groupName} className="mt-2 text-sm">
              <h4 className="font-semibold text-[var(--color-foreground)] capitalize">{groupName}:</h4>
              <ul className="list-disc list-inside text-[var(--color-muted)]">
                {options.map((option) => (
                    <li key={option.id}>
                      {option.name} 
                      {option.additional_price > 0 && ` (+₱${option.additional_price})`}
                    </li>
                ))}
              </ul>
            </div>
          ))}
          <Button
            onClick={handleAddToCart}
            variant="primary"
            fullWidth
            iconLeft={<Plus size={18} />}
            className="mt-4"
          >
            {product.options.length > 0 ? 'Select Options' : 'Add to Order'}
          </Button>
        </div>
      </Card>
    </>
  );
} 