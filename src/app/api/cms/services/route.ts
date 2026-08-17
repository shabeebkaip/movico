import { NextRequest, NextResponse } from 'next/server';
import { listServices, listAllServices, createService, bulkCreateServices, serviceCount } from '@/lib/cms/services';
import { isAuthorised } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') === 'true';
  if (all && !isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const services = all ? await listAllServices() : await listServices();
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await req.json();

  if (Array.isArray(body)) {
    const count = await serviceCount();
    if (count > 0) {
      return NextResponse.json({ error: 'Services already seeded' }, { status: 409 });
    }
    const inserted = await bulkCreateServices(body);
    return NextResponse.json({ inserted }, { status: 201 });
  }

  try {
    const service = await createService(body);
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 409 });
  }
}
