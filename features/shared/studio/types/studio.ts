import type { LucideIcon } from 'lucide-react';

export type ToolStatus = 'live' | 'soon';

export interface StudioTool {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  accentBorder: string;
  accentText: string;
  href: string;
  status: ToolStatus;
  group: string;
  featured: boolean;
  tags: string[];
}

export interface StudioGroup {
  id: string;
  label: string;
  desc: string;
  dot: string;
}

export interface StudioHeroConfig {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
  privacyNote: string;
  accentFrom: string;
  accentTo: string;
  badgeColor: string;
  pills: {
    icon: LucideIcon;
    label: string;
    color: string;
  }[];
}
