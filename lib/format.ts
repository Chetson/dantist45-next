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
