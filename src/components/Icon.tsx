import {
  Github,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Code,
  Contact,
  Article,
} from "lucide-react";

type IconProps = {
  icon: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Iconify → Local Icon Adapter
 * 只在这里维护映射关系
 */
export function Icon({ icon, size = 20, style, className }: IconProps) {
  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    console.warn(`[Icon] Unknown icon: ${icon}`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      style={style}
      className={className}
    />
  );
}

/**
 * iconify-name -> lucide component
 */
const iconMap: Record<string, React.FC<any>> = {
  // ===== pixelarticons =====
  "pixelarticons:github": Github,
  "pixelarticons:mail": Mail,
  "pixelarticons:user": User,
  "pixelarticons:chevron-left": ChevronLeft,
  "pixelarticons:chevron-right": ChevronRight,
  "pixelarticons:arrow-right": ArrowRight,
  "pixelarticons:external-link": ExternalLink,
  "pixelarticons:book-open": BookOpen,
  "pixelarticons:code": Code,
  "pixelarticons:contact": Contact,
  "pixelarticons:article": Article,
};
