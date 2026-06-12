import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/cms/blog';
import { isAuthorised } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  await updatePost(id, body);
  revalidatePath('/blog');
  revalidatePath(`/blog/${body.slug ?? ''}`);
  revalidatePath('/sitemap.xml');
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  await deletePost(id);
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');
  return NextResponse.json({ success: true });
}
