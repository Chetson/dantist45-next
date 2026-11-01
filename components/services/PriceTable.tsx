import type { Service } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/format";

/** Прайс в стиле макета: название … отточие … цена. Семантически — таблица. */
export function PriceTable({ services, caption }: { services: Service[]; caption: string }) {
  if (services.length === 0) {
    return (
      <p className="rounded-[1.75rem] bg-white/70 px-6 py-5 text-sm text-muted">
        Стоимость определяется после консультации врача. Уточняйте в регистратуре.
      </p>
    );
  }

  return (
    <table className="w-full text-left text-[15px]">
      <caption className="sr-only">{caption}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Наименование</th>
          <th scope="col">Стоимость</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id} className="border-b border-line/70 align-baseline last:border-0 sm:border-0">
            <th scope="row" className="py-3 pr-3 font-normal">
              {/* Отточие тянется от названия до цены. */}
              <span className="flex items-baseline gap-3">
                <span>
                  {service.name}
                  {service.note && <span className="mt-1 block text-sm text-muted">{service.note}</span>}
                </span>
                <span aria-hidden="true" className="hidden min-w-8 flex-1 translate-y-[-0.2em] border-b-2 border-dotted border-muted/40 sm:block" />
              </span>
            </th>
            <td className="py-3 text-right sm:whitespace-nowrap">
              <span className="font-semibold text-brand-deep">{formatPrice(service.priceFrom, service.priceTo)}</span>
              {service.unit && <span className="block text-xs text-muted">{service.unit}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
