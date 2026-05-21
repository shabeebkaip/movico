import { NextRequest, NextResponse } from 'next/server';
import { listProjects, listAllProjects, createProject, bulkCreateProjects, projectCount } from '@/lib/cms/projects';

function isAuthorised(req: NextRequest) {
  const cookie = req.cookies.get('cms-auth')?.value;
  return cookie === (process.env.CMS_SECRET || 'movico-cms-2026-xK9mQpLvNz');
}

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') === 'true';
  if (all && !isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const projects = all ? await listAllProjects() : await listProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await req.json();

  if (Array.isArray(body)) {
    const count = await projectCount();
    if (count > 0) {
      return NextResponse.json({ error: 'Projects already seeded' }, { status: 409 });
    }
    const inserted = await bulkCreateProjects(body);
    return NextResponse.json({ inserted }, { status: 201 });
  }

  const project = await createProject(body);
  return NextResponse.json(project, { status: 201 });
}
