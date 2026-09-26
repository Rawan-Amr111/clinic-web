import type { ComponentType } from "react";

export interface StatItem {
  id: number;
  title: string;
  value: string;
  unit?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconBgColor: string;
  iconColor: string;
}

export interface StatCardProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: string;
  unit?: string;
  iconBgColor: string;
  iconColor: string;
}
