import type { Service } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/format";

export function PriceTable({ services, caption }: { services: Service[]; caption: string }) {
  if (services.length === 0) {
    return (
      <p className="rounded-2xl bg-surface-muted px-5 py-4 text-sm text-muted">
        Стоимость определяется после консультации врача. Уточняйте в регистратуре.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-brand-soft text-xs tracking-wide text-brand uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">
              Наименование
            </th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">
              Стоимость
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {services.map((service) => (
            <tr key={service.id} className="align-top transition-colors hover:bg-surface-muted">
              <th scope="row" className="px-5 py-4 font-normal">
                {service.name}
                {service.note && <span className="mt-1 block text-sm text-muted">{service.note}</span>}
              </th>
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <span className="font-semibold text-brand-deep">
                  {formatPrice(service.priceFrom, service.priceTo)}
                </span>
                {service.unit && <span className="block text-xs text-muted">{service.unit}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PriceDisclaimer({ updatedAt }: { updatedAt?: Date }) {
  return (
    <p className="text-sm text-muted">
      Цены не являются публичной офертой. Точная стоимость лечения определяется врачом после
      осмотра и согласовывается с пациентом до начала работ.
      {updatedAt &&
        ` Прайс обновлён ${updatedAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}.`}
    </p>
  );
}
