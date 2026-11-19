// ============================================================================
// Title: Attack Simulation Hook | خطّاف محاكاة الهجوم
// Description (EN): React hook that drives an attack simulation: manages protection toggle state, emits real-time terminal log entries from attack/defense phase scripts, advances a progress bar over a configurable duration, and computes the resulting system state (idle / protected / breached). Exposes the live hardware payload for the monitor panel.
// الوصف (AR): خطّاف React يشغّل محاكاة الهجوم: يدير حالة مفتاح الحماية، يطلق سجلات طرفية لحظية من سيناريوهات الهجوم/الدفاع، يقدّم شريط التقدم عبر مدة قابلة للضبط، ويحسب حالة النظام الناتجة (استعداد / محمي / مخترق). يكشف حمولة الهاردوير الحية للوح المراقبة.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import type { AttackCatalogEntry, HardwarePayload, LogEntry, SystemState } from "../lib/types";
import { buildHardwarePayload, telemetryForState } from "../lib/hardware";
import type { Lang } from "../i18n";

/* Title: Simulation Config | إعدادات المحاكاة
   Description (EN): The base duration (ms) for a full attack run and how often telemetry updates.
   الوصف (AR): المدة الأساسية (مللي ثانية) لدورة هجوم كاملة وكم تتحدث القراءات.
*/
const BASE_DURATION_MS = 60000; // ~60s as specified
const TELEMETRY_INTERVAL_MS = 1000;

