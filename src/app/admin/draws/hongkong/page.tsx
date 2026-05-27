import AdminLayout from "@/components/admin/AdminLayout";
import HkDrawsAdmin from "./HkDrawsAdmin";

export default function AdminHkDrawsPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">香港开奖管理</h1>
      <HkDrawsAdmin />
    </AdminLayout>
  );
}
