// ============================================================================
// Title: Attack Simulator View | واجهة محاكي الهجمات
// Description (EN): The main interactive lab: a grid of 10 attack cards, a protection toggle switch with explanation, launch/reset controls, speed control, a live terminal feed, and the shared virtual hardware monitor panel that reflects the current system state. All text is shown in the active language only.
// الوصف (AR): المختبر التفاعلي الرئيسي: شبكة من 10 بطاقات هجوم، مفتاح تبديل الحماية مع الشرح، أزرار الإطلاق/إعادة الضبط، تحكم السرعة، تغذية طرفية حية، ولوح مراقبة الهاردوير الافتراضي المشترك الذي يعكس حالة النظام الحالية. كل النصوص تُعرض باللغة النشطة فقط.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { Play, RotateCcw, Shield, ShieldOff, Zap, Gauge, ChevronRight, Info } from "lucide-react";
import { ATTACK_CATALOG } from "../lib/attacks";
import type { AttackCatalogEntry } from "../lib/types";
import { useAttackSimulation } from "../hooks/useAttackSimulation";
import { CyberPanel, ToggleSwitch, CyberButton, Badge } from "./ui";
import { TerminalFeed } from "./TerminalFeed";
import { HardwareMonitor } from "./HardwareMonitor";
import { useLang } from "../i18n";

/* Title: Icon Map | خريطة الأيقونات
   Description (EN): Maps icon name strings from the catalog to lucide-react components.
   الوصف (AR): تربط أسماء الأيقونات النصية من الكتالوج بمكوّنات lucide-react.
*/
import { Hammer, BookOpen, Repeat, Network, Database, Code, Link2, Router, KeyRound } from "lucide-react";
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer, BookOpen, Repeat, Network, Database, Code, Zap, Router, Link2, KeyRound,
};