/* Title: Use Attack Simulation Hook | خطّاف محاكاة الهجوم
   Description (EN): The main hook consumed by the attack simulator UI.
   الوصف (AR): الخطّاف الرئيسي الذي تستخدمه واجهة محاكي الهجمات.
*/
export function useAttackSimulation(entry: AttackCatalogEntry, speedMultiplier: number, endpointUrl: string, lang: Lang) {
  const [protectionOn, setProtectionOn] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [systemState, setSystemState] = useState<SystemState>("idle");
  const [tick, setTick] = useState(0);

  const logIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const telemetryRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIndexRef = useRef(0);
  const protectionRef = useRef(true);
  protectionRef.current = protectionOn;
  const langRef = useRef<Lang>(lang);
  langRef.current = lang;

  /* Title: Append Log | إضافة سجل
     Description (EN): Adds a new log entry with a timestamp to the terminal feed.
     الوصف (AR): يضيف سجلًا جديدًا بطابع زمني إلى تغذية الطرفية.
  */
  const appendLog = useCallback((level: LogEntry["level"], messageEn: string, messageAr: string) => {
    const id = logIdRef.current++;
    const now = new Date();
    const timestamp = now.toLocaleTimeString("en-GB", { hour12: false });
    setLogs((prev) => [...prev.slice(-200), { id, timestamp, level, messageEn, messageAr }]);
  }, []);

  /* Title: Localized Log Helper | مساعد السجل المحلي
     Description (EN): Appends a log picking the message in the active language at emit time.
     الوصف (AR): يضيف سجلًا يختار الرسالة باللغة النشطة وقت الإطلاق.
  */
  const appendLogLocalized = useCallback((level: LogEntry["level"], phase: { en: string; ar: string }) => {
    appendLog(level, phase.en, phase.ar);
  }, [appendLog]);

  /* Title: Reset Simulation | إعادة ضبط المحاكاة
     Description (EN): Stops the run, clears logs and progress, and returns to idle state.
     الوصف (AR): يوقف الدورة، يمسح السجلات والتقدم، ويعود إلى حالة الاستعداد.
  */
  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (telemetryRef.current) clearInterval(telemetryRef.current);
    timerRef.current = null;
    telemetryRef.current = null;
    setIsRunning(false);
    setProgress(0);
    setLogs([]);
    setSystemState("idle");
    phaseIndexRef.current = 0;
  }, []);

  /* Title: Start Simulation | بدء المحاكاة
     Description (EN): Begins emitting phase logs and advancing progress. If protection is ON the attack is blocked; if OFF it succeeds at 100%.
     الوصف (AR): يبدأ بإطلاق سجلات المراحل وتقديم التقدم. إذا كانت الحماية مفعّلة يُصد الهجوم؛ وإذا كانت مغلقة ينجح عند 100%.
  */
  const start = useCallback(() => {
    if (isRunning) return;
    reset();
    setIsRunning(true);
    setLogs([]);
    phaseIndexRef.current = 0;

    const protectedNow = protectionRef.current;
    const phases = protectedNow ? entry.defensePhases : entry.attackPhases;
    const duration = BASE_DURATION_MS / speedMultiplier;

    // Initial state: protected => "protected", unprotected => "protected" until breach at end
    setSystemState(protectedNow ? "protected" : "protected");

    // Schedule phase logs evenly across the duration
    const phaseInterval = duration / (phases.length + 1);
    phases.forEach((phase, i) => {
      setTimeout(() => {
        appendLogLocalized(protectedNow ? "defense" : "warning", phase);
        phaseIndexRef.current = i + 1;
      }, phaseInterval * (i + 1));
    });

    // Progress + final outcome
    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setIsRunning(false);
        if (protectionRef.current) {
          setSystemState("protected");
          appendLog("defense", "All defense layers held. Attack fully mitigated.", "تمسّكت كل طبقات الدفاع. تم احتواء الهجوم بالكامل.");
        } else {
          setSystemState("breached");
          appendLog("danger", entry.successMessageEn, entry.successMessageAr);
        }
      }
    }, 200);

    // Telemetry ticker
    setTick(0);
    telemetryRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, TELEMETRY_INTERVAL_MS);
  }, [appendLog, appendLogLocalized, entry, isRunning, reset, speedMultiplier]);

  /* Title: Toggle Protection Effect | تأثير مفتاح الحماية
     Description (EN): If protection is switched OFF while a run is active, the attack immediately advances to breach success. If switched ON during a breach, the system returns to protected and the breach is contained.
     الوصف (AR): إذا تم إغلاق الحماية أثناء دورة نشطة، يتقدم الهجوم فورًا إلى نجاح الاختراق. إذا شُغّلت أثناء اختراق، يعود النظام إلى المحمي ويُحتوى الاختراق.
  */
  const toggleProtection = useCallback(() => {
    setProtectionOn((prev) => {
      const next = !prev;
      if (isRunning) {
        if (!next) {
          // Turning protection OFF mid-attack => breach
          appendLog("danger", "Protection DISABLED — defenses going down!", "تم إيقاف الحماية — تُسقط الدفاعات!");
          setSystemState("breached");
          appendLog("danger", entry.successMessageEn, entry.successMessageAr);
          // fast-forward progress
          setProgress(100);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setIsRunning(false);
        } else {
          // Turning protection ON mid-attack => contained
          appendLog("defense", "Protection ENABLED — defenses online, attack contained.", "تم تشغيل الحماية — الدفاعات تعمل وتم احتواء الهجوم.");
          setSystemState("protected");
        }
      } else {
        // Not running: just reflect idle/ready
        setSystemState("idle");
      }
      return next;
    });
  }, [appendLog, entry, isRunning]);

  /* Title: Compute Live Hardware Payload | حساب حمولة الهاردوير الحية
     Description (EN): Derives the current hardware payload from system state and telemetry tick for the monitor panel.
     الوصف (AR): يشتق حمولة الهاردوير الحالية من حالة النظام وطابع القراءات للوح المراقبة.
  */
  const telemetry = telemetryForState(systemState, tick);
  const hardwarePayload: HardwarePayload = buildHardwarePayload(systemState, lang, endpointUrl, telemetry);

  /* Title: Cleanup on Unmount | التنظيف عند إلغاء التركيب
     Description (EN): Clears all intervals when the hook unmounts to avoid leaks.
     الوصف (AR): يمسح كل الفواصل الزمنية عند إلغاء تركيب الخطّاف لتفادي التسريب.
  */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (telemetryRef.current) clearInterval(telemetryRef.current);
    };
  }, []);

  return {
    protectionOn,
    toggleProtection,
    isRunning,
    progress,
    logs,
    systemState,
    hardwarePayload,
    tick,
    start,
    reset,
  };
}
