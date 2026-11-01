import { PageTransition } from "@/components/layout/PageTransition";

// Шаблон пересоздаётся при переходе на другую страницу этого уровня —
// это и запускает анимацию смены страниц.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
