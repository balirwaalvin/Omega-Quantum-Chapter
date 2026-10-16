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
    <header className="mb-5">
      {eyebrow ? (
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-alpha-blue">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-0.5 text-xl font-bold text-ucu-blue md:text-2xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 max-w-xl text-xs leading-5 text-muted sm:text-sm">
          {description}
        </p>
      ) : null}
    </header>
  );
}

