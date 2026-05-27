import AdminLayout from "@/components/admin/AdminLayout";
import IntlDrawsAdmin from "./IntlDrawsAdmin";

export default function AdminIntlDrawsPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">国际开奖管理</h1>
      <IntlDrawsAdmin />
    </AdminLayout>
  );
}
