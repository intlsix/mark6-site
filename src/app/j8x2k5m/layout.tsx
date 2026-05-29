export default function QuickLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
