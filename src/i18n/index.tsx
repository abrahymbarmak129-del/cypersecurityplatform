// ============================================================================
// Title: Language Context & i18n System | سياق اللغة ونظام التدويل
// Description (EN): Provides a React context that holds the active language ("en" | "ar"), exposes a t() translator for UI strings, a dir attribute, and a toggle function. Used across the whole platform so the UI switches cleanly between English and Arabic instead of showing both at once.
// الوصف (AR): يوفّر سياق React يحتفظ باللغة النشطة ("en" | "ar")، ويكشف دالة t() لترجمة نصوص الواجهة وخاصية dir ودالة تبديل. يُستخدم across المنصة لتبديل الواجهة بين الإنجليزية والعربية بدل عرضهما معًا.
// ============================================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/* Title: Language Type | نوع اللغة
   Description (EN): The two supported languages.
   الوصف (AR): اللغتان المدعومتان.
*/
export type Lang = "en" | "ar";

/* Title: Translation Dictionary | قاموس الترجمات
   Description (EN): A nested map of string keys to their English and Arabic values, used by t().
   الوصف (AR): خريطة متداخلة لمفاتيح النصوص وقيمها الإنجليزية والعربية، تُستخدم بواسطة t().
*/
const DICT: Record<string, { en: string; ar: string }> = {
  // Nav
  "nav.dashboard": { en: "Dashboard", ar: "لوحة المعلومات" },
  "nav.attacks": { en: "Attacks", ar: "الهجمات" },
  "nav.crypto": { en: "Cryptography", ar: "التشفير" },

  // Header / brand
  "header.subtitle": { en: "Cybersecurity Simulation & Cryptography Platform", ar: "منصة محاكاة الأمن السيبراني والتشفير" },
  "header.online": { en: "SYSTEM ONLINE — Educational Platform", ar: "النظام متصل — منصة تعليمية" },
  "header.langLabel": { en: "العربية", ar: "English" },

  // Hero
  "hero.title": { en: "Cybersecurity Simulation & Cryptography Platform", ar: "منصة محاكاة الأمن السيبراني والتشفير" },
  "hero.desc": {
    en: "An interactive educational lab simulating the 10 most common cyber attacks with live protection-toggle defense mechanics, hardware-state logic ready for ESP32 wiring, and a step-by-step cryptography visualizer.",
    ar: "مختبر تعليمي تفاعلي يحاكي أكثر 10 هجمات سيبرانية شيوعًا مع آليات دفاع بمفتاح حماية حي، ومنطق حالة هاردوير جاهز لتوصيل ESP32، وعارض تشفير خطوة بخطوة.",
  },
  "hero.launchAttacks": { en: "Launch Attack Simulator", ar: "تشغيل محاكي الهجمات" },
  "hero.openCrypto": { en: "Open Cryptography Lab", ar: "فتح مختبر التشفير" },

  // Stats
  "stat.attacks": { en: "Attack Simulations", ar: "محاكاة هجوم" },
  "stat.crypto": { en: "Crypto Algorithms", ar: "خوارزميات تشفير" },
  "stat.hardware": { en: "Hardware Components", ar: "مكونات هاردوير" },
  "stat.states": { en: "System States", ar: "حالات النظام" },

  // Module cards
  "module.attacksTitle": { en: "Interactive Cyber Attacks Simulator", ar: "محاكي الهجمات السيبرانية التفاعلي" },
  "module.attacksDesc": {
    en: "Simulate brute force, SQL injection, XSS, DDoS, MitM and more. Toggle protection on/off to see attacks succeed or get blocked in real time, with live hardware-state outputs (LED, buzzer, LCD).",
    ar: "حاكي القوة الغاشمة وحقن SQL وXSS وDDoS وMitM والمزيد. بدّل الحماية تشغيل/إيقاف لترى الهجمات تنجح أو تُصد في الوقت الحقيقي، مع مخرجات حالة هاردوير حية (LED، الجرس، LCD).",
  },
  "module.cryptoTitle": { en: "Cryptography & Algorithms Visualizer", ar: "عارض التشفير والخوارزميات" },
  "module.cryptoDesc": {
    en: "Explore AES, DES, RSA, Diffie-Hellman, SHA-256, and Caesar cipher step-by-step. Enter custom inputs and keys to see exactly how encryption, decryption, and hashing work internally.",
    ar: "استكشف AES وDES وRSA وDiffie-Hellman وSHA-256 وشيفرة قيصر خطوة بخطوة. أدخل مدخلات ومفاتيح مخصصة لترى بالضبط كيف يعمل التشفير وفك التشفير والتجزئة داخليًا.",
  },
  "module.enterLab": { en: "Enter Lab", ar: "ادخل المختبر" },

  // Hardware states legend
  "hwStates.title": { en: "Hardware States & Outputs", ar: "حالات الهاردوير والمخرجات" },
  "hwStates.idle.title": { en: "Idle — No Attack", ar: "استعداد — لا يوجد هجوم" },
  "hwStates.protected.title": { en: "Protected — Attack Blocked", ar: "محمي — تم صد الهجوم" },
  "hwStates.breached.title": { en: "Breached — Alarm Active", ar: "مخترق — الإنذار يعمل" },
  "hwStates.led": { en: "LED", ar: "LED" },
  "hwStates.buzzer": { en: "Buzzer", ar: "الجرس" },
  "hwStates.buzzerOn": { en: "ON", ar: "يعمل" },
  "hwStates.buzzerOff": { en: "OFF", ar: "متوقف" },
  "hwStates.note": {
    en: "Hardware components (ESP32, LEDs, buzzer, sensors, LCD, breadboard) are not yet physically connected. All state logic and output payloads are built in and ready to drive the real components once wired up.",
    ar: "مكونات الهاردوير (ESP32، LEDs، الجرس، المستشعرات، LCD، لوحة التجارب) غير متصلة فعليًا بعد. كل منطق الحالة والحمولات مدمج وجاهز لتشغيل المكونات الحقيقية عند توصيلها.",
  },

  // Footer
  "footer.text": {
    en: "CyberSecLab — Educational Cybersecurity Simulation & Cryptography Platform",
    ar: "سيبر سيك لاب — منصة تعليمية لمحاكاة الأمن السيبراني والتشفير",
  },

  // Attack simulator
  "attack.selectTitle": { en: "Select an Attack Module", ar: "اختر وحدة هجوم" },
  "attack.protectionMode": { en: "Protection Mode", ar: "وضع الحماية" },
  "attack.protectionOn": { en: "ON", ar: "مفعّل" },
  "attack.protectionOff": { en: "OFF", ar: "مغلق" },
  "attack.protectionMechanism": { en: "Protection Mechanism", ar: "آلية الحماية" },
  "attack.launch": { en: "Launch Attack", ar: "بدء الهجوم" },
  "attack.reset": { en: "Reset", ar: "إعادة ضبط" },
  "attack.speed": { en: "Speed", ar: "السرعة" },
  "attack.running": { en: "RUNNING", ar: "جاري" },
  "attack.ready": { en: "READY", ar: "جاهز" },
  "attack.breached": { en: "BREACHED", ar: "تم الاختراق" },
  "attack.blocked": { en: "BLOCKED", ar: "تم التصدي" },
  "attack.progress": { en: "Attack Progress", ar: "تقدم الهجوم" },
  "attack.liveLog": { en: "Live Simulation Log", ar: "سجل المحاكاة الحي" },
  "attack.defenseHeld": { en: "All defense layers held. Attack fully mitigated.", ar: "تمسّكت كل طبقات الدفاع. تم احتواء الهجوم بالكامل." },
  "attack.protectionDisabled": { en: "Protection DISABLED — defenses going down!", ar: "تم إيقاف الحماية — تُسقط الدفاعات!" },
  "attack.protectionEnabled": { en: "Protection ENABLED — defenses online, attack contained.", ar: "تم تشغيل الحماية — الدفاعات تعمل وتم احتواء الهجوم." },

  // Terminal
  "terminal.awaiting": { en: "Awaiting command... press Launch Attack to begin", ar: "في انتظار أمر... اضغط بدء الهجوم للبدء" },

  // Hardware monitor
  "hw.title": { en: "Virtual Hardware & State Monitor", ar: "لوح مراقبة الهاردوير والحالة" },
  "hw.config": { en: "Config", ar: "إعدادات" },
  "hw.ledIndicator": { en: "LED Indicator", ar: "مؤشر LED" },
  "hw.buzzerAlarm": { en: "Buzzer / Alarm", ar: "الجرس / الإنذار" },
  "hw.lcdScreen": { en: "LCD Screen", ar: "شاشة LCD" },
  "hw.telemetry": { en: "Sensor Telemetry", ar: "قراءات المستشعرات" },
  "hw.endpoint": { en: "ESP32 / Webhook Endpoint", ar: "نقطة إرسال ESP32 / Webhook" },
  "hw.endpointNote": {
    en: "Payload is emitted on every state change. When the ESP32 is wired up, this URL receives the live hardware-state JSON.",
    ar: "تُرسل الحمولة عند كل تغيير حالة. عند توصيل ESP32، يستقبل هذا العنوان JSON حالة الهاردوير الحية.",
  },
  "hw.netTraffic": { en: "Network Traffic", ar: "حركة الشبكة" },
  "hw.threatLevel": { en: "Threat Level", ar: "مستوى التهديد" },
  "hw.cpuLoad": { en: "CPU Load", ar: "حمل المعالج" },
  "hw.packetRate": { en: "Packet Rate", ar: "معدل الحزم" },

  // State labels (monitor)
  "state.idle.en": { en: "IDLE — No Attack", ar: "استعداد — لا يوجد هجوم" },
  "state.protected.en": { en: "PROTECTED — Attack Blocked", ar: "محمي — تم صد الهجوم" },
  "state.breached.en": { en: "BREACHED — Alarm Active", ar: "مخترق — الإنذار يعمل" },

  // LCD messages
  "lcd.idle.1": { en: "Platform Ready - No Attack Detected", ar: "المنصة جاهزة - لا يوجد هجوم" },
  "lcd.protected.1": { en: "Attack Detected - Blocked by Protection", ar: "يوجد هجوم وتم التصدي له" },
  "lcd.breached.1": { en: "BREACH DETECTED! Alarm Active", ar: "تم الاختراق - الإنذار يعمل" },

  // LED color labels
  "led.yellow": { en: "YELLOW", ar: "أصفر" },
  "led.green": { en: "GREEN", ar: "أخضر" },
  "led.red": { en: "RED", ar: "أحمر" },

  // Crypto
  "crypto.isolation": {
    en: "This cryptography section is fully isolated and does not trigger any hardware states, LEDs, buzzer, or breach alerts.",
    ar: "قسم التشفير هذا معزول بالكامل ولا يُشغّل أي حالة هاردوير أو LED أو جرس أو تنبيهات اختراق.",
  },
  "crypto.isolationTitle": { en: "Software-Only Section", ar: "قسم برمجي بحت" },
  "crypto.selectAlgo": { en: "Select Algorithm", ar: "اختر الخوارزمية" },
  "crypto.mode": { en: "Mode", ar: "الوضع" },
  "crypto.encrypt": { en: "Encrypt", ar: "تشفير" },
  "crypto.decrypt": { en: "Decrypt", ar: "فك التشفير" },
  "crypto.hash": { en: "Hash", ar: "تجزئة" },
  "crypto.inputText": { en: "Input Text", ar: "النص المدخل" },
  "crypto.inputPlaceholder": { en: "Enter text to process...", ar: "أدخل النص للمعالجة..." },
  "crypto.runOperation": { en: "Run an operation to see the step-by-step breakdown.", ar: "شغّل عملية لرؤية التفصيل خطوة بخطوة." },
  "crypto.result": { en: "Step-by-Step Result", ar: "النتيجة خطوة بخطوة" },
  "crypto.output": { en: "Output", ar: "المخرج" },
  "crypto.processing": { en: "Processing...", ar: "جاري المعالجة..." },
  "crypto.empty": { en: "(empty)", ar: "(فارغ)" },
  "crypto.errorInput": { en: "Please enter input text.", ar: "يرجى إدخال نص." },
  "crypto.errorKey": { en: "Please enter a key.", ar: "يرجى إدخال مفتاح." },

  // Common
  "common.on": { en: "ON", ar: "يعمل" },
  "common.off": { en: "OFF", ar: "متوقف" },
};

