import AdminLayout from "@/components/admin/AdminLayout";
import PagesAdminPanel from "./PagesAdminPanel";

export default function AdminPagesPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">页面管理</h1>
      <PagesAdminPanel />
    </AdminLayout>
  );
}
