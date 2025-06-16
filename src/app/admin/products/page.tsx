'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminGuard from '@/components/admin/AdminGuard';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const supabase = createClient();

type Option = {
  id: number;
  group_name: string;
  name: string;
  additional_price: number;
  is_available: boolean;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  category_id: number;
  is_available: boolean;
  options: Option[];
};

type Category = {
  id: number;
  name: string;
};

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        { data: categoriesData, error: categoriesError },
        { data: productsData, error: productsError }
      ] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('products').select('*, options (*)').order('name', { ascending: true })
      ]);

      if (categoriesError) throw categoriesError;
      if (productsError) throw productsError;

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const toggleProductAvailability = async (productId: number, currentStatus: boolean) => {
    const updateKey = `product-${productId}`;
    setUpdatingItems(prev => new Set(prev).add(updateKey));

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, is_available: !currentStatus }
          : product
      ));

      toast.success(`Product ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  };

  const toggleOptionAvailability = async (optionId: number, currentStatus: boolean) => {
    const updateKey = `option-${optionId}`;
    setUpdatingItems(prev => new Set(prev).add(updateKey));

    try {
      const { error } = await supabase
        .from('options')
        .update({ is_available: !currentStatus })
        .eq('id', optionId);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(product => ({
        ...product,
        options: product.options.map(option =>
          option.id === optionId
            ? { ...option, is_available: !currentStatus }
            : option
        )
      })));

      toast.success(`Option ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating option:', error);
      toast.error('Failed to update option');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const groupedProducts = categories.reduce((acc, category) => {
    acc[category.id] = products.filter(product => product.category_id === category.id);
    return acc;
  }, {} as Record<number, Product[]>);

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-white">Loading products...</p>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="sticky top-0 z-20 p-4 border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-orange-500 hover:text-orange-400 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Manage Products</h1>
          </div>
        </header>

        <main className="p-4">
          <div className="max-w-6xl mx-auto space-y-4">
            {categories.map(category => {
              const categoryProducts = groupedProducts[category.id] || [];
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id} className="bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700">
                  <button
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-orange-500" /> : <ChevronRight className="w-5 h-5 text-orange-500" />}
                      <h2 className="text-xl font-bold text-white">{category.name}</h2>
                      <span className="text-sm text-slate-400">({categoryProducts.length} products)</span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-700">
                      {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-slate-400">
                          No products in this category
                        </div>
                      ) : (
                        <div className="space-y-2 p-4">
                          {categoryProducts.map(product => {
                            const isProductExpanded = expandedProducts.has(product.id);
                            const productUpdateKey = `product-${product.id}`;
                            const isUpdatingProduct = updatingItems.has(productUpdateKey);

                            return (
                              <div key={product.id} className="bg-slate-700/50 rounded-lg border border-slate-600">
                                <div className="p-3 flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <img
                                      src={product.image_url || '/images/products/logo.png'}
                                      alt={product.name}
                                      className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-white text-sm">{product.name}</h3>
                                      <p className="text-xs text-slate-400">₱{product.base_price}</p>
                                      {product.options.length > 0 && (
                                        <p className="text-xs text-blue-400">{product.options.length} options</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {product.options.length > 0 && (
                                      <button
                                        onClick={() => toggleProductExpansion(product.id)}
                                        className="p-1 text-slate-400 hover:text-white transition-colors"
                                      >
                                        {isProductExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                      </button>
                                    )}
                                    
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-400">Available:</span>
                                      <button
                                        onClick={() => toggleProductAvailability(product.id, product.is_available)}
                                        disabled={isUpdatingProduct}
                                        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                                          product.is_available ? 'bg-green-500' : 'bg-red-500'
                                        } ${isUpdatingProduct ? 'opacity-50' : ''}`}
                                      >
                                        {isUpdatingProduct ? (
                                          <Loader2 className="w-3 h-3 animate-spin text-white mx-auto" />
                                        ) : (
                                          <span
                                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                              product.is_available ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                          />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {isProductExpanded && product.options.length > 0 && (
                                  <div className="border-t border-slate-600 p-3">
                                    <h4 className="text-sm font-semibold text-white mb-2">Options:</h4>
                                    <div className="space-y-2">
                                      {Object.entries(
                                        product.options.reduce((acc, option) => {
                                          (acc[option.group_name] = acc[option.group_name] || []).push(option);
                                          return acc;
                                        }, {} as Record<string, Option[]>)
                                      ).map(([groupName, options]) => (
                                        <div key={groupName} className="bg-slate-600/50 rounded p-2">
                                          <h5 className="text-xs font-semibold text-slate-300 mb-1 capitalize">{groupName}:</h5>
                                          <div className="space-y-1">
                                            {options.map(option => {
                                              const optionUpdateKey = `option-${option.id}`;
                                              const isUpdatingOption = updatingItems.has(optionUpdateKey);

                                              return (
                                                <div key={option.id} className="flex items-center justify-between text-xs">
                                                  <span className="text-slate-300">
                                                    {option.name} {option.additional_price > 0 && `(+₱${option.additional_price})`}
                                                  </span>
                                                  <div className="flex items-center gap-1">
                                                    <span className="text-slate-400">Available:</span>
                                                    <button
                                                      onClick={() => toggleOptionAvailability(option.id, option.is_available)}
                                                      disabled={isUpdatingOption}
                                                      className={`relative inline-flex h-3 w-6 items-center rounded-full transition-colors focus:outline-none ${
                                                        option.is_available ? 'bg-green-500' : 'bg-red-500'
                                                      } ${isUpdatingOption ? 'opacity-50' : ''}`}
                                                    >
                                                      {isUpdatingOption ? (
                                                        <Loader2 className="w-2 h-2 animate-spin text-white mx-auto" />
                                                      ) : (
                                                        <span
                                                          className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                                                            option.is_available ? 'translate-x-3' : 'translate-x-0.5'
                                                          }`}
                                                        />
                                                      )}
                                                    </button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
} 