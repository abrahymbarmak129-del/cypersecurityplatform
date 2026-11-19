// ============================================================================
// Title: Cryptography Visualizer View | واجهة عارض التشفير
// Description (EN): A 100% software-only section demonstrating AES, DES, RSA, Diffie-Hellman, SHA-256, and Caesar cipher step-by-step. Users enter custom input/keys, run encrypt/decrypt/hash, and inspect ordered intermediate steps in the active language only. STRICTLY isolated from any hardware state — does NOT trigger LEDs, buzzer, or breach alerts.
// الوصف (AR): قسم برمجي بحت يوضح AES وDES وRSA وDiffie-Hellman وSHA-256 وشيفرة قيصر خطوة بخطوة. يدخل المستخدم نصًا/مفاتيح مخصصة، يشغّل تشفير/فك/تجزئة، ويفحص الخطوات الوسيطة المرتبة باللغة النشطة فقط. معزول تمامًا عن أي حالة هاردوير — لا يُشغّل LED أو الجرس أو تنبيهات الاختراق.
// ============================================================================

import { useState } from "react";
import { Lock, LockKeyhole, KeyRound, Shuffle, Fingerprint, Type, Play, ArrowLeftRight, Eye, AlertCircle } from "lucide-react";
import { CRYPTO_CATALOG, runCrypto } from "../lib/crypto";
import type { CryptoId, CryptoResult } from "../lib/types";
import { CyberPanel, CyberButton, Badge } from "./ui";
import { useLang } from "../i18n";

/* Title: Icon Map | خريطة الأيقونات
   Description (EN): Maps crypto icon names to lucide-react components.
   الوصف (AR): تربط أسماء أيقونات التشفير بمكوّنات lucide-react.
*/
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock, LockKeyhole, KeyRound, Shuffle, Fingerprint, Type,
};

/* Title: Type Color Map | خريطة ألوان النوع
   Description (EN): Maps algorithm type to a badge color.
   الوصف (AR): تربط نوع الخوارزمية بلون الشارة.
*/
const TYPE_COLOR: Record<string, "cyan" | "green" | "amber" | "slate"> = {
  symmetric: "cyan",
  asymmetric: "green",
  "key-exchange": "amber",
  hash: "slate",
};

/* Title: Type Label Map | خريطة تسمية النوع
   Description (EN): Maps algorithm type to a localized label key.
   الوصف (AR): تربط نوع الخوارزمية بمفتاح تسمية محلي.
*/
const TYPE_LABEL: Record<string, { en: string; ar: string }> = {
  symmetric: { en: "Symmetric", ar: "متماثل" },
  asymmetric: { en: "Asymmetric", ar: "غير متماثل" },
  "key-exchange": { en: "Key Exchange", ar: "تبادل مفاتيح" },
  hash: { en: "Hash", ar: "تجزئة" },
};

/* Title: Cryptography Visualizer Component | مكوّن عارض التشفير
   Description (EN): Top-level component with algorithm selection, input/key fields, mode toggle, and step-by-step results in the active language.
   الوصف (AR): المكوّن الأعلى مع اختيار الخوارزمية وحقول الإدخال/المفتاح وتبديل الوضع ونتائج خطوة بخطوة باللغة النشطة.
*/
export function CryptographyVisualizer() {
  const { t, lang } = useLang();
  const [selectedId, setSelectedId] = useState<CryptoId>("aes");
  const [input, setInput] = useState("Hello Secure World");
  const [key, setKey] = useState("AESKEY1280000000");
  const [mode, setMode] = useState<"encrypt" | "decrypt" | "hash">("encrypt");
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const algo = CRYPTO_CATALOG.find((a) => a.id === selectedId)!;
  const AlgoIcon = ICONS[algo.icon] ?? Lock;
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  /* Title: Run Operation | تشغيل العملية
     Description (EN): Executes the selected crypto operation and stores the result; handles async SHA-256.
     الوصف (AR): ينفذ عملية التشفير المحددة ويخزن النتيجة؛ يتعامل مع SHA-256 غير المتزامن.
  */
  const runOperation = async () => {
    if (!input) {
      setError(t("crypto.errorInput"));
      return;
    }
    if (algo.needsKey && !key) {
      setError(t("crypto.errorKey"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const effectiveMode = algo.modes.includes("hash") ? "hash" : mode;
      const res = runCrypto(selectedId, input, key, effectiveMode);
      const resolved = res instanceof Promise ? await res : res;
      setResult(resolved);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  /* Title: Switch Algorithm | تبديل الخوارزمية
     Description (EN): Resets state and sets the default mode when a new algorithm is chosen.
     الوصف (AR): يعيد ضبط الحالة ويضبط الوضع الافتراضي عند اختيار خوارزمية جديدة.
  */
  const switchAlgorithm = (id: CryptoId) => {
    setSelectedId(id);
    setResult(null);
    setError(null);
    const a = CRYPTO_CATALOG.find((x) => x.id === id)!;
    if (a.modes.includes("hash")) setMode("hash");
    else setMode(a.modes[0]);
    if (id === "aes") setKey("AESKEY1280000000");
    else if (id === "des") setKey("DESKEY!!");
    else if (id === "caesar") setKey("3");
  };

  /* Title: Mode Label | تسمية الوضع
     Description (EN): Returns the localized label for a mode.
     الوصف (AR): يرجع التسمية المحلية للوضع.
  */
  const modeLabel = (m: "encrypt" | "decrypt" | "hash") => t(`crypto.${m}`);

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Isolation notice */}
      <div className="flex items-start gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-cyan-300">{t("crypto.isolationTitle")}</span>{" "}
          {t("crypto.isolation")}
        </div>
      </div>

      {/* Algorithm selection */}
      <CyberPanel title={t("crypto.selectAlgo")} icon={<Lock className="h-4 w-4" />}>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {CRYPTO_CATALOG.map((a) => {
            const Icon = ICONS[a.icon] ?? Lock;
            const isActive = a.id === selectedId;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => switchAlgorithm(a.id)}
                className={`group flex flex-col items-center gap-2 rounded-lg border p-3 transition-all duration-200 ${
                  isActive ? "border-cyan-400/60 bg-cyan-500/10 glow-cyan" : "border-white/10 bg-[#0a1428] hover:border-cyan-500/30"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400 group-hover:text-cyan-300"}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="text-center">
                  <div className={`text-xs font-semibold ${isActive ? "text-cyan-200" : "text-slate-300"}`}>{L(a.nameEn, a.nameAr)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </CyberPanel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input panel */}
        <CyberPanel title={L(algo.nameEn, algo.nameAr)} icon={<AlgoIcon className="h-4 w-4" />}>
          <div className="mb-4 rounded-lg border border-white/5 bg-[#0a1428] p-3">
            <p className="text-xs text-slate-300">{L(algo.descEn, algo.descAr)}</p>
            <div className="mt-2">
              <Badge color={TYPE_COLOR[algo.type]}>{L(TYPE_LABEL[algo.type].en, TYPE_LABEL[algo.type].ar)}</Badge>
            </div>
          </div>

          {/* Mode toggle */}
          {algo.modes.length > 1 && (
            <div className="mb-4">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t("crypto.mode")}</label>
              <div className="flex gap-2">
                {algo.modes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      mode === m ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300" : "border-white/10 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {modeLabel(m)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input text */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t("crypto.inputText")}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-[#05080f] px-3 py-2 font-mono-cyber text-sm text-slate-200 outline-none focus:border-cyan-400/50"
              placeholder={t("crypto.inputPlaceholder")}
            />
          </div>

          {/* Key field */}
          {algo.needsKey && (
            <div className="mb-4">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {L(algo.keyLabelEn, algo.keyLabelAr)}
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#05080f] px-3 py-2 font-mono-cyber text-sm text-slate-200 outline-none focus:border-cyan-400/50"
                placeholder={algo.keyPlaceholder}
                dir="ltr"
              />
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <CyberButton onClick={runOperation} disabled={loading} className="w-full">
            {loading ? (
              t("crypto.processing")
            ) : (
              <>
                <Play className="h-4 w-4" />
                {algo.modes.includes("hash") ? t("crypto.hash") : mode === "decrypt" ? t("crypto.decrypt") : t("crypto.encrypt")}
              </>
            )}
          </CyberButton>
        </CyberPanel>

        {/* Results panel */}
        <CyberPanel title={t("crypto.result")} icon={<Eye className="h-4 w-4" />}>
          {!result && (
            <div className="flex h-64 items-center justify-center text-center text-sm text-slate-600">
              <div>
                <ArrowLeftRight className="mx-auto mb-2 h-8 w-8 opacity-40" />
                {t("crypto.runOperation")}
              </div>
            </div>
          )}
          {result && (
            <div className="space-y-3">
              {/* Output */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">{t("crypto.output")}</div>
                <div className="break-all rounded bg-[#05080f] p-2 font-mono-cyber text-xs text-emerald-200" dir="ltr">
                  {result.output || t("crypto.empty")}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {result.steps.map((step, i) => (
                  <div key={i} className="fade-in-up rounded-lg border border-white/10 bg-[#0a1428] p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-[10px] font-bold text-cyan-300">
                        {i + 1}
                      </span>
                      <div className="text-sm font-semibold text-slate-200">{L(step.titleEn, step.titleAr)}</div>
                    </div>
                    <p className="mt-1.5 pl-8 text-xs leading-relaxed text-slate-400">{L(step.detailEn, step.detailAr)}</p>
                    {step.value && (
                      <div className="mt-2 break-all rounded bg-[#05080f] p-2 pl-8 font-mono-cyber text-[11px] text-cyan-300/90" dir="ltr">
                        {step.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CyberPanel>
      </div>
    </div>
  );
}
