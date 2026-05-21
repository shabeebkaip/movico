import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readDesign, writeDesign } from '@/lib/cms/store';
import { CMSDesign } from '@/lib/cms/types';

function isAuthorised(request: NextRequest): boolean {
  const cookie = request.cookies.get('cms-auth')?.value;
  const secret = process.env.CMS_SECRET || 'movico2024';
  return cookie === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const design = await readDesign();
    return NextResponse.json(design);
  } catch (err) {
    console.error('[CMS] Failed to read design:', err);
    return NextResponse.json({ error: 'Failed to read design' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CMSDesign;
    await writeDesign(body);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/services');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CMS] Failed to write design:', err);
    return NextResponse.json({ error: 'Failed to write design' }, { status: 500 });
  }
}
