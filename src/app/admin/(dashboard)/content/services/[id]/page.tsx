import { notFound } from "next/navigation";
import ServiceForm from "../ServiceForm";
import { listAllServices } from "@/lib/cms/services";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const all = await listAllServices();
  const service = all.find((s) => s._id === id);
  if (!service) notFound();

  return <ServiceForm initialData={service} serviceId={id} />;
}
