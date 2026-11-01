// Заглушка: лендинг главной — этап 1 (refactor-plan.md, раздел 3).
export default function Home() {
  return (
    <section className="bg-brand-soft">
      <div className="container-page py-20">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Стоматология «Дантист»
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Терапия, хирургия, ортопедия и гигиена полости рта в Кургане.
          Сайт обновляется.
        </p>
      </div>
    </section>
  );
}
