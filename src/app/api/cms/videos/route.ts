import { NextRequest, NextResponse } from 'next/server';
import { listVideos, createVideo } from '@/lib/cms/videos';

function isAuthorised(req: NextRequest) {
  const cookie = req.cookies.get('cms-auth')?.value;
  return cookie === (process.env.CMS_SECRET || 'movico2024');
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const videos = await listVideos();
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await req.json();
  const video = await createVideo(body);
  return NextResponse.json(video, { status: 201 });
}
