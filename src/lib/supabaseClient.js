
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if keys are missing (prevents app crash)
export const supabase = (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
                    order: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
                }),
                order: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
            }),
            upload: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
            insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            update: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }) }),
            delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }) })
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
                remove: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
            })
        },
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            signOut: () => Promise.resolve({})
        }
    };
