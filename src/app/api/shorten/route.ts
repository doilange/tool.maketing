import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getDb } from '@/lib/db';

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

    const db = getDb();
    const id = nanoid(6);

    try {
      const stmt = db.prepare('INSERT INTO short_links (id, original_url, created_at) VALUES (?, ?, ?)');
      stmt.run(id, validUrl.href, Math.floor(Date.now() / 1000));
    } catch (dbError) {
      console.error('SQLite error inserting short link:', dbError);
      return NextResponse.json({ error: 'Failed to create short link' }, { status: 500 });
    }

    return NextResponse.json({ id, shortUrl: `/s/${id}` });

  } catch (err) {
    console.error('Error shortening URL:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
