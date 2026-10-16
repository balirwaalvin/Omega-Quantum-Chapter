import { Logo } from "@/components/brand/Logo";
import { Motto } from "@/components/brand/Motto";
import { PartnerMark } from "@/components/brand/PartnerMark";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <PartnerMark
            src="/brand/ucu.png"
            alt="Uganda Christian University"
            className="h-11"
          />
          <Logo className="h-12 w-12" />
          <p className="text-sm">
            <span className="font-semibold text-ucu-blue">Omega</span>
            <span className="text-muted"> · UCU Quantum Computing Chapter</span>
          </p>
        </div>
        <PartnerMark
          src="/brand/department.png"
          alt="Department of Computing and Technology"
          className="h-20"
        />
        <Motto className="text-center text-sm text-forest md:text-right" />
      </div>
    </footer>
  );
}
