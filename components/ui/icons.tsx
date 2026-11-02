import {
  Crown,
  Gift,
  Sparkles,
  Stethoscope,
  Syringe,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Зуб — в lucide такой иконки нет. Нарисована в той же стилистике (stroke 2). */
export function ToothIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.5 3C5 3 3 5 3 8c0 2.5 1 4 1.6 6.2.6 2.3.9 6.8 2.9 6.8 1.8 0 2-3.4 2.6-5.3.3-.9.9-1.2 1.9-1.2s1.6.3 1.9 1.2c.6 1.9.8 5.3 2.6 5.3 2 0 2.3-4.5 2.9-6.8C20 12 21 10.5 21 8c0-3-2-5-4.5-5-1.9 0-3 1-4.5 1S9.4 3 7.5 3Z" />
    </svg>
  );
}

const categoryIcons: Record<string, LucideIcon | typeof ToothIcon> = {
  stethoscope: Stethoscope,
  tooth: ToothIcon,
  scalpel: Syringe,
  crown: Crown,
  sparkles: Sparkles,
  gift: Gift,
};

/** Имена иконок разделов услуг (поле ServiceCategory.icon). */
export const categoryIconNames = Object.keys(categoryIcons);

export function CategoryIcon({ name, className }: { name: string | null; className?: string }) {
  const Icon = (name && categoryIcons[name]) || ToothIcon;
  return <Icon className={className} aria-hidden="true" />;
}
