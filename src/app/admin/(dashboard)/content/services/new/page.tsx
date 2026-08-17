import ServiceForm from "../ServiceForm";
import { listAllServices } from "@/lib/cms/services";

export default async function NewServicePage() {
  const all = await listAllServices();
  const nextOrder = all.length ? Math.max(...all.map((s) => s.order)) + 1 : 0;
  return <ServiceForm defaultOrder={nextOrder} />;
}
