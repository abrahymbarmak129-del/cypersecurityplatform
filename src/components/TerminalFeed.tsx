// ============================================================================
// Title: Terminal Feed | تغذية الطرفية
// Description (EN): Renders the live simulation log as a cyber terminal with colored severity levels, timestamps, and the message in the active language only (not both). Includes auto-scroll and a scanline overlay effect.
// الوصف (AR): يعرض سجل المحاكاة الحي كطرفية سيبرانية بمستويات خطورة ملوّنة وطوابع زمنية والرسالة باللغة النشطة فقط (ليس كليهما). يتضمن تمريرًا تلقائيًا وتأثير خط المسح.
// ============================================================================

import { useEffect, useRef } from "react";
import type { LogEntry } from "../lib/types";
import { useLang } from "../i18n";

/* Title: Level Styling Map | خريطة تنسيق المستويات
   Description (EN): Maps a log severity level to its text color and prefix symbol.
   الوصف (AR): تربط مستوى خطورة السجل بلون النص ورمز البادئة.
*/
const LEVEL_STYLE: Record<LogEntry["level"], { color: string; prefix: string }> = {
  info: { color: "text-slate-400", prefix: "»" },
  success: { color: "text-emerald-400", prefix: "✓" },
  warning: { color: "text-amber-400", prefix: "⚠" },
  danger: { color: "text-rose-400", prefix: "✗" },
  defense: { color: "text-cyan-400", prefix: "🛡" },
};

/* Title: Terminal Feed Component | مكوّن تغذية الطرفية
   Description (EN): The scrollable terminal view showing all emitted log entries in the active language.
   الوصف (AR): عرض الطرفية القابل للتمرير الذي يعرض كل السجلات المطلقة باللغة النشطة.
*/
export function TerminalFeed({ logs, isRunning }: { logs: LogEntry[]; isRunning: boolean }) {
  const { lang, t } = useLang();
  const endRef = useRef<HTMLDivElement>(null);

  /* Title: Auto-scroll to Latest | تمرير تلقائي للأحدث
     Description (EN): Scrolls the terminal to the newest entry whenever logs update.
     الوصف (AR): يمرّر الطرفية إلى أحدث سجل كلما تحدثت السجلات.
  */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logs]);

  return (
    <div className="relative h-[320px] overflow-y-auto rounded-lg border border-cyan-500/20 bg-[#05080f] p-3 font-mono-cyber text-xs scanline">
      {logs.length === 0 && (
        <div className="flex h-full items-center justify-center text-slate-600">
          <span className="cursor-blink">{t("terminal.awaiting")}</span>
        </div>
      )}
      {logs.map((log) => {
        const style = LEVEL_STYLE[log.level];
        const message = lang === "ar" ? log.messageAr : log.messageEn;
        return (
          <div key={log.id} className="fade-in-up mb-1.5 flex gap-2 leading-relaxed" dir={lang === "ar" ? "rtl" : "ltr"}>
            <span className="shrink-0 text-slate-600">[{log.timestamp}]</span>
            <span className={`shrink-0 ${style.color}`}>{style.prefix}</span>
            <span className="text-slate-300">{message}</span>
          </div>
        );
      })}
      {isRunning && (
        <div className="mt-1 text-cyan-400">
          <span className="cursor-blink">▌</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
