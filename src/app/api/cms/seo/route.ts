import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readSeo, writeSeo } from '@/lib/cms/store';
import { CMSSeo } from '@/lib/cms/types';
import { isAuthorised } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  try {
    const seo = await readSeo();
    return NextResponse.json(seo);
  } catch (err) {
    console.error('[CMS] Failed to read SEO:', err);
    return NextResponse.json({ error: 'Failed to read SEO' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  try {
    const body = (await request.json()) as CMSSeo;
    await writeSeo(body);
    revalidatePath('/', 'layout');
    revalidatePath('/robots.txt');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CMS] Failed to write SEO:', err);
    return NextResponse.json({ error: 'Failed to write SEO' }, { status: 500 });
  }
}
