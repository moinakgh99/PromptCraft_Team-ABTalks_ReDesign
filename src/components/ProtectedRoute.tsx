import { Navigate } from "react-router-dom";
import { useStore, type Role } from "@/store";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  required?: Role;
}

export default function ProtectedRoute({ children, required }: Props) {
  const { role } = useStore();
  if (!role) return <Navigate to="/login" replace />;
  if (required && role !== required) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
