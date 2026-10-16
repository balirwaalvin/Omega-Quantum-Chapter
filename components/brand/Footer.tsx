import { Motto } from "@/components/brand/Motto";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          <span className="font-semibold text-ucu-blue">Omega</span>
          <span> · UCU Quantum Computing Chapter</span>
        </p>
        <Motto className="text-forest" />
      </div>
    </footer>
  );
}
