// src/scripts/sync-menu.ts
import { createClient } from '@supabase/supabase-js';
import { menuData } from '../lib/menu';
import 'dotenv/config'; // To read .env.local

// Load Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // IMPORTANT: Use the Service Role Key for admin tasks

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('❌ Supabase URL or Service Role Key is missing from .env.local');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncMenu() {
  console.log('🚀 Starting menu synchronization...');
  console.log(`📋 Found ${menuData.length} categories in menu.ts`);

  try {
    // --- Step 1: Clear existing menu data and reset sequences (non-destructive to orders) ---
    console.log('🗑️  Clearing old menu data and resetting ID sequences...');
    
    // Delete all data in correct order to respect foreign key constraints
    const { error: optionsDeleteError } = await supabase.from('options').delete().neq('id', 0);
    if (optionsDeleteError) throw optionsDeleteError;
    
    const { error: productsDeleteError } = await supabase.from('products').delete().neq('id', 0);
    if (productsDeleteError) throw productsDeleteError;
    
    const { error: categoriesDeleteError } = await supabase.from('categories').delete().neq('id', 0);
    if (categoriesDeleteError) throw categoriesDeleteError;

    // Reset the ID sequences to start from 1
    console.log('🔄 Resetting ID sequences to start from 1...');
    const { error: resetSequencesError } = await supabase.rpc('reset_menu_sequences');
    if (resetSequencesError) {
      console.warn('⚠️  Warning: Could not reset ID sequences:', resetSequencesError.message);
      console.log('💡 Menu will still work correctly, but IDs will continue from previous values');
    } else {
      console.log('✅ ID sequences reset successfully - new items will start from ID 1');
    }

    // --- Step 2: Insert new data from menu.ts ---
    let categoryOrder = 1;
    let totalProducts = 0;
    let totalOptions = 0;

    for (const categoryData of menuData) {
      // Insert Category
      console.log(`📁 Inserting category: "${categoryData.category}"`);
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .insert({ 
          name: categoryData.category, 
          sort_order: categoryOrder++ 
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      for (const productData of categoryData.products) {
        // Insert Product
        console.log(`   🍽️  Inserting product: "${productData.name}" (₱${productData.price})`);
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            name: productData.name,
            description: productData.description,
            base_price: productData.price,
            image_url: productData.image,
            owner: productData.owner,
            is_available: productData.is_available,
            category_id: category.id,
          })
          .select()
          .single();
        
        if (productError) throw productError;
        totalProducts++;

        if (productData.options && productData.options.length > 0) {
          // Prepare options for batch insert
          const optionsToInsert = productData.options.map(optionData => ({
            product_id: product.id,
            group_name: optionData.group,
            name: optionData.name,
            additional_price: optionData.price,
            is_available: optionData.is_available,
          }));

          // Batch Insert Options
          console.log(`      ⚙️  Inserting ${optionsToInsert.length} options...`);
          const { error: optionsError } = await supabase
            .from('options')
            .insert(optionsToInsert);

          if (optionsError) throw optionsError;
          totalOptions += optionsToInsert.length;
        }
      }
    }

    console.log('');
    console.log('🎉 Menu synchronization complete!');
    console.log(`📊 Summary:`);
    console.log(`   • ${menuData.length} categories synced`);
    console.log(`   • ${totalProducts} products synced`);
    console.log(`   • ${totalOptions} options synced`);
    console.log('');
    console.log('💡 Your website will now reflect the updated menu!');

  } catch (error: any) {
    console.error('❌ An error occurred during menu synchronization:');
    console.error('   Error:', error.message);
    if (error.details) {
      console.error('   Details:', error.details);
    }
    if (error.hint) {
      console.error('   Hint:', error.hint);
    }
    process.exit(1);
  }
}

// Run the sync
syncMenu(); 