// ============================================================================
// Title: Shared UI Primitives | عناصر واجهة مشتركة
// Description (EN): Reusable presentational building blocks (panel, toggle switch, badge, section heading, cyber button) styled with the cyber-tech aesthetic and shared across views.
// الوصف (AR): لبنات عرض قابلة لإعادة الاستخدام (لوح، مفتاح تبديل، شارة، عنوان قسم، زر سيبراني) مصممة بالمظهر السيبراني ومشتركة عبر الواجهات.
// ============================================================================

import type { ReactNode } from "react";

/* Title: Cyber Panel | لوح سيبراني
   Description (EN): A bordered surface container with optional title, icon, and glow accent used to group content sections.
   الوصف (AR): حاوية سطح بحدود اختيارية العنوان والأيقونة وتوهج الزخرفة تُستخدم لتجميع أقسام المحتوى.
*/
export function CyberPanel({
  title,
  icon,
  children,
  className = "",
  accent = "cyan",
}: {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  accent?: "cyan" | "green" | "red" | "amber";
}) {
  const glow =
    accent === "green" ? "glow-green" : accent === "red" ? "glow-red" : accent === "amber" ? "glow-amber" : "glow-cyan";
  const border =
    accent === "green" ? "border-emerald-500/30" : accent === "red" ? "border-rose-500/30" : accent === "amber" ? "border-amber-500/30" : "border-cyan-500/30";
  return (
    <div className={`rounded-xl border ${border} bg-[#0d1424]/80 backdrop-blur-sm ${glow} ${className}`}>
      {title && (
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          {icon && <span className="text-cyan-400">{icon}</span>}
          <h3 className="text-sm font-semibold tracking-wide text-slate-200">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

/* Title: Toggle Switch | مفتاح تبديل
   Description (EN): An animated on/off toggle used for the protection mode switch, with colored states and labels.
   الوصف (AR): مفتاح تشغيل/إيقاف متحرك يُستخدم لمفتاح وضع الحماية، بحالات ملوّنة وملصقات.
*/
export function ToggleSwitch({
  on,
  onToggle,
  onLabel = "ON",
  offLabel = "OFF",
}: {
  on: boolean;
  onToggle: () => void;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex h-9 w-20 items-center rounded-full border transition-colors duration-300 ${
        on ? "border-emerald-400/60 bg-emerald-500/20" : "border-rose-400/60 bg-rose-500/20"
      }`}
    >
      <span
        className={`absolute left-1 inline-flex h-7 w-7 transform items-center justify-center rounded-full text-xs font-bold transition-transform duration-300 ${
          on ? "translate-x-11 bg-emerald-400 text-emerald-950" : "translate-x-0 bg-rose-400 text-rose-950"
        }`}
      >
        <span className={`text-[10px] ${on ? "opacity-0" : "opacity-0"}`}></span>
      </span>
      <span className={`pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold tracking-wider`}>
        <span className={on ? "text-emerald-300/0" : "text-rose-300"}>{offLabel}</span>
        <span className={on ? "text-emerald-300" : "text-rose-300/0"}>{onLabel}</span>
      </span>
    </button>
  );
}

/* Title: Badge | شارة
   Description (EN): A small status pill with a color variant.
   الوصف (AR): حبة حالة صغيرة بلون متغير.
*/
export function Badge({
  children,
  color = "cyan",
}: {
  children: ReactNode;
  color?: "cyan" | "green" | "red" | "amber" | "slate";
}) {
  const map = {
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    red: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    slate: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${map[color]}`}>
      {children}
    </span>
  );
}

/* Title: Cyber Button | زر سيبراني
   Description (EN): A styled action button with variants (primary, danger, ghost) and disabled state.
   الوصف (AR): زر إجراء مصمم بأنماط (أساسي، خطر، شبحي) وحالة معطّلة.
*/
export function CyberButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "ghost" | "success";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: "bg-cyan-500/15 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400",
    success: "bg-emerald-500/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400",
    danger: "bg-rose-500/15 border-rose-400/50 text-rose-300 hover:bg-rose-500/25 hover:border-rose-400",
    ghost: "bg-transparent border-slate-600/50 text-slate-300 hover:bg-slate-500/10 hover:border-slate-500",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
