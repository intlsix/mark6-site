import AdminLayout from "@/components/admin/AdminLayout";
import LogsPanel from "./LogsPanel";

export default function AdminLogsPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">操作日志</h1>
      <LogsPanel />
    </AdminLayout>
  );
}
