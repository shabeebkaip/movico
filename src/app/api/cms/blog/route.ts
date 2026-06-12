import { NextRequest, NextResponse } from 'next/server';
import { listPosts, createPost } from '@/lib/cms/blog';
import { isAuthorised } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const all = request.nextUrl.searchParams.get('all') === 'true';
  const posts = await listPosts(!all);
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await request.json();
  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}
