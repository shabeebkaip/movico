import { NextRequest, NextResponse } from 'next/server';
import { updateVideo, deleteVideo } from '@/lib/cms/videos';
import { isAuthorised } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  await updateVideo(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  await deleteVideo(id);
  return NextResponse.json({ success: true });
}
