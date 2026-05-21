import { NextResponse } from 'next/server';
import { getShortLink } from '@/lib/short-links';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const originalUrl = await getShortLink(id);

  if (!originalUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const validUrl = new URL(originalUrl);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${validUrl.href}">
  <meta name="robots" content="noindex">
  <script>window.location.replace("${validUrl.href}");</script>
</head>
<body></body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
