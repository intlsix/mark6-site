import AdminLayout from "@/components/admin/AdminLayout";
import AdminsPanel from "./AdminsPanel";

export default function AdminAdminsPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">管理员管理</h1>
      <AdminsPanel />
    </AdminLayout>
  );
}
