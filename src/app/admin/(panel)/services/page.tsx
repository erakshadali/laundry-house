import { ServicesEditor } from "@/components/admin/AdminBits";
import { listServices } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await listServices();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Services and pricing</h1>
        <p className="text-sm text-muted">Changes go live on the website and booking form immediately.</p>
      </div>
      <ServicesEditor services={services} />
    </div>
  );
}
