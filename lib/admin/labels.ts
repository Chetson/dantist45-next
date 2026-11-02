import type {
  AnnouncementLevel,
  DoctorsWidgetMode,
  StaffDocType,
  StaffKind,
} from "@/generated/prisma/enums";

// Подписи значений перечислений из схемы для форм и таблиц админки.

export const staffKindLabels: Record<StaffKind, string> = {
  DOCTOR: "Врач",
  NURSE: "Средний медперсонал",
  OTHER: "Другой персонал",
};

export const staffDocTypeLabels: Record<StaffDocType, string> = {
  DIPLOMA: "Диплом об образовании",
  RETRAINING: "Профессиональная переподготовка",
  QUALIFICATION: "Повышение квалификации",
  CERTIFICATE: "Сертификат специалиста",
  ACCREDITATION: "Аккредитация",
};

export const announcementLevelLabels: Record<AnnouncementLevel, string> = {
  INFO: "Информация",
  WARNING: "Важно",
  CRITICAL: "Срочно",
};

export const widgetModeLabels: Record<DoctorsWidgetMode, string> = {
  AUTO: "Первые врачи по порядку",
  SELECTED: "Только отмеченные «на главной»",
  HIDDEN: "Не показывать",
};

/** Подписи иконок разделов услуг (components/ui/icons.tsx). */
export const categoryIconLabels: Record<string, string> = {
  stethoscope: "Стетоскоп",
  tooth: "Зуб",
  scalpel: "Шприц",
  crown: "Коронка",
  sparkles: "Блеск",
  gift: "Подарок",
};
