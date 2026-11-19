// ============================================================================
// Title: Cybersecurity Platform App | تطبيق منصة الأمن السيبراني
// Description (EN): Top-level application shell with a cyber-tech dark-mode header, a language toggle button (EN/AR) in the top bar, navigation between the Attack Simulator, Cryptography Visualizer, and Dashboard overview sections, and a footer. All visible text is shown in the active language only.
// الوصف (AR): هيكل التطبيق الأعلى مع رأس سيبراني داكن وزر تبديل لغة (EN/AR) في الشريط العلوي وتنقل بين محاكي الهجمات وعارض التشفير ولوحة المعلومات وتذييل. كل النصوص الظاهرة تُعرض باللغة النشطة فقط.
// ============================================================================

import { useState } from "react";
import { Shield, Zap, Lock, Activity, ChevronRight, Cpu, ShieldCheck, Terminal, Languages } from "lucide-react";
import { AttackSimulator } from "./components/AttackSimulator";
import { CryptographyVisualizer } from "./components/CryptographyVisualizer";
import { useLang, type Lang } from "./i18n";

/* Title: Section Type | نوع القسم
   Description (EN): The three navigable sections of the platform.
   الوصف (AR): الأقسام الثلاثة القابلة للتنقل في المنصة.
*/
type Section = "dashboard" | "attacks" | "crypto";

