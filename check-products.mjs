import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, title')
      .limit(5);

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    console.log('Products found:');
    data?.forEach((product) => {
      console.log(`  ID: ${product.id}, Title: ${product.title}`);
    });
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkProducts();
