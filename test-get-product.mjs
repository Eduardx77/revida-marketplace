import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGetProduct() {
  const testId = '61496e8b-e8e6-4413-a4f9-3c2c642bff54';
  console.log(`Testing getProduct with ID: ${testId}`);

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', testId)
      .single();

    if (error) {
      console.error('Error from Supabase:', error);
      return;
    }

    console.log('✅ Product found:', data);
  } catch (err) {
    console.error('Exception:', err);
  }
}

testGetProduct();
