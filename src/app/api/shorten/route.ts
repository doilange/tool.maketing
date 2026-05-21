import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Basic URL validation
    let validUrl: URL;
    try {
      let urlToValidate = url.trim();
      if (!/^https?:\/\//i.test(urlToValidate)) {
        urlToValidate = 'https://' + urlToValidate;
      }
      validUrl = new URL(urlToValidate);
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const id = nanoid(6);

    const { error } = await adminClient
      .from('short_links')
      .insert([
        { id, original_url: validUrl.href }
      ]);

    if (error) {
      console.error('Supabase error inserting short link:', error);
      return NextResponse.json({ error: 'Failed to create short link' }, { status: 500 });
    }

    // Return the short URL path (client will prepend the domain)
    return NextResponse.json({ id, shortUrl: `/s/${id}` });

  } catch (err) {
    console.error('Error shortening URL:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
