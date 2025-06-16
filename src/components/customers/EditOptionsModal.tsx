'use client';

import { useState, useEffect } from 'react';
import { useCustomerStore, CartItem, SelectedOption } from '@/stores/customerStore';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const supabase = createClient();

type Option = { id: number; group_name: string; name: string; additional_price: number; is_available: boolean };
type Product = { id: number; name: string; description: string | null; base_price: number; image_url: string | null; is_available: boolean; options: Option[] };

type Props = {
  cartItem: CartItem;
  onClose: () => void;
  open: boolean;
};

export default function EditOptionsModal({ cartItem, onClose, open }: Props) {
  const { updateCartItemOptions } = useCustomerStore();
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [productWithOptions, setProductWithOptions] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch product with options when modal opens
  useEffect(() => {
    if (open && cartItem) {
      fetchProductOptions();
    }
  }, [open, cartItem]);

  // Initialize selected options from cart item
  useEffect(() => {
    if (cartItem && productWithOptions) {
      const initialOptions: Record<string, string> = {};
      cartItem.selectedOptions.forEach(option => {
        initialOptions[option.group_name] = option.name;
      });
      setSelectedOptions(initialOptions);
    }
  }, [cartItem, productWithOptions]);

  const fetchProductOptions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, options (*)')
        .eq('id', cartItem.product.id)
        .single();
      
      if (error) throw error;
      setProductWithOptions(data);
    } catch (error) {
      console.error('Error fetching product options:', error);
      toast.error('Failed to load product options');
    } finally {
      setIsLoading(false);
    }
  };

  const groupedOptions = productWithOptions?.options.reduce((acc, option) => {
    // Only include available options
    if (option.is_available) {
      (acc[option.group_name] = acc[option.group_name] || []).push(option);
    }
    return acc;
  }, {} as Record<string, Option[]>) || {};

  const handleOptionChange = (groupName: string, optionName: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupName]: optionName }));
  };

  const handleSaveChanges = () => {
    if (!productWithOptions) return;

    try {
      // Convert selected options to the format expected by the store
      const finalSelectedOptions: SelectedOption[] = Object.entries(selectedOptions).map(([groupName, optionName]) => {
        const option = productWithOptions.options.find(o => o.group_name === groupName && o.name === optionName);
        return {
          group_name: groupName,
          name: optionName,
          additional_price: option?.additional_price || 0,
          is_available: option?.is_available ?? true,
        };
      });

      // Update the cart item with new options - this preserves quantity and creates a unique ID
      updateCartItemOptions(cartItem.cartItemId, finalSelectedOptions);

      toast.success('Options updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating options:', error);
      toast.error('Failed to update options. Please try again.');
    }
  };
  
  const isRequired = (groupName: string) => {
    // All option groups are required (user must select one from each group)
    return true;
  };

  // Check if any option group has no available options or if not all groups have selections
  const hasUnavailableGroups = Object.values(groupedOptions).some(options => options.length === 0);
  const isSaveDisabled = hasUnavailableGroups || Object.keys(groupedOptions).length !== Object.keys(selectedOptions).length;

  if (isLoading) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading options...</p>
        </div>
      </Modal>
    );
  }

  if (!productWithOptions) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className="text-center py-8">
          <p className="text-red-400">Failed to load product options</p>
          <Button onClick={onClose} variant="secondary" className="mt-4">Close</Button>
        </div>
      </Modal>
    );
  }

  // Check if product has no options
  if (!productWithOptions.options || productWithOptions.options.length === 0) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className="flex items-start space-x-4">
          <Image
            src={cartItem.product.image_url || '/images/products/logo.png'}
            alt={cartItem.product.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-white">No Options Available</h2>
            <h3 className="text-lg font-semibold text-primary">{cartItem.product.name}</h3>
            <p className="text-sm text-slate-400 mt-2">This product doesn't have any customizable options.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-start space-x-4">
        <Image
          src={cartItem.product.image_url || '/images/products/logo.png'}
          alt={cartItem.product.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-white">Edit Options</h2>
          <h3 className="text-lg font-semibold text-primary">{cartItem.product.name}</h3>
          <p className="text-sm text-slate-400">Quantity: {cartItem.quantity}</p>
          {cartItem.groupTag && (
            <p className="text-sm text-blue-400">For: {cartItem.groupTag}</p>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(groupedOptions).map(([groupName, options]) => (
          <div key={groupName}>
            <h4 className="font-semibold capitalize text-white mb-2">
              {groupName} {isRequired(groupName) && <span className="text-red-400">*</span>}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.map((option) => (
                <label key={option.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name={groupName}
                    value={option.name}
                    className="sr-only"
                    checked={selectedOptions[groupName] === option.name}
                    onChange={() => handleOptionChange(groupName, option.name)}
                  />
                  <div className={`px-3 py-2 border rounded-lg transition-colors text-sm ${
                    selectedOptions[groupName] === option.name 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-slate-700 text-white border-slate-600 hover:border-orange-400'
                  }`}>
                    {option.name} {option.additional_price > 0 && `(+₱${option.additional_price})`}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button onClick={handleSaveChanges} disabled={isSaveDisabled} variant="primary">
          Save Changes
        </Button>
      </div>
    </Modal>
  );
} 