import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised } from '@/lib/auth';
import { listMedia, addMedia, deleteMedia, updateMediaAlt, MediaAsset } from '@/lib/cms/media';

export async function GET(request: NextRequest) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const assets = await listMedia();
  return NextResponse.json(assets);
}

export async function POST(request: NextRequest) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = (await request.json()) as Omit<MediaAsset, 'uploadedAt'>;
  const asset = await addMedia(body);
  return NextResponse.json(asset);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id, alt } = await request.json();
  if (!id || typeof alt !== 'string') return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  await updateMediaAlt(id, alt);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorised(request)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await deleteMedia(id);
  return NextResponse.json({ success: true });
}
