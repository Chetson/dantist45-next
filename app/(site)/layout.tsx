import { SiteShell } from "@/components/layout/SiteShell";

// Публичный сайт. Админка (/admin) живёт вне этой группы и шапку сайта не получает.
export default function SiteLayout({ children, subnav }: LayoutProps<"/">) {
  return <SiteShell subnav={subnav}>{children}</SiteShell>;
}
