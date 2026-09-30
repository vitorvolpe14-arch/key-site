import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// When KEY shares a Supabase project with another store, its tables carry a prefix
// (VITE_KEY_TABLE_PREFIX=key_) and panel access is checked with is_key_admin().
export const TABLE_PREFIX = String(import.meta.env.VITE_KEY_TABLE_PREFIX || '').trim()
export const SHARED_PROJECT = Boolean(TABLE_PREFIX)
export const table = name => `${TABLE_PREFIX}${name}`
