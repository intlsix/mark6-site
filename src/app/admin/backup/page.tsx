import AdminLayout from "@/components/admin/AdminLayout";
import BackupManager from "@/components/admin/BackupManager";

export default function AdminBackupPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">数据备份与恢复</h1>
      <BackupManager />
    </AdminLayout>
  );
}
