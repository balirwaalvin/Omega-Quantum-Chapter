import type { ReactNode } from "react";
import type { Role } from "@/types";

export function RoleGate({
  role,
  allow,
  children,
}: {
  role: Role;
  allow: Role[];
  children: ReactNode;
}) {
  if (!allow.includes(role)) return null;
  return children;
}
