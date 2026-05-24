import { notFound } from "next/navigation";
import ProjectForm from "../ProjectForm";
import { listAllProjects } from "@/lib/cms/projects";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const all = await listAllProjects();
  const project = all.find((p) => p._id === id);
  if (!project) notFound();

  return <ProjectForm initialData={project} projectId={id} />;
}
