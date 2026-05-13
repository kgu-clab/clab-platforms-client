import type { ReactNode } from "react";

interface EmptyStateProps {
  children: ReactNode;
}

export default function EmptyState({ children }: EmptyStateProps) {
  return <p className="text-14-regular text-gray-4 py-lg">{children}</p>;
}