/* Title: Attack Simulator Component | مكوّن محاكي الهجمات
   Description (EN): Top-level component managing the selected attack, speed, endpoint, and rendering the full simulator layout.
   الوصف (AR): المكوّن الأعلى الذي يدير الهجوم المحدد والسرعة ونقطة الإرسال ويعرض تخطيط المحاكي الكامل.
*/
export function AttackSimulator() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<AttackCatalogEntry>(ATTACK_CATALOG[0]);
  const [speed, setSpeed] = useState(3); // 3x default for faster testing
  const [endpointUrl, setEndpointUrl] = useState("http://192.168.1.100/hardware-state");

  const sim = useAttackSimulation(selected, speed, endpointUrl, lang);

  /* Title: Pick Localized Field | اختيار الحقل المحلي
     Description (EN): Helper to pick the English or Arabic field of a catalog entry based on the active language.
     الوصف (AR): مساعد لاختيار الحقل الإنجليزي أو العربي لعنصر الكتالوج بناءً على اللغة النشطة.
  */
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const name = L(selected.nameEn, selected.nameAr);
  const shortDesc = L(selected.shortDescEn, selected.shortDescAr);
  const protectionName = L(selected.protectionNameEn, selected.protectionNameAr);
  const protectionDesc = L(selected.protectionDescEn, selected.protectionDescAr);

  /* Title: Reset on Attack Change | إعادة الضبط عند تغيير الهجوم
     Description (EN): Clears the simulation when a different attack is selected.
     الوصف (AR): يمسح المحاكاة عند اختيار هجوم مختلف.
  */
  useEffect(() => {
    sim.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.id]);

  const SelectedIcon = useMemo(() => ICONS[selected.icon] ?? Zap, [selected.icon]);

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Attack selection grid */}
      <CyberPanel title={t("attack.selectTitle")} icon={<Zap className="h-4 w-4" />}>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {ATTACK_CATALOG.map((attack) => {
            const Icon = ICONS[attack.icon] ?? Zap;
            const isActive = attack.id === selected.id;
            return (
              <button
                key={attack.id}
                type="button"
                onClick={() => setSelected(attack)}
                className={`group flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all duration-200 ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-500/10 glow-cyan"
                    : "border-white/10 bg-[#0a1428] hover:border-cyan-500/30 hover:bg-cyan-500/5"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400 group-hover:text-cyan-300"}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isActive ? "text-cyan-200" : "text-slate-300"}`}>{L(attack.nameEn, attack.nameAr)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </CyberPanel>

      {/* Main simulator grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: attack detail + controls + terminal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Attack detail + protection toggle */}
          <CyberPanel
            title={name}
            icon={<SelectedIcon className="h-4 w-4" />}
            accent={sim.systemState === "breached" ? "red" : sim.systemState === "protected" ? "green" : "cyan"}
          >
            <div className="mb-4 rounded-lg border border-white/5 bg-[#0a1428] p-3">
              <p className="text-sm text-slate-300">{shortDesc}</p>
            </div>

            {/* Protection toggle */}
            <div className="mb-4 rounded-lg border border-white/10 bg-[#0a1428] p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {sim.protectionOn ? (
                    <Shield className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <ShieldOff className="h-6 w-6 text-rose-400" />
                  )}
                  <div>
                    <div className={`text-sm font-bold ${sim.protectionOn ? "text-emerald-300" : "text-rose-300"}`}>
                      {t("attack.protectionMode")}: {sim.protectionOn ? t("attack.protectionOn") : t("attack.protectionOff")}
                    </div>
                  </div>
                </div>
                <ToggleSwitch on={sim.protectionOn} onToggle={sim.toggleProtection} onLabel={t("attack.protectionOn")} offLabel={t("attack.protectionOff")} />
              </div>

              {/* Explanation below the toggle */}
              <div className="mt-4 rounded-lg border border-cyan-500/15 bg-[#05080f] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                  <Info className="h-3.5 w-3.5" />
                  {t("attack.protectionMechanism")}
                </div>
                <div className="mb-2 text-sm font-semibold text-slate-200">{protectionName}</div>
                <p className="text-xs leading-relaxed text-slate-400">{protectionDesc}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <CyberButton variant="danger" onClick={sim.start} disabled={sim.isRunning}>
                <Play className="h-4 w-4" />
                {t("attack.launch")}
              </CyberButton>
              <CyberButton variant="ghost" onClick={sim.reset}>
                <RotateCcw className="h-4 w-4" />
                {t("attack.reset")}
              </CyberButton>

              {/* Speed control */}
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a1428] px-3 py-1.5">
                <Gauge className="h-4 w-4 text-cyan-400" />
                <span className="text-[11px] text-slate-400">{t("attack.speed")}</span>
                <div className="flex gap-1">
                  {[1, 3, 6, 12].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold transition-colors ${
                        speed === s ? "bg-cyan-500/20 text-cyan-300" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-2">
                <Badge color={sim.isRunning ? "amber" : "slate"}>{sim.isRunning ? t("attack.running") : t("attack.ready")}</Badge>
                {sim.systemState === "breached" && <Badge color="red">{t("attack.breached")}</Badge>}
                {sim.systemState === "protected" && sim.isRunning === false && sim.logs.length > 0 && (
                  <Badge color="green">{t("attack.blocked")}</Badge>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {(sim.isRunning || sim.progress > 0) && (
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                  <span>{t("attack.progress")}</span>
                  <span>{Math.round(sim.progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      sim.systemState === "breached" ? "bg-rose-500" : sim.protectionOn ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                    style={{ width: `${sim.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Terminal */}
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t("attack.liveLog")}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            </div>
            <TerminalFeed logs={sim.logs} isRunning={sim.isRunning} />
          </CyberPanel>
        </div>

        {/* Right: hardware monitor */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <HardwareMonitor
              payload={sim.hardwarePayload}
              state={sim.systemState}
              endpointUrl={endpointUrl}
              onEndpointChange={setEndpointUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
