import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Stamp every response with the current pathname so layout.tsx can read it
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  if (!pathname.startsWith('/admin')) return response;
  if (pathname.startsWith('/admin/login')) return response;

  const authCookie = request.cookies.get('cms-auth')?.value;
  const secret = process.env.CMS_SECRET || 'movico-cms-2026-xK9mQpLvNz';

  if (authCookie !== secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}
