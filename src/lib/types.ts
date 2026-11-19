// ============================================================================
// Title: Shared Type Definitions | تعريفات الأنواع المشتركة
// Description (EN): Central type definitions for attack catalog entries, hardware states, log entries, crypto algorithms, and simulation config used across the platform.
// الوصف (AR): تعريفات الأنواع المركزية لعناصر كتالوج الهجمات وحالات الهاردوير وسجلات المحاكاة وخوارزميات التشفير وإعدادات المحاكاة المستخدمة في جميع أنحاء المنصة.
// ============================================================================

/* Title: System State Enum | تعداد حالة النظام
   Description (EN): The three possible hardware/system states: idle (no attack), protected (attack blocked), or breached (attack succeeded).
   الوصف (AR): الحالات الثلاث الممكنة للنظام/الهاردوير: الاستعداد (لا هجوم)، محمي (تم صد الهجوم)، أو مخترق (نجح الهجوم).
*/
export type SystemState = "idle" | "protected" | "breached";

/* Title: LED Color | لون LED
   Description (EN): Maps to the physical LED component colors: yellow (idle), green (protected), red (breached).
   الوصف (AR): يطابق ألوان مكون LED الفعلي: أصفر (استعداد)، أخضر (محمي)، أحمر (مخترق).
*/
export type LedColor = "yellow" | "green" | "red";

/* Title: Buzzer State | حالة الجرس
   Description (EN): Whether the alarm/buzzer is sounding (only true during a breach).
   الوصف (AR): ما إذا كان الجرس/الإنذار يعمل (يكون true فقط أثناء الاختراق).
*/
export type BuzzerState = "off" | "on";

/* Title: Hardware Output Payload | حمولة مخرجات الهاردوير
   Description (EN): The full payload that would be sent to the ESP32 and connected components (LED, buzzer, LCD text, sensor telemetry). This is emitted from the frontend state and is ready to be forwarded to real hardware later.
   الوصف (AR): الحمولة الكاملة التي ستُرسل إلى ESP32 والمكونات المتصلة (LED، الجرس، نص LCD، قراءات المستشعرات). تُنبعث من حالة الواجهة وجاهزة للتمرير إلى الهاردوير الحقيقي لاحقًا.
*/
export interface HardwarePayload {
  ledColor: LedColor;
  buzzer: BuzzerState;
  lcdLine: string;
  sensorReadings: {
    networkTraffic: number;
    threatLevel: number;
    cpuLoad: number;
    packetRate: number;
  };
  timestamp: number;
  endpointUrl: string;
}

/* Title: Log Entry | سجل
   Description (EN): A single line in the simulation terminal feed with a severity level, timestamp, and message in English and Arabic.
   الوصف (AR): سطر واحد في تغذية محاكاة الطرفية مع مستوى الخطورة والطابع الزمني والرسالة بالإنجليزية والعربية.
*/
export interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "success" | "warning" | "danger" | "defense";
  messageEn: string;
  messageAr: string;
}

/* Title: Attack ID | معرّف الهجوم
   Description (EN): Union of the 10 supported attack identifiers.
   الوصف (AR): اتحاد لمعرّفات الهجمات العشرة المدعومة.
*/
export type AttackId =
  | "brute-force"
  | "dictionary"
  | "replay"
  | "mitm"
  | "sqli"
  | "xss"
  | "ddos"
  | "arp-spoofing"
  | "session-hijacking"
  | "credential-stuffing";

/* Title: Attack Catalog Entry | عنصر كتالوج الهجوم
   Description (EN): Metadata for each attack: name, icon, description, the protection mechanism name, its explanation, attack phase scripts, and defense phase scripts for the terminal feed.
   الوصف (AR): البيانات الوصفية لكل هجوم: الاسم، الأيقونة، الوصف، آلية الحماية وتفسيرها، وسيناريوهات مرحلة الهجوم ومرحلة الدفاع لتغذية الطرفية.
*/
export interface AttackCatalogEntry {
  id: AttackId;
  nameEn: string;
  nameAr: string;
  icon: string;
  shortDescEn: string;
  shortDescAr: string;
  protectionNameEn: string;
  protectionNameAr: string;
  protectionDescEn: string;
  protectionDescAr: string;
  attackPhases: { en: string; ar: string }[];
  defensePhases: { en: string; ar: string }[];
  successMessageEn: string;
  successMessageAr: string;
}

/* Title: Crypto Algorithm ID | معرّف خوارزمية التشفير
   Description (EN): Union of the 6 supported cryptography algorithm identifiers.
   الوصف (AR): اتحاد لمعرّفات خوارزميات التشفير الست المدعومة.
*/
export type CryptoId = "aes" | "des" | "rsa" | "diffie-hellman" | "sha256" | "caesar";

/* Title: Crypto Step | خطوة التشفير
   Description (EN): A single intermediate step in a cryptographic operation, shown in the visualizer.
   الوصف (AR): خطوة وسيطة واحدة في عملية تشفير، تُعرض في العارض.
*/
export interface CryptoStep {
  titleEn: string;
  titleAr: string;
  detailEn: string;
  detailAr: string;
  value: string;
}

/* Title: Crypto Result | نتيجة التشفير
   Description (EN): The full result of a crypto operation: output value and ordered intermediate steps.
   الوصف (AR): النتيجة الكاملة لعملية التشفير: القيمة الناتجة والخطوات الوسيطة المرتبة.
*/
export interface CryptoResult {
  output: string;
  steps: CryptoStep[];
}
