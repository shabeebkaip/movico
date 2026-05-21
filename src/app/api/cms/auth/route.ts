import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, updateLastLogin } from '@/lib/cms/users';

export async function POST(request: NextRequest) {
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

    // Update last login (non-blocking)
    if (user._id) void updateLastLogin(user._id);

    const secret = process.env.CMS_SECRET || 'movico-cms-2026-xK9mQpLvNz';
    const response = NextResponse.json({ success: true, email: user.email });
    response.cookies.set('cms-auth', secret, {
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
  response.cookies.set('cms-auth', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
