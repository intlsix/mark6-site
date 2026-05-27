import AdminLayout from "@/components/admin/AdminLayout";
import ArticlesAdminPanel from "./ArticlesAdminPanel";

export default function AdminArticlesPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl text-gold font-bold mb-6">文章管理</h1>
      <ArticlesAdminPanel />
    </AdminLayout>
  );
}
