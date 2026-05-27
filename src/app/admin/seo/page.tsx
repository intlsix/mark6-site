import AdminLayout from "@/components/admin/AdminLayout";
import SeoAdminPanel from "./SeoAdminPanel";

export default function AdminSeoPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">SEO 管理</h1>
      <SeoAdminPanel />
    </AdminLayout>
  );
}
