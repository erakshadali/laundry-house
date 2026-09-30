import { OrdersTable } from "@/components/admin/AdminBits";
import { listOrders } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
        <p className="text-sm text-muted">Change status as an order moves along, then message the customer on WhatsApp.</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
