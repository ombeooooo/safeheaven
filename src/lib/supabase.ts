import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const isExtension = typeof chrome !== 'undefined' && chrome.storage;

if (isExtension) {
  chrome.storage.local.set({
    supabaseUrl,
    supabaseAnonKey
  }).catch(error => {
    console.error('Error syncing Supabase credentials to extension storage:', error);
  });
}