/* Title: App Component | مكوّن التطبيق
   Description (EN): The root component rendering the header, language toggle, navigation, and active section.
   الوصف (AR): المكوّن الجذر الذي يعرض الرأس وزر اللغة والتنقل والقسم النشط.
*/
function App() {
  const { t, lang, dir, toggleLang } = useLang();
  const [section, setSection] = useState<Section>("dashboard");

  return (
    <div className="min-h-screen cyber-grid-bg bg-[#070b14] text-slate-200" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/15 bg-[#070b14]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 glow-cyan">
              <Shield className="h-5 w-5 text-cyan-300" />
              <div className="absolute inset-0 rounded-lg border border-cyan-400/20 spin-slow" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-100">
                CyberSec<span className="text-cyan-400">Lab</span>
              </h1>
              <p className="text-[10px] text-slate-500">{t("header.subtitle")}</p>
            </div>
          </div>

          {/* Right cluster: language toggle + nav */}
          <div className="flex items-center gap-3">
            {/* Language Toggle Button | زر تبديل اللغة */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition-all duration-200 hover:bg-cyan-500/20 hover:border-cyan-400"
              title={t("header.langLabel")}
            >
              <Languages className="h-4 w-4" />
              <span>{lang === "en" ? "AR" : "EN"}</span>
            </button>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              <NavButton active={section === "dashboard"} onClick={() => setSection("dashboard")} icon={<Activity className="h-4 w-4" />} label={t("nav.dashboard")} />
              <NavButton active={section === "attacks"} onClick={() => setSection("attacks")} icon={<Zap className="h-4 w-4" />} label={t("nav.attacks")} />
              <NavButton active={section === "crypto"} onClick={() => setSection("crypto")} icon={<Lock className="h-4 w-4" />} label={t("nav.crypto")} />
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {section === "dashboard" && <Dashboard onNavigate={setSection} />}
        {section === "attacks" && <AttackSimulator />}
        {section === "crypto" && <CryptographyVisualizer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-6 text-center">
        <p className="text-xs text-slate-600">{t("footer.text")}</p>
      </footer>
    </div>
  );
}

/* Title: Nav Button | زر التنقل
   Description (EN): A header navigation tab with icon and label, highlighted when active.
   الوصف (AR): تبويب تنقل في الرأس بأيقونة وملصق، يُبرز عند التفعيل.
*/
function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
        active ? "bg-cyan-500/15 text-cyan-300 glow-cyan" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/* Title: Dashboard View | واجهة لوحة المعلومات
   Description (EN): An overview landing page with platform description, stat cards, module cards linking to attacks and cryptography, and the hardware states legend — all in the active language only.
   الوصف (AR): صفحة هبوط عامة بوصف المنصة وبطاقات إحصائية وبطاقات وحدات تربط بالهجمات والتشفير وسجل حالات الهاردوير — كلها باللغة النشطة فقط.
*/
function Dashboard({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const { t, lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <div className="space-y-8 fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1428] to-[#05080f] p-8 glow-cyan">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 led-pulse" />
            {t("header.online")}
          </div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            {t("hero.title")}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{t("hero.desc")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("attacks")}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-300 transition-all hover:bg-cyan-500/25"
            >
              <Zap className="h-4 w-4" />
              {t("hero.launchAttacks")}
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("crypto")}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/25"
            >
              <Lock className="h-4 w-4" />
              {t("hero.openCrypto")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Zap className="h-5 w-5" />} value="10" label={t("stat.attacks")} color="amber" />
        <StatCard icon={<Lock className="h-5 w-5" />} value="6" label={t("stat.crypto")} color="cyan" />
        <StatCard icon={<Cpu className="h-5 w-5" />} value="5" label={t("stat.hardware")} color="green" />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} value="3" label={t("stat.states")} color="slate" />
      </section>

      {/* Module cards */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attacks module */}
        <button
          type="button"
          onClick={() => onNavigate("attacks")}
          className="group rounded-2xl border border-amber-500/20 bg-[#0a1428] p-6 text-left transition-all hover:border-amber-400/50 hover:glow-amber"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
            <Terminal className="h-6 w-6" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-slate-100">{t("module.attacksTitle")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{t("module.attacksDesc")}</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            {t("module.enterLab")} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </button>

        {/* Crypto module */}
        <button
          type="button"
          onClick={() => onNavigate("crypto")}
          className="group rounded-2xl border border-emerald-500/20 bg-[#0a1428] p-6 text-left transition-all hover:border-emerald-400/50 hover:glow-green"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-slate-100">{t("module.cryptoTitle")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{t("module.cryptoDesc")}</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            {t("module.enterLab")} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      </section>

      {/* Hardware states legend */}
      <section className="rounded-2xl border border-white/10 bg-[#0a1428] p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-200">
          <Cpu className="h-4 w-4 text-cyan-400" />
          {t("hwStates.title")}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StateCard state="idle" />
          <StateCard state="protected" />
          <StateCard state="breached" />
        </div>
        <p className="mt-4 text-xs text-slate-500">{t("hwStates.note")}</p>
      </section>
    </div>
  );
}

/* Title: Stat Card | بطاقة إحصائية
   Description (EN): A small metric card showing an icon, value, and label in the active language.
   الوصف (AR): بطاقة قياس صغيرة تعرض أيقونة وقيمة وملصق باللغة النشطة.
*/
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: "amber" | "cyan" | "green" | "slate" }) {
  const colorMap = {
    amber: "border-amber-500/20 text-amber-300",
    cyan: "border-cyan-500/20 text-cyan-300",
    green: "border-emerald-500/20 text-emerald-300",
    slate: "border-slate-500/20 text-slate-300",
  };
  return (
    <div className={`rounded-xl border ${colorMap[color]} bg-[#0a1428] p-4`}>
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

/* Title: State Card | بطاقة الحالة
   Description (EN): A legend card describing one hardware state (idle/protected/breached) with LED color, buzzer status, and LCD message — all in the active language only.
   الوصف (AR): بطاقة سجل تصف حالة هاردوير (استعداد/محمي/مخترق) بلون LED وحالة الجرس ونص LCD — كلها باللغة النشطة فقط.
*/
function StateCard({ state }: { state: "idle" | "protected" | "breached" }) {
  const { t, lang } = useLang();

  const config = {
    idle: {
      color: "amber",
      border: "border-amber-500/20",
      ledClass: "bg-amber-400",
      titleKey: "hwStates.idle.title",
      lcdKey: "lcd.idle.1",
      buzzerOn: false,
    },
    protected: {
      color: "green",
      border: "border-emerald-500/20",
      ledClass: "bg-emerald-400",
      titleKey: "hwStates.protected.title",
      lcdKey: "lcd.protected.1",
      buzzerOn: false,
    },
    breached: {
      color: "red",
      border: "border-rose-500/20",
      ledClass: "bg-rose-500",
      titleKey: "hwStates.breached.title",
      lcdKey: "lcd.breached.1",
      buzzerOn: true,
    },
  }[state];

  return (
    <div className={`rounded-xl border ${config.border} bg-[#05080f] p-4`}>
      <div className="mb-3 flex items-center gap-3">
        <div className={`h-8 w-8 rounded-full ${config.ledClass} glow-cyan led-pulse`} />
        <div className="text-sm font-semibold text-slate-200">{t(config.titleKey)}</div>
      </div>
      <div className="space-y-1 text-[11px] text-slate-400">
        <div>
          {t("hwStates.led")}: <span className="text-slate-200">{state === "idle" ? t("led.yellow") : state === "protected" ? t("led.green") : t("led.red")}</span>
        </div>
        <div>
          {t("hwStates.buzzer")}:{" "}
          <span className={config.buzzerOn ? "text-rose-300" : "text-slate-200"}>
            {config.buzzerOn ? t("hwStates.buzzerOn") : t("hwStates.buzzerOff")}
          </span>
        </div>
        <div className="rounded bg-[#0a1428] p-2 font-mono-cyber text-cyan-300/80" dir={lang === "ar" ? "rtl" : "ltr"}>
          ▶ {t(config.lcdKey)}
        </div>
      </div>
    </div>
  );
}

export default App;
