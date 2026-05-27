import AdminLayout from "@/components/admin/AdminLayout";
import ExportPanel from "@/components/admin/ExportPanel";

export default function AdminExportPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">数据导出</h1>
      <ExportPanel />
    </AdminLayout>
  );
}