/* Title: Language Context Type | نوع سياق اللغة
   Description (EN): The shape of the context value exposed to consumers.
   الوصف (AR): شكل قيمة السياق المكشوفة للمستهلكين.
*/
interface LangContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

/* Title: Language Context | سياق اللغة
   Description (EN): The React context instance.
   الوصف (AR): نسخة سياق React.
*/
const LanguageContext = createContext<LangContextValue | null>(null);

/* Title: Language Provider | مزوّد اللغة
   Description (EN): Wraps the app and provides the active language, direction, toggle, and translator to all children.
   الوصف (AR): يلف التطبيق ويوفّر اللغة النشطة والاتجاه والتبديل والمترجم لكل الأبناء.
*/
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const dir = lang === "ar" ? "rtl" : "ltr";

  /* Title: Translator Function | دالة الترجمة
     Description (EN): Returns the string for the given key in the active language, falling back to the key itself.
     الوصف (AR): تُرجع النص للمفتاح المعطى باللغة النشطة، مع الرجوع للمفتاح نفسه كاحتياط.
  */
  const t = useCallback(
    (key: string) => {
      const entry = DICT[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  /* Title: Toggle Language | تبديل اللغة
     Description (EN): Switches between English and Arabic.
     الوصف (AR): يبدّل بين الإنجليزية والعربية.
  */
  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* Title: useLang Hook | خطّاف useLang
   Description (EN): Convenience hook to access the language context; throws if used outside the provider.
   الوصف (AR): خطّاف مناسب للوصول إلى سياق اللغة؛ يُطلق خطأ إذا استُخدم خارج المزوّد.
*/
export function useLang(): LangContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
