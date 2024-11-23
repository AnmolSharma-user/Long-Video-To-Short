import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// User operations
export async function createUser(data: {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
}) {
  const { error } = await supabase.from('users').insert(data);
  if (error) throw error;
}

export async function updateUser(
  userId: string,
  data: { name?: string; avatar_url?: string }
) {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId);
  if (error) throw error;
}

// Video operations
export async function createVideo(
  userId: string,
  data: {
    title: string;
    original_url?: string;
    original_file?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    settings: {
      duration: number;
      enhance: boolean;
      captions: boolean;
      background_music?: string;
    };
  }
) {
  const { error } = await supabase.from('videos').insert({
    user_id: userId,
    title: data.title,
    original_url: data.original_url,
    original_file: data.original_file,
    status: data.status,
    settings: data.settings,
  });
  if (error) throw error;
}

export async function updateVideoStatus(
  videoId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  error?: string
) {
  const { error: dbError } = await supabase
    .from('videos')
    .update({ status, error: error || null })
    .eq('id', videoId);
  if (dbError) throw dbError;
}

export async function addVideoOutput(videoId: string, outputFile: string) {
  const { data: video, error: fetchError } = await supabase
    .from('videos')
    .select('output_files')
    .eq('id', videoId)
    .single();
  if (fetchError) throw fetchError;

  const outputFiles = [...(video?.output_files || []), outputFile];
  const { error: updateError } = await supabase
    .from('videos')
    .update({ output_files: outputFiles })
    .eq('id', videoId);
  if (updateError) throw updateError;
}

// Credits operations
export async function getUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('credits')
    .select('amount')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.amount ?? 0;
}

export async function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'bonus',
  description?: string
) {
  const { error } = await supabase.from('credits').insert({
    user_id: userId,
    amount,
    transaction_type: type,
    description,
  });
  if (error) throw error;
}

export async function useCredits(
  userId: string,
  amount: number,
  description: string
) {
  const { error } = await supabase.from('credits').insert({
    user_id: userId,
    amount: -amount,
    transaction_type: 'usage',
    description,
  });
  if (error) throw error;
}

// Subscription operations
export async function getActiveSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createSubscription(data: {
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  trial_start?: string | null;
  trial_end?: string | null;
}) {
  const { error } = await supabase.from('subscriptions').insert(data);
  if (error) throw error;
}

export async function updateSubscription(
  subscriptionId: string,
  data: Partial<{
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at: string | null;
    canceled_at: string | null;
    trial_start: string | null;
    trial_end: string | null;
  }>
) {
  const { error } = await supabase
    .from('subscriptions')
    .update(data)
    .eq('stripe_subscription_id', subscriptionId);
  if (error) throw error;
}