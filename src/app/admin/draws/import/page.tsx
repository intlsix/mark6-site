import AdminLayout from "@/components/admin/AdminLayout";
import ImportDropzone from "@/components/admin/ImportDropzone";

export default function AdminImportPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">批量导入</h1>
      <p className="text-sm text-text-muted mb-4">支持 JSON / CSV / TXT · 重复期号自动跳过</p>
      <ImportDropzone />
    </AdminLayout>
  );
}
