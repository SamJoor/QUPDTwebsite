import { defaultAboutPageContent, defaultHomePageContent } from '@/lib/constants/site';
import { readDemoStore } from '@/lib/demo-store';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AboutPageContent, HomePageContent } from '@/types';

function mergeContent<T extends Record<string, string>>(defaults: T, rows: { content_key: string; content_value: string | null }[] | null | undefined): T {
  const result = { ...defaults } as Record<string, string>;
  for (const row of rows || []) {
    if (row.content_key in result && row.content_value) result[row.content_key] = row.content_value;
  }
  return result as T;
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return (await readDemoStore()).siteContent.home;

  const { data, error } = await supabase.from('site_content').select('content_key, content_value').eq('page_slug', 'home');
  if (error || !data?.length) return defaultHomePageContent;
  return mergeContent(defaultHomePageContent, data as { content_key: string; content_value: string | null }[]);
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return (await readDemoStore()).siteContent.about;

  const { data, error } = await supabase.from('site_content').select('content_key, content_value').eq('page_slug', 'about');
  if (error || !data?.length) return defaultAboutPageContent;
  return mergeContent(defaultAboutPageContent, data as { content_key: string; content_value: string | null }[]);
}
