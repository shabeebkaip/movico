import { NextRequest, NextResponse } from 'next/server';
import { createUser, userCount, findUserByEmail, updatePassword } from '@/lib/cms/users';

// One-time setup endpoint — creates the first admin user.
// Blocked once any user exists, unless a valid reset token is provided.
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      resetToken?: string;
    };

    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const count = await userCount();

    // Allow password reset if the correct CMS_SECRET is provided as resetToken
    if (count > 0) {
      const secret = process.env.CMS_SECRET || 'movico-cms-2026-xK9mQpLvNz';
      if (body.resetToken !== secret) {
        return NextResponse.json(
          { error: 'Admin user already exists. Provide resetToken to update password.' },
          { status: 409 }
        );
      }
      // Reset password for existing user
      const user = await findUserByEmail(body.email);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      await updatePassword(user._id!, body.password);
      return NextResponse.json({ updated: true, email: user.email });
    }

    const user = await createUser(body.email, body.password);
    return NextResponse.json({ created: true, email: user.email }, { status: 201 });
  } catch (err) {
    console.error('[CMS] Setup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
