import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface Redirect {
  id: string;
  from: string;
  to: string;
  code: 301 | 302;
  enabled: boolean;
}

let redirectsCache: Redirect[] = [];
let cacheExpiry = 0;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const now = Date.now();

  // Refresh redirect list every 60s
  if (now > cacheExpiry) {
    try {
      const apiUrl = new URL('/api/redirects', request.url);
      const res = await fetch(apiUrl.toString(), { cache: 'no-store' });
      if (res.ok) {
        redirectsCache = await res.json();
        cacheExpiry = now + 60_000;
      }
    } catch {
      // fail silently
    }
  }

  const match = redirectsCache.find((r) => r.from === pathname);
  if (match) {
    return NextResponse.redirect(new URL(match.to, request.url), { status: match.code });
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
