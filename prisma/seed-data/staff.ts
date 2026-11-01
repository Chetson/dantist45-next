// Сотрудники из документов «Врачи_7 мкр.docx» и «Врачи_2 мкр.docx».
// TODO(клиника): данные, требующие уточнения, помечены комментариями.

import type { StaffDocType, StaffKind } from "../../generated/prisma/enums";

export type SeedStaffDocument = {
  type: StaffDocType;
  number?: string;
  issuedAt?: string;
  organization?: string;
  specialty?: string;
  qualification?: string;
  note?: string;
};

export type SeedStaff = {
  fullName: string;
  kind: StaffKind;
  specialties: string;
  /** slug филиала → должность в нём */
  clinics: Record<string, string>;
  showOnHome?: boolean;
  documents: SeedStaffDocument[];
};

const KBMK = "Курганский базовый медицинский колледж";
const KBMU = "Курганское базовое медицинское училище";

export const staff: SeedStaff[] = [
  // ─── Врачи ──────────────────────────────────────────────────────────
  {
    fullName: "Казанцев Олег Александрович",
    kind: "DOCTOR",
    specialties: "врач-стоматолог, стоматолог-ортопед, зубной техник",
    clinics: {
      "mkr-2": "заведующий медицинской организацией",
      "mkr-7": "заведующий медицинской организацией",
    },
    showOnHome: true,
    documents: [
      {
        type: "DIPLOMA",
        number: "ДВС 1272891, рег. № 106",
        issuedAt: "2005-06-27",
        organization:
          "ГОУ ВПО «Уральская государственная медицинская академия», г. Екатеринбург",
        specialty: "Стоматология",
        qualification: "Врач",
      },
      {
        type: "RETRAINING",
        number: "ППЕ № 015943, рег. № 17175",
        issuedAt: "2012-12-15",
        organization:
          "ГБОУ ВПО «Северо-Западный государственный медицинский университет имени И. И. Мечникова»",
        specialty: "Организация здравоохранения и общественное здоровье",
      },
      {
        type: "RETRAINING",
        number: "ПП № 359093, рег. № 22210/5606",
        issuedAt: "2007-07-11",
        organization: "Омская государственная медицинская академия",
        specialty: "Стоматология ортопедическая",
      },
    ],
  },
  {
    fullName: "Коломин Владимир Сергеевич",
    kind: "DOCTOR",
    specialties: "стоматолог-ортопед, стоматолог-хирург",
    clinics: { "mkr-7": "стоматолог-ортопед, стоматолог-хирург" },
    showOnHome: true,
    documents: [
      {
        type: "DIPLOMA",
        issuedAt: "2009-06-29",
        organization:
          "ГОУ ВПО «Уральская государственная медицинская академия Федерального агентства по здравоохранению и социальному развитию», г. Екатеринбург",
        specialty: "Стоматология",
        qualification: "Врач",
      },
      {
        type: "ACCREDITATION",
        number: "7722 028773075",
        issuedAt: "2022-12-27",
        specialty: "Стоматология ортопедическая",
      },
      {
        type: "ACCREDITATION",
        number: "7723 030448772",
        issuedAt: "2023-06-27",
        specialty: "Стоматология хирургическая",
      },
    ],
  },
  {
    fullName: "Евдошенко Александр Андреевич",
    kind: "DOCTOR",
    specialties: "стоматолог-хирург",
    clinics: { "mkr-7": "стоматолог-хирург" },
    showOnHome: true,
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ/5772205",
        issuedAt: "2006-06-21",
        organization: KBMK,
        specialty: "Стоматология",
        qualification: "Зубной врач",
      },
      {
        type: "DIPLOMA",
        number: "106324/3479527",
        issuedAt: "2019-01-24",
        organization: "Самарский государственный медицинский университет",
        specialty: "Стоматология",
        qualification: "Врач-стоматолог",
      },
      {
        type: "ACCREDITATION",
        number: "6322 017394280",
        issuedAt: "2022-12-05",
        specialty: "Стоматология хирургическая",
      },
      {
        type: "ACCREDITATION",
        number: "7724 031892488",
        issuedAt: "2024-05-21",
        specialty: "Стоматология общей практики",
      },
    ],
  },
  {
    fullName: "Иванов Евгений Иванович",
    kind: "DOCTOR",
    specialties: "стоматолог-ортопед",
    clinics: { "mkr-2": "стоматолог-ортопед" },
    showOnHome: true,
    documents: [
      {
        type: "DIPLOMA",
        number: "102124 6315440, рег. № 9833",
        issuedAt: "2022-07-05",
        organization:
          "ФГБОУ ВО «Чувашский государственный университет имени И. Н. Ульянова», г. Чебоксары",
        qualification: "Врач-стоматолог",
      },
      {
        type: "DIPLOMA",
        number: "102124 160729, рег. № 1782",
        issuedAt: "2024-07-01",
        specialty: "31.08.75 Стоматология ортопедическая",
        note: "Диплом об окончании ординатуры",
      },
      {
        type: "ACCREDITATION",
        number: "2122 030702684",
        issuedAt: "2022-07-20",
        specialty: "Стоматология общей практики",
      },
      {
        type: "ACCREDITATION",
        number: "2124 032043679",
        issuedAt: "2024-07-10",
        specialty: "Стоматология ортопедическая",
      },
    ],
  },
  {
    fullName: "Штаченко Ольга Васильевна",
    kind: "DOCTOR",
    specialties: "стоматолог-хирург",
    clinics: { "mkr-2": "стоматолог-хирург" },
    showOnHome: true,
    documents: [
      {
        type: "DIPLOMA",
        number: "ВСБ/0952323",
        issuedAt: "2006-06-22",
        organization: "ГОУ ВПО «Омская государственная медицинская академия»",
        specialty: "Стоматология",
        qualification: "Врач",
      },
      // TODO(клиника): в документе номер свидетельства об аккредитации не заполнен.
    ],
  },

  // ─── Зубные врачи ───────────────────────────────────────────────────
  {
    fullName: "Баранова Елена Владимировна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-7": "зубной врач" },
    showOnHome: true,
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ/0045744, рег. № 280",
        issuedAt: "1998-06-26",
        organization: KBMU,
        qualification: "Зубной врач",
      },
      {
        type: "ACCREDITATION",
        number: "7723 030743999",
        issuedAt: "2023-04-25",
        specialty: "Стоматология",
        note: "Периодическая аккредитация",
      },
    ],
  },
  {
    fullName: "Бачурина Ольга Владимировна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-7": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ/5237754, рег. № 265",
        issuedAt: "2006-06-23",
        organization: KBMK,
        qualification: "Зубной врач",
      },
      {
        type: "ACCREDITATION",
        number: "7723 029955365",
        issuedAt: "2023-05-30",
        specialty: "Стоматология",
        note: "Периодическая аккредитация",
      },
    ],
  },
  {
    fullName: "Шкилева Марина Александровна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-7": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "45 БА/0001772, рег. № 495",
        issuedAt: "2008-06-28",
        organization: KBMK,
        qualification: "Зубной врач",
      },
      {
        type: "ACCREDITATION",
        number: "7723 030346092",
        issuedAt: "2023-02-28",
        specialty: "Стоматология",
        note: "Периодическая аккредитация",
      },
    ],
  },
  {
    fullName: "Федотова Ксения Николаевна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-7": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ/4437967, рег. № 265",
        issuedAt: "2004-06-28",
        organization: KBMK,
        qualification: "Зубной врач",
      },
      {
        type: "ACCREDITATION",
        number: "7723 031063997",
        issuedAt: "2023-08-29",
        specialty: "Стоматология",
        note: "Периодическая аккредитация",
      },
    ],
  },
  {
    fullName: "Леванде Светлана Мироновна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-7": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СТ № 647530, рег. № 779",
        issuedAt: "1994-06-27",
        organization: KBMU,
        qualification: "Зубной врач",
      },
      {
        type: "ACCREDITATION",
        number: "7724 031702050",
        issuedAt: "2024-02-27",
        specialty: "Стоматология",
        note: "Периодическая аккредитация",
      },
    ],
  },
  {
    fullName: "Басманова Нина Трофимовна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-2": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "рег. № 280",
        issuedAt: "1981-07-03",
        organization: KBMU,
        qualification: "Зубной врач",
      },
      {
        type: "QUALIFICATION",
        number: "772423823006, рег. № 01/25-У37",
        issuedAt: "2025-01-13",
        organization: "г. Москва",
        specialty: "Стоматология",
      },
      {
        type: "ACCREDITATION",
        number: "7725 032939979",
        issuedAt: "2025-05-27",
        specialty: "Стоматология",
      },
    ],
  },
  {
    fullName: "Полякова Людмила Вячеславовна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-2": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "ПТ-I № 364832",
        issuedAt: "1994-06-30",
        organization:
          "Петропавловское медицинское училище Северо-Казахстанской области",
        specialty: "Стоматология",
        qualification: "Зубной врач",
      },
      {
        type: "QUALIFICATION",
        number: "772421761597, рег. № 04/24-У833",
        issuedAt: "2024-04-18",
        organization: "г. Москва",
        specialty: "Стоматология",
      },
      {
        type: "ACCREDITATION",
        number: "7724 031951940",
        issuedAt: "2024-06-25",
        specialty: "Стоматология",
      },
    ],
  },
  {
    fullName: "Кузнецова Елена Николаевна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-2": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ 3020709",
        issuedAt: "2002-06-27",
        organization: `${KBMK}, г. Курган`,
        specialty: "Стоматология",
      },
      {
        type: "ACCREDITATION",
        number: "7722 030593748",
        issuedAt: "2022-04-28",
        specialty: "Стоматология",
      },
    ],
  },
  {
    fullName: "Осипова Татьяна Валентиновна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-2": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СТ-I № 331496",
        issuedAt: "1996-06-28",
        organization: KBMK,
        specialty: "Стоматология",
        qualification: "Зубной врач",
      },
      {
        type: "CERTIFICATE",
        number: "0155240297917, рег. № 45320",
        issuedAt: "2024-05-31",
        organization: "Омская государственная медицинская академия",
      },
      {
        type: "ACCREDITATION",
        number: "7724 031786366",
        issuedAt: "2024-03-26",
        specialty: "Стоматология",
      },
    ],
  },
  {
    fullName: "Кустова Юлия Владимировна",
    kind: "DOCTOR",
    specialties: "зубной врач",
    clinics: { "mkr-2": "зубной врач" },
    documents: [
      {
        type: "DIPLOMA",
        number: "45 БА 0001789, рег. № 512",
        issuedAt: "2008-06-23",
        organization: KBMK,
        specialty: "Стоматология",
        qualification: "Зубной врач",
      },
      {
        type: "QUALIFICATION",
        number: "622418330313, рег. № 005425/22",
        issuedAt: "2022-11-11",
      },
      {
        type: "ACCREDITATION",
        number: "7723 030775989",
        issuedAt: "2023-04-25",
        specialty: "Стоматология",
      },
    ],
  },

  // ─── Средний медицинский персонал ──────────────────────────────────
  {
    fullName: "Мезева Светлана Сергеевна",
    kind: "NURSE",
    specialties: "медицинская сестра, рентгенолаборант",
    clinics: { "mkr-7": "медицинская сестра", "mkr-2": "рентгенолаборант" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ/1798102, рег. № 458",
        issuedAt: "1999-12-24",
        organization: KBMK,
        specialty: "Сестринское дело",
        qualification: "Медицинская сестра",
      },
      {
        type: "QUALIFICATION",
        number: "7724 21112342, рег. № 12/23-У3151",
        issuedAt: "2023-12-14",
        organization: "г. Москва",
        specialty: "Сестринское дело",
      },
      {
        type: "ACCREDITATION",
        number: "7723 031615157",
        issuedAt: "2023-12-26",
        specialty: "Сестринское дело",
      },
      {
        type: "CERTIFICATE",
        number: "0845180615632, рег. № 2165",
        issuedAt: "2016-12-20",
        organization: KBMK,
        specialty: "Рентгенология",
        qualification: "Рентгенолаборант",
      },
      {
        type: "RETRAINING",
        number: "542413778570, рег. № ДНМ00407/20",
        issuedAt: "2020-12-31",
        organization: "АНО ДПО «СИНМО»",
        specialty: "Рентгенология. Лабораторное дело в рентгенологии",
      },
      {
        type: "CERTIFICATE",
        number: "1154242739017, рег. № СНМ01782/20",
        issuedAt: "2020-12-31",
        specialty: "Рентгенология",
      },
      {
        type: "QUALIFICATION",
        number: "22202 № 50-1, рег. № 22202-50-1",
        issuedAt: "2022-08-12",
      },
      {
        type: "ACCREDITATION",
        number: "7726 033895565",
        issuedAt: "2026-01-13",
        specialty: "Рентгенология",
      },
    ],
  },
  {
    fullName: "Филиппова Нина Михайловна",
    kind: "NURSE",
    specialties: "медицинская сестра",
    clinics: { "mkr-7": "медицинская сестра" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ/6697321",
        issuedAt: "2006-06-21",
        organization: `ГБУ СПО «${KBMK}»`,
        specialty: "Акушерское дело",
        qualification: "Акушерка/акушер",
      },
      {
        type: "QUALIFICATION",
        number: "7724 24715161, рег. № 04/25-У1511",
        issuedAt: "2025-04-21",
        organization: "г. Москва",
        specialty: "Сестринское дело",
      },
      // TODO(клиника): у обоих свидетельств об аккредитации в документе нет даты.
      {
        type: "ACCREDITATION",
        number: "7725 033422038",
        specialty: "Сестринское дело",
      },
      {
        type: "RETRAINING",
        number: "772410918909, рег. № 2012-30926",
        issuedAt: "2020-12-04",
        organization: "«Центральный многопрофильный институт», г. Москва",
        specialty: "Рентгенология",
        qualification: "Рентгенолаборант",
      },
      {
        type: "ACCREDITATION",
        number: "7726 033898183",
        specialty: "Рентгенология",
      },
    ],
  },
  {
    fullName: "Скокова Алёна Хайбуллоевна",
    kind: "NURSE",
    specialties: "медицинская сестра",
    clinics: { "mkr-7": "медицинская сестра" },
    documents: [
      {
        type: "DIPLOMA",
        number: "114516 0117182, рег. № 36",
        issuedAt: "2017-06-22",
        organization: `«${KBMK}», п. Юргамыш`,
        specialty: "34.02.01 Сестринское дело",
      },
      {
        type: "QUALIFICATION",
        number: "7724 24427099, рег. № 03/25-У1134",
        issuedAt: "2025-03-21",
        organization: "г. Москва",
        specialty: "Сестринское дело",
      },
      // TODO(клиника): номер и дата совпадают со свидетельством Мезевой С. С. —
      // вероятно, ошибка копирования в исходном документе.
      {
        type: "ACCREDITATION",
        number: "7723 031615157",
        issuedAt: "2023-12-26",
        specialty: "Сестринское дело",
      },
    ],
  },
  {
    fullName: "Горбунова Оксана Ивановна",
    kind: "NURSE",
    specialties: "медицинская сестра",
    clinics: { "mkr-2": "медицинская сестра" },
    documents: [
      {
        type: "DIPLOMA",
        number: "СБ 1798195",
        issuedAt: "1999-12-24",
        organization: `${KBMK}, г. Курган`,
        specialty: "Сестринское дело",
      },
      {
        type: "QUALIFICATION",
        number: "772421761650, рег. № 04/24-У886",
        issuedAt: "2024-04-15",
        organization: "г. Москва",
        specialty: "Сестринское дело в стоматологии",
      },
      {
        type: "ACCREDITATION",
        number: "7725 032672541",
        issuedAt: "2025-02-25",
        specialty: "Сестринское дело",
      },
    ],
  },
  {
    fullName: "Ситяева Карина Михайловна",
    kind: "NURSE",
    specialties: "медицинская сестра",
    clinics: { "mkr-2": "медицинская сестра" },
    documents: [
      {
        type: "DIPLOMA",
        number: "000000152",
        issuedAt: "2020-06-30",
        organization: `ГБПОУ «${KBMK}», г. Курган`,
        specialty: "Сестринское дело",
      },
      {
        type: "QUALIFICATION",
        number: "772421761634, рег. № 05/24-У870",
        issuedAt: "2024-05-13",
        organization: "г. Москва",
        specialty: "Сестринское дело",
      },
      // TODO(клиника): в документе номер свидетельства об аккредитации не заполнен.
    ],
  },
  {
    fullName: "Дыбань Валентина Юрьевна",
    kind: "NURSE",
    specialties: "медицинская сестра",
    clinics: { "mkr-2": "медицинская сестра" },
    documents: [
      {
        type: "DIPLOMA",
        number: "45 БА 000612",
        issuedAt: "2007-06-21",
        organization:
          "ГОУ СПО «Макушинское медицинское училище»",
        specialty: "Сестринское дело",
      },
      {
        type: "QUALIFICATION",
        number: "772423823007, рег. № 01/25-У38",
        issuedAt: "2025-01-13",
        organization: "г. Москва",
        specialty: "Сестринское дело в стоматологии",
      },
      {
        type: "ACCREDITATION",
        number: "7725 032762907",
        issuedAt: "2025-03-25",
        specialty: "Сестринское дело",
      },
    ],
  },
];
