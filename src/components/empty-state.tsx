export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="panel empty-state">
      <p className="eyebrow">시작하기</p>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
    </section>
  );
}
