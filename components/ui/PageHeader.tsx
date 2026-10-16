export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">{eyebrow}</p>
      ) : null}
      <h1 className="mt-1 text-2xl font-semibold text-ucu-blue md:text-3xl">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
    </header>
  );
}
