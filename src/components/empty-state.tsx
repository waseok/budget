export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2 font-headline">시작하기</p>
      <h2 className="text-lg font-bold text-slate-900 font-headline mb-2 mt-0">{title}</h2>
      <p className="text-sm text-slate-400 m-0">{description}</p>
    </section>
  );
}
