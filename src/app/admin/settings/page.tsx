import AdminLayout from "@/components/admin/AdminLayout";
import SettingsPanel from "./SettingsPanel";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">系统设置</h1>
      <SettingsPanel />
    </AdminLayout>
  );
}
