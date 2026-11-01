/** «+73522222880» → «+7 (3522) 22-28-80», «+79080011999» → «+7 (908) 001-19-99» */
export function formatPhone(e164: string) {
  const digits = e164.replace(/\D/g, "");
  if (digits.length !== 11) return e164;

  if (digits.startsWith("73522")) {
    const local = digits.slice(5);
    return `+7 (3522) ${local.slice(0, 2)}-${local.slice(2, 4)}-${local.slice(4)}`;
  }
  if (digits.startsWith("7800")) {
    return `8 (800) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  }
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
}

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function formatPrice(priceFrom: number, priceTo?: number | null) {
  return priceTo ? `${rub.format(priceFrom)} — ${rub.format(priceTo)}` : rub.format(priceFrom);
}

export function formatRub(value: number) {
  return rub.format(value);
}

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Даты документов хранятся как DATE (полночь UTC). */
export function formatDate(date: Date) {
  return dateFormat.format(date);
}

export function fullName(person: { lastName: string; firstName: string; middleName: string | null }) {
  return [person.lastName, person.firstName, person.middleName].filter(Boolean).join(" ");
}

export function initials(person: { lastName: string; firstName: string }) {
  return `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`;
}

/** 1 специалист, 2 специалиста, 5 специалистов */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
