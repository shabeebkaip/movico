import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

function isAuthorised(req: NextRequest) {
  const cookie = req.cookies.get('cms-auth')?.value;
  return cookie === (process.env.CMS_SECRET || 'movico2024');
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { folder = 'movico', resource_type = 'image' } = await req.json();
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = { folder, timestamp };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
