import { Link } from "@/i18n/navigation";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-text-muted mb-4">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && " › "}
          {item.href ? (
            <Link href={item.href} className="hover:text-gold">{item.label}</Link>
          ) : (
            <span className="text-text">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
