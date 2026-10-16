"use client";

import dynamic from "next/dynamic";

const BlochSphere = dynamic(
  () => import("@/components/quantum/BlochSphere").then((mod) => mod.BlochSphere),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted">Loading the Bloch sphere…</p>,
  },
);

export function BlochExplorer() {
  return <BlochSphere />;
}
