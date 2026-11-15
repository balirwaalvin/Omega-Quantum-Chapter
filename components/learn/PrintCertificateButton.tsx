"use client";

export function PrintCertificateButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-gold text-xs print:hidden"
    >
      🖨️ Print / Save Certificate as PDF
    </button>
  );
}
