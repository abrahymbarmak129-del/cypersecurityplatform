// ============================================================================
// Title: Virtual Hardware Monitor Panel | لوح مراقبة الهاردوير الافتراضي
// Description (EN): Displays live LED color indicators, buzzer/alarm status, LCD screen output (single active language), sensor telemetry gauges, and the outbound ESP32 endpoint/webhook config. This panel mirrors the hardware payload state and is ready to drive real ESP32/LED/buzzer/LCD/sensor components once wired up.
// الوصف (AR): يعرض مؤشرات لون LED الحية وحالة الجرس/الإنذار ونص شاشة LCD (باللغة النشطة فقط) وعدادات قراءات المستشعرات وإعدادات نقطة إرسال ESP32. يعكس هذا اللوح حالة حمولة الهاردوير وجاهز لتشغيل مكونات ESP32/LED/الجرس/LCD/المستشعرات الحقيقية عند توصيلها.
// ============================================================================

import { useState } from "react";
import { Volume2, VolumeX, Activity, Cpu, Wifi, Gauge, Webhook, Settings2, MonitorSmartphone } from "lucide-react";
import type { HardwarePayload, SystemState } from "../lib/types";
import { CyberPanel, Badge } from "./ui";
import { useLang } from "../i18n";

/* Title: LED Indicator | مؤشر LED
   Description (EN): A circular glowing indicator that shows the current LED color (yellow/green/red) with a pulse animation.
   الوصف (AR): مؤشر دائري متوهج يُظهر لون LED الحالي (أصفر/أخضر/أحمر) مع حركة نبض.
*/
function LedIndicator({ color, active }: { color: HardwarePayload["ledColor"]; active: boolean }) {
  const { t } = useLang();
  const colorMap = {
    yellow: { bg: "bg-amber-400", glow: "glow-amber", ring: "ring-amber-400/40", label: t("led.yellow") },
    green: { bg: "bg-emerald-400", glow: "glow-green", ring: "ring-emerald-400/40", label: t("led.green") },
    red: { bg: "bg-rose-500", glow: "glow-red", ring: "ring-rose-500/40", label: t("led.red") },
  };
  const c = colorMap[color];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative h-12 w-12 rounded-full ${c.bg} ring-4 ${c.ring} ${active ? `${c.glow} led-pulse` : "opacity-40"}`}>
        {active && color === "red" && (
          <div className="absolute inset-0 rounded-full bg-rose-500/30 led-pulse" />
        )}
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</span>
    </div>
  );
}

/* Title: Telemetry Gauge | عداد القراءات
   Description (EN): A labeled horizontal bar showing a sensor reading value out of 100.
   الوصف (AR): شريط أفقي مُعنون يُظهر قيمة قراءة مستشعر من 100.
*/
function TelemetryGauge({ label, value, icon, unit = "" }: { label: string; value: number; icon: React.ReactNode; unit?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct > 80 ? "bg-rose-500" : pct > 50 ? "bg-amber-400" : "bg-cyan-400";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-slate-400">
          {icon}
          {label}
        </span>
        <span className="font-mono-cyber text-slate-200">
          {Math.round(pct)}
          {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* Title: Hardware Monitor Component | مكوّن مراقبة الهاردوير
   Description (EN): The full monitor panel receiving the current hardware payload and state.
   الوصف (AR): لوح المراقبة الكامل الذي يستقبل حمولة الهاردوير الحالية والحالة.
*/
export function HardwareMonitor({
  payload,
  state,
  endpointUrl,
  onEndpointChange,
}: {
  payload: HardwarePayload;
  state: SystemState;
  endpointUrl: string;
  onEndpointChange: (url: string) => void;
}) {
  const { t, lang } = useLang();
  const [showSettings, setShowSettings] = useState(false);

  const stateColor: Record<SystemState, "cyan" | "green" | "red" | "amber"> = {
    idle: "amber",
    protected: "green",
    breached: "red",
  };
  const stateKey: Record<SystemState, string> = {
    idle: "state.idle.en",
    protected: "state.protected.en",
    breached: "state.breached.en",
  };
  const sl = { label: t(stateKey[state]), color: stateColor[state] };

  return (
    <CyberPanel
      title={t("hw.title")}
      icon={<Activity className="h-4 w-4" />}
      accent={state === "breached" ? "red" : state === "protected" ? "green" : "amber"}
    >
      {/* Status + settings header */}
      <div className="mb-4 flex items-center justify-between">
        <Badge color={sl.color}>{sl.label}</Badge>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {t("hw.config")}
        </button>
      </div>

      {/* LED + Buzzer row */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {/* LED */}
        <div className={`rounded-lg border border-white/10 p-3 ${state === "breached" ? "alarm-flash" : ""}`}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t("hw.ledIndicator")}</div>
          <div className="flex items-center justify-center py-1">
            <LedIndicator color={payload.ledColor} active={state !== "idle"} />
          </div>
        </div>

        {/* Buzzer */}
        <div className={`rounded-lg border border-white/10 p-3 ${payload.buzzer === "on" ? "alarm-flash" : ""}`}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t("hw.buzzerAlarm")}</div>
          <div className="flex flex-col items-center justify-center gap-2 py-1">
            {payload.buzzer === "on" ? (
              <Volume2 className="h-10 w-10 text-rose-400 buzzer-ring" />
            ) : (
              <VolumeX className="h-10 w-10 text-slate-600" />
            )}
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${payload.buzzer === "on" ? "text-rose-400" : "text-slate-500"}`}>
              {payload.buzzer === "on" ? t("hw.buzzerAlarm").split("/")[0].trim() + " / " + t("common.on") : t("common.off")}
            </span>
          </div>
        </div>
      </div>

      {/* LCD Screen */}
      <div className="mb-4 rounded-lg border border-cyan-500/20 bg-[#020610] p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <MonitorSmartphone className="h-3.5 w-3.5" />
          {t("hw.lcdScreen")}
        </div>
        <div
          dir={lang === "ar" ? "rtl" : "ltr"}
          className={`rounded border border-cyan-500/15 bg-[#0a1428] p-3 font-mono-cyber text-sm ${
            state === "breached" ? "text-rose-300 text-glow-red" : state === "protected" ? "text-emerald-300 text-glow-green" : "text-amber-300"
          }`}
        >
          ▶ {payload.lcdLine}
        </div>
      </div>

      {/* Telemetry */}
      <div className="mb-4 rounded-lg border border-white/10 p-3">
        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Gauge className="h-3.5 w-3.5" />
          {t("hw.telemetry")}
        </div>
        <div className="space-y-2.5">
          <TelemetryGauge label={t("hw.netTraffic")} value={payload.sensorReadings.networkTraffic} icon={<Wifi className="h-3 w-3" />} unit="%" />
          <TelemetryGauge label={t("hw.threatLevel")} value={payload.sensorReadings.threatLevel} icon={<Activity className="h-3 w-3" />} unit="%" />
          <TelemetryGauge label={t("hw.cpuLoad")} value={payload.sensorReadings.cpuLoad} icon={<Cpu className="h-3 w-3" />} unit="%" />
          <TelemetryGauge label={t("hw.packetRate")} value={payload.sensorReadings.packetRate / 100} icon={<Activity className="h-3 w-3" />} unit="kpps" />
        </div>
      </div>

      {/* Endpoint config (collapsible) */}
      {showSettings && (
        <div className="fade-in rounded-lg border border-cyan-500/20 bg-[#0a1428] p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
            <Webhook className="h-3.5 w-3.5" />
            {t("hw.endpoint")}
          </div>
          <input
            type="text"
            value={endpointUrl}
            onChange={(e) => onEndpointChange(e.target.value)}
            placeholder="http://192.168.1.100/hardware-state"
            className="w-full rounded border border-white/10 bg-[#05080f] px-3 py-2 font-mono-cyber text-xs text-slate-200 outline-none focus:border-cyan-400/50"
          />
          <p className="mt-2 text-[10px] text-slate-500" dir={lang === "ar" ? "rtl" : "ltr"}>
            {t("hw.endpointNote")}
          </p>
          {/* JSON preview */}
          <pre className="mt-3 max-h-40 overflow-auto rounded border border-white/5 bg-[#05080f] p-2 font-mono-cyber text-[10px] text-cyan-300/80" dir="ltr">
{JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </CyberPanel>
  );
}
