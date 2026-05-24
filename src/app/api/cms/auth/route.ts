import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, updateLastLogin } from '@/lib/cms/users';
import { signAdminToken, COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await findUserByEmail(body.email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user._id) void updateLastLogin(user._id);

    const token = signAdminToken(user.email);
    const response = NextResponse.json({ success: true, email: user.email });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 86400 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  } catch (err) {
    console.error('[CMS] Auth error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
