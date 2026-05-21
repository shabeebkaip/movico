import { NextRequest, NextResponse } from 'next/server';
import { listClients, listAllClients, createClient, bulkCreateClients, clientCount } from '@/lib/cms/clients';

function isAuthorised(req: NextRequest) {
  const cookie = req.cookies.get('cms-auth')?.value;
  return cookie === (process.env.CMS_SECRET || 'movico-cms-2026-xK9mQpLvNz');
}

export async function GET(req: NextRequest) {
  // Public reads allowed (frontend marquee); ?all=true requires auth (admin list)
  const all = req.nextUrl.searchParams.get('all') === 'true';
  if (all && !isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const clients = all ? await listAllClients() : await listClients();
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await req.json();

  // Bulk seed
  if (Array.isArray(body)) {
    const count = await clientCount();
    if (count > 0) {
      return NextResponse.json({ error: 'Clients already seeded' }, { status: 409 });
    }
    const inserted = await bulkCreateClients(body);
    return NextResponse.json({ inserted }, { status: 201 });
  }

  const client = await createClient(body);
  return NextResponse.json(client, { status: 201 });
}
