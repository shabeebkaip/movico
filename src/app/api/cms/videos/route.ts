import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { listVideos, createVideo } from '@/lib/cms/videos';
import { isAuthorised } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const videos = await listVideos();
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await req.json();
  const video = await createVideo(body);
  revalidatePath('/showreel');
  return NextResponse.json(video, { status: 201 });
}
