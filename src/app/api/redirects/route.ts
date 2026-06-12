import { NextResponse } from 'next/server';
import { readSeo } from '@/lib/cms/store';

// Public endpoint — redirects are not sensitive data.
// Used by middleware to apply 301/302 redirects without a DB connection.
export async function GET() {
  try {
    const seo = await readSeo();
    const active = seo.redirects.filter((r) => r.enabled);
    return NextResponse.json(active, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
