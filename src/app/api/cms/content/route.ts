import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readContent, writeContent } from '@/lib/cms/store';
import { CMSContent } from '@/lib/cms/types';
import { isAuthorised } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const content = await readContent();
    return NextResponse.json(content);
  } catch (err) {
    console.error('[CMS] Failed to read content:', err);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CMSContent;
    await writeContent(body);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/studio');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CMS] Failed to write content:', err);
    return NextResponse.json({ error: 'Failed to write content' }, { status: 500 });
  }
}
