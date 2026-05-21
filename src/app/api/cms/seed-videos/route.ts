import { NextRequest, NextResponse } from 'next/server';
import { videoCount, createVideo } from '@/lib/cms/videos';
import { HIGHLIGHTS, VIDEO_WORKS } from '@/lib/showreel-data';

function isAuthorised(req: NextRequest) {
  const cookie = req.cookies.get('cms-auth')?.value;
  return cookie === (process.env.CMS_SECRET || 'movico2024');
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const existing = await videoCount();
  if (existing > 0) {
    return NextResponse.json({ skipped: true, message: `${existing} videos already in DB` });
  }

  const results = [];

  for (let i = 0; i < HIGHLIGHTS.length; i++) {
    const v = HIGHLIGHTS[i];
    results.push(await createVideo({
      title: v.title,
      client: v.client,
      category: v.category,
      isHighlight: true,
      order: i,
      source: 'drive',
      driveId: v.id,
      thumbnail: v.thumbnail,
    }));
  }

  for (let i = 0; i < VIDEO_WORKS.length; i++) {
    const v = VIDEO_WORKS[i];
    results.push(await createVideo({
      title: v.title,
      client: v.client,
      category: v.category,
      isHighlight: false,
      order: i,
      source: 'drive',
      driveId: v.id,
      thumbnail: v.thumbnail,
    }));
  }

  return NextResponse.json({ seeded: results.length });
}
