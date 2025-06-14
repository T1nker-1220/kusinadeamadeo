"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MenuPageClient from "@/components/customers/MenuPageClient";

type Option = {
  id: number;
  group_name: string;
  name: string;
  additional_price: number;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  category_id: number;
  options: Option[];
};

type Category = { id: number; name: string };

type Props = {
  categories: Category[];
  products: Product[];
};

export default function StoreStatusProvider({ categories, products }: Props) {
  const [isStoreOpen, setIsStoreOpen] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let settingsChannel: any;
    const fetchStatus = async () => {
      const { data } = await supabase.from("store_settings").select("is_open").eq("id", 1).single();
      setIsStoreOpen(data?.is_open ?? true);
    };
    fetchStatus();
    settingsChannel = supabase.channel("realtime-store-settings").on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "store_settings", filter: "id=eq.1" },
      (payload) => setIsStoreOpen(payload.new.is_open)
    ).subscribe();
    return () => {
      if (settingsChannel) supabase.removeChannel(settingsChannel);
    };
    // eslint-disable-next-line
  }, []);

  if (isStoreOpen === null) {
    return <div className="flex justify-center items-center h-40 text-lg text-gray-500">Loading store status...</div>;
  }

  return (
    <>
      {!isStoreOpen && (
        <div className="max-w-4xl mx-auto p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Store Currently Closed</p>
          <p>We are not accepting online orders at this time. Please check back later!</p>
        </div>
      )}
      <MenuPageClient categories={categories} products={products} isStoreOpen={isStoreOpen} />
    </>
  );
} 