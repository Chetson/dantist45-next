import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Админка", template: "%s — админка «Дантист»" },
  robots: { index: false, follow: false },
};

// Админка — отдельная от сайта оболочка, без шапки и футера (они в группе (site)).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>;
}
