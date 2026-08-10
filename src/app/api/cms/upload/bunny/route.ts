import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised } from '@/lib/auth';

// Issues short-lived, single-video-scoped TUS upload credentials for Bunny
// Stream — mirrors the Cloudinary signed-upload route (upload/signature) but
// for video. The raw BUNNY_STREAM_API_KEY never leaves the server; the
// client only ever sees a SHA256 signature that expires in 1 hour and is
// only valid for the one video guid created below. Signature scheme
// confirmed against live Bunny docs (docs.bunny.net/reference/tus-resumable-uploads):
// SHA256(library_id + api_key + expiration_time + video_id), plain concat, hex digest.
const TUS_ENDPOINT = 'https://video.bunnycdn.com/tusupload';
const EXPIRY_SECONDS = 60 * 60; // 1 hour

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
  const apiKey = process.env.BUNNY_STREAM_API_KEY!;

  let title = 'Untitled';
  try {
    const body = await req.json();
    if (typeof body?.title === 'string' && body.title.trim()) {
      title = body.title.trim().slice(0, 200);
    }
  } catch {
    // no/invalid JSON body — fall back to default title
  }

  const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
    method: 'POST',
    headers: { AccessKey: apiKey, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    console.error('[bunny upload] create-video failed', createRes.status, await createRes.text().catch(() => ''));
    return NextResponse.json({ error: 'Failed to create video' }, { status: 502 });
  }

  const { guid: videoId } = (await createRes.json()) as { guid: string };

  const expirationTime = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS;
  const signature = createHash('sha256')
    .update(libraryId + apiKey + expirationTime + videoId)
    .digest('hex');

  return NextResponse.json({
    videoId,
    libraryId,
    signature,
    expirationTime,
    tusEndpoint: TUS_ENDPOINT,
    // Pull zone hostname is a public CDN host, not a secret (see bunny-video.ts) —
    // returned so the client can build playback/thumbnail URLs immediately after
    // TUS upload completes, without needing its own env access.
    pullZone: process.env.BUNNY_STREAM_PULL_ZONE,
  });
}

// Cleanup for a video shell created above whose TUS byte-upload never
// completed (client error, network drop, browser closed mid-upload) — called
// from CloudinaryUploader's TUS onError so failures don't leave orphan
// zero-byte videos in the Bunny library. Same delete-video API confirmed in
// T0.2 (docs/VIDEO_MIGRATION_PLAN.md "API contract" section).
export async function DELETE(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const videoId = new URL(req.url).searchParams.get('videoId');
  if (!videoId) return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });

  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
  const apiKey = process.env.BUNNY_STREAM_API_KEY!;

  const delRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
    method: 'DELETE',
    headers: { AccessKey: apiKey, accept: 'application/json' },
  });

  if (!delRes.ok && delRes.status !== 404) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
