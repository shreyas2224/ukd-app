import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnbwrwfdibaxdkpbyiiu.supabase.co'
const supabaseKey = 'sb_publishable_G0MI-EP7CgLFqMIBetSHzA_WxtrpIQh' // Paste the copied key here

export const supabase = createClient(supabaseUrl, supabaseKey)