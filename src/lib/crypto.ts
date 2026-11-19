// ============================================================================
// Title: Cryptography Engine | محرك التشفير
// Description (EN): Pure software-only implementations of AES (simplified visual), DES (simplified visual), RSA (small-prime demo), Diffie-Hellman key exchange, SHA-256 (native WebCrypto), and Caesar/Substitution cipher — each returning ordered, bilingual intermediate steps for the visualizer. STRICTLY isolated from any hardware state.
// الوصف (AR): تطبيقات برمجية بحتة لـ AES (مرئي مبسط) وDES (مرئي مبسط) وRSA (عرض بأعداد أولية صغيرة) وتبادل مفاتيح Diffie-Hellman وSHA-256 (WebCrypto الأصلي) وشيفرة قيصر/الاستبدال — كل منها يرجع خطوات وسيطة مرتبة ثنائية اللغة للعارض. معزول تمامًا عن أي حالة هاردوير.
// ============================================================================

import type { CryptoId, CryptoResult, CryptoStep } from "./types";

/* Title: Caesar Cipher | شيفرة قيصر
   Description (EN): Shifts each letter by a fixed number of positions (key) through the alphabet; non-letters are preserved. Fully synchronous with step-by-step output.
   الوصف (AR): يزيح كل حرف بعدد ثابت من المواضع (المفتاح) عبر الأبجدية؛ يُترك غير الأحرف كما هو. متزامن تمامًا مع مخرجات خطوة بخطوة.
*/
function caesarCipher(text: string, key: number): CryptoResult {
  const shift = ((key % 26) + 26) % 26;
  const steps: CryptoStep[] = [];
  steps.push({
    titleEn: "Input text",
    titleAr: "النص المدخل",
    detailEn: "The plaintext message to be encrypted.",
    detailAr: "رسالة النص الصريح التي سيتم تشفيرها.",
    value: text,
  });
  steps.push({
    titleEn: "Shift key (mod 26)",
    titleAr: "مفتاح الإزاحة (mod 26)",
    detailEn: `The key is taken modulo 26 so it stays within the alphabet range.`,
    detailAr: `يؤخذ المفتاح modulo 26 ليبقى ضمن نطاق الأبجدية.`,
    value: String(shift),
  });

  const result = text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= "Z" ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });

  steps.push({
    titleEn: "Shift each letter",
    titleAr: "إزاحة كل حرف",
    detailEn: `Each letter is shifted forward by ${shift} positions. Non-letter characters remain unchanged.`,
    detailAr: `يتم إزاحة كل حرف للأمام بمقدار ${shift} مواضع. تبقى الأحرف غير الأبجدية بدون تغيير.`,
    value: result,
  });
  return { output: result, steps };
}

/* Title: Caesar Decrypt | فك شيفرة قيصر
   Description (EN): Decrypts by shifting in the opposite direction.
   الوصف (AR): يفك التشفير بالإزاحة في الاتجاه المعاكس.
*/
function caesarDecrypt(text: string, key: number): CryptoResult {
  const result = caesarCipher(text, -key);
  return {
    output: result.output,
    steps: [
      ...result.steps.slice(0, 2),
      {
        titleEn: "Shift each letter backward",
        titleAr: "إزاحة كل حرف للخلف",
        detailEn: `Each letter is shifted backward by ${((key % 26) + 26) % 26} positions to recover the original.`,
        detailAr: `يتم إزاحة كل حرف للخلف بمقداد ${((key % 26) + 26) % 26} مواضع لاستعادة الأصل.`,
        value: result.output,
      },
    ],
  };
}

/* Title: XOR Stream (AES/DES Visual Helper) | دالة XOR المرئية لـ AES/DES
   Description (EN): A simplified visual stand-in for the core round operation — XORs each character code with a rolling key byte to illustrate the concept of a round key application.
   الوصف (AR): بديل مرئي مبسط للعملية الجوهرية للجولة — يجمع XOR بين رمز كل حرف وبايت مفتاح متداول لتوضيح مفهوم تطبيق مفتاح الجولة.
*/
function xorStream(text: string, key: string): string {
  if (!key) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    out += code.toString(16).padStart(2, "0");
  }
  return out;
}

/* Title: AES (Visual Demonstration) | AES (عرض توضيحي)
   Description (EN): Demonstrates the conceptual AES pipeline: key expansion visual, SubBytes/SBox table reference, ShiftRows/Transpose, MixColumns description, and AddRoundKey (XOR). Uses a simplified XOR core for the actual transform so the output is reproducible in-browser.
   الوصف (AR): يوضح خط أنابيب AES المفاهيمي: عرض توسيع المفتاح، مرجع جدول SBox/SubBytes، ShiftRows/التبديل، وصف MixColumns، وAddRoundKey (XOR). يستخدم نواة XOR مبسطة للتحويل الفعلي ليكون الناتج قابلًا للتكرار في المتصفح.
*/
function aesDemo(text: string, key: string, mode: "encrypt" | "decrypt" | "hash"): CryptoResult {
  const steps: CryptoStep[] = [];
  steps.push({
    titleEn: "Input plaintext",
    titleAr: "النص الصريح المدخل",
    detailEn: "The message block entering the AES pipeline.",
    detailAr: "كتلة الرسالة الداخلة إلى خط أنابيب AES.",
    value: text,
  });
  steps.push({
    titleEn: "Key Expansion (128/192/256-bit schedule)",
    titleAr: "توسيع المفتاح (جدول 128/192/256-بت)",
    detailEn: "The cipher key is expanded into round keys, one per round.",
    detailAr: "يتم توسيع مفتاح التشفير إلى مفاتيح جولات، واحد لكل جولة.",
    value: key || "(empty key)",
  });
  steps.push({
    titleEn: "Initial AddRoundKey",
    titleAr: "AddRoundKey الأولية",
    detailEn: "State matrix XORed with the first round key.",
    detailAr: "مصفوفة الحالة تُجمع XOR مع مفتاح الجولة الأول.",
    value: "state ^= roundKey[0]",
  });
  steps.push({
    titleEn: "SubBytes (S-Box substitution)",
    titleAr: "SubBytes (استبدال S-Box)",
    detailEn: "Each byte replaced using the fixed Rijndael S-Box lookup table.",
    detailAr: "يُستبدل كل بايت باستخدام جدول البحث الثابت Rijndael S-Box.",
    value: "S-Box[0x63, 0x7c, 0x77, ...] applied",
  });
  steps.push({
    titleEn: "ShiftRows (byte rotation)",
    titleAr: "ShiftRows (تدوير البايتات)",
    detailEn: "Rows of the state are cyclically shifted left by 0,1,2,3.",
    detailAr: "تُزاح صفوف الحالة دوريًا لليسار بمقدار 0،1،2،3.",
    value: "rows shifted",
  });
  steps.push({
    titleEn: "MixColumns (Galois field diffusion)",
    titleAr: "MixColumns (الانتشار في حقل Galois)",
    detailEn: "Columns mixed via GF(2^8) matrix multiplication to diffuse bits.",
    detailAr: "تُخلط الأعمدة عبر ضرب المصفوفة في GF(2^8) لنشر البتات.",
    value: "columns diffused",
  });
  steps.push({
    titleEn: "Final AddRoundKey (output)",
    titleAr: "AddRoundKey النهائية (المخرج)",
    detailEn: "XOR with the last round key produces the ciphertext (hex).",
    detailAr: "جمع XOR مع مفتاح الجولة الأخير ينتج النص المشفر (سداسي عشر).",
    value: xorStream(text, key || "AESKEY1280000000"),
  });
  return {
    output: mode === "decrypt" ? "Decryption reverses the rounds (InvMixColumns → InvShiftRows → InvSubBytes → AddRoundKey)." : steps[steps.length - 1].value,
    steps,
  };
}

/* Title: DES (Visual Demonstration) | DES (عرض توضيحي)
   Description (EN): Demonstrates the conceptual DES pipeline: initial permutation, 16 Feistel rounds with subkeys, and final permutation. Uses a simplified XOR core for reproducible output.
   الوصف (AR): يوضح خط أنابيب DES المفاهيمي: التبديل الأولي، 16 جولة فيستل مع المفاتيح الفرعية، والتبديل النهائي. يستخدم نواة XOR مبسطة لناتج قابل للتكرار.
*/
function desDemo(text: string, key: string, mode: "encrypt" | "decrypt" | "hash"): CryptoResult {
  const steps: CryptoStep[] = [];
  steps.push({
    titleEn: "Input block (64-bit)",
    titleAr: "كتلة المدخل (64-بت)",
    detailEn: "The 64-bit plaintext block.",
    detailAr: "كتلة النص الصريح 64-بت.",
    value: text,
  });
  steps.push({
    titleEn: "Initial Permutation (IP)",
    titleAr: "التبديل الأولي (IP)",
    detailEn: "Bits rearranged according to the fixed IP table.",
    detailAr: "تُعاد ترتيب البتات وفق جدول IP الثابت.",
    value: "IP table applied",
  });
  steps.push({
    titleEn: "Key schedule → 16 subkeys (56-bit)",
    titleAr: "جدول المفاتيح → 16 مفتاحًا فرعيًا (56-بت)",
    detailEn: "The 64-bit key is reduced to 56 bits and shifted to produce 16 round subkeys.",
    detailAr: "يُختصر مفتاح 64-بت إلى 56-بت ويُزاح لإنتاج 16 مفتاحًا فرعيًا للجولات.",
    value: key || "(empty key)",
  });
  steps.push({
    titleEn: "16 Feistel Rounds (L,R split)",
    titleAr: "16 جولة فيستل (تقسيم L,R)",
    detailEn: "Each round: expansion, key XOR, S-boxes, permutation, then L⊕f(R).",
    detailAr: "كل جولة: توسيع، XOR مع المفتاح، S-boxes، تبديل، ثم L⊕f(R).",
    value: "rounds 1-16 executed",
  });
  steps.push({
    titleEn: "Final Permutation (FP = IP⁻¹)",
    titleAr: "التبديل النهائي (FP = IP⁻¹)",
    detailEn: "The 32-bit halves are swapped and FP is applied to produce ciphertext.",
    detailAr: "تُبادل النصفان 32-بت ويُطبق FP لإنتاج النص المشفر.",
    value: xorStream(text, key || "DESKEY!!"),
  });
  return {
    output: mode === "decrypt" ? "Decryption runs the 16 rounds in reverse with subkeys used in opposite order." : steps[steps.length - 1].value,
    steps,
  };
}

/* Title: RSA Small-Prime Demo | عرض RSA بأعداد أولية صغيرة
   Description (EN): Demonstrates RSA with small primes so the math is visible: key generation (p, q, n, phi, e, d), modular exponentiation encryption, and decryption. Educational only — not for real use.
   الوصف (AR): يوضح RSA بأعداد أولية صغيرة لتظهر الرياضيات: توليد المفاتيح (p, q, n, phi, e, d)، تشفير بالأُس المعياري، وفك التشفير. تعليمي فقط — ليس للاستخدام الحقيقي.
*/
function rsaDemo(text: string): CryptoResult {
  // Small primes for educational visibility
  const p = 61;
  const q = 53;
  const n = p * q; // 3233
  const phi = (p - 1) * (q - 1); // 3120
  const e = 17; // coprime to phi
  // Compute d = e^-1 mod phi
  let d = 0;
  for (let i = 1; i < phi; i++) {
    if ((e * i) % phi === 1) {
      d = i;
      break;
    }
  }
  const steps: CryptoStep[] = [];
  steps.push({
    titleEn: "Choose two primes p, q",
    titleAr: "اختيار عددين أوليين p, q",
    detailEn: "Random prime numbers selected (small values shown for clarity).",
    detailAr: "أعداد أولية عشوائية مختارة (قيم صغيرة للوضوح).",
    value: `p = ${p}, q = ${q}`,
  });
  steps.push({
    titleEn: "Compute modulus n = p × q",
    titleAr: "حساب المقياس n = p × q",
    detailEn: "The modulus n is part of both the public and private keys.",
    detailAr: "المقياس n جزء من كل من المفتاح العام والخاص.",
    value: `n = ${n}`,
  });
  steps.push({
    titleEn: "Compute Euler's totient φ(n) = (p-1)(q-1)",
    titleAr: "حساب دالة أويلر φ(n) = (p-1)(q-1)",
    detailEn: "The totient is used to derive the decryption exponent.",
    detailAr: "تُستخدم الدالة لاشتقاق أُس فك التشفير.",
    value: `φ(n) = ${phi}`,
  });
  steps.push({
    titleEn: "Public exponent e (coprime to φ)",
    titleAr: "الأُس العام e (أولي نسبيًا مع φ)",
    detailEn: "A small value coprime to φ(n), commonly 65537; 17 used here for visibility.",
    detailAr: "قيمة صغيرة أولى نسبيًا مع φ(n)، غالبًا 65537؛ نستخدم 17 هنا للوضوح.",
    value: `e = ${e}`,
  });
  steps.push({
    titleEn: "Private exponent d = e⁻¹ mod φ(n)",
    titleAr: "الأُس الخاص d = e⁻¹ mod φ(n)",
    detailEn: "The modular inverse of e, kept secret.",
    detailAr: "المقابل المعياري لـ e، يُحتفظ به سريًا.",
    value: `d = ${d}`,
  });
  // Encrypt each char: c = m^e mod n
  const encrypted = text
    .split("")
    .map((ch) => {
      const m = ch.charCodeAt(0);
      return String(powMod(m, e, n));
    })
    .join(" ");
  steps.push({
    titleEn: "Encrypt: c = m^e mod n",
    titleAr: "التشفير: c = m^e mod n",
    detailEn: "Each character code m is raised to e modulo n to produce ciphertext c.",
    detailAr: "يُرفع رمز كل حرف m إلى e modulo n لإنتاج النص المشفر c.",
    value: encrypted,
  });
  // Decrypt to verify
  const decrypted = encrypted
    .split(" ")
    .filter(Boolean)
    .map((c) => String.fromCharCode(powMod(parseInt(c, 10), d, n)))
    .join("");
  steps.push({
    titleEn: "Decrypt: m = c^d mod n (verification)",
    titleAr: "فك التشفير: m = c^d mod n (تحقق)",
    detailEn: "Raising ciphertext to d modulo n recovers the original message.",
    detailAr: "رفع النص المشفر إلى d modulo n يستعيد الرسالة الأصلية.",
    value: decrypted,
  });
  return { output: encrypted, steps };
}

/* Title: Fast Modular Exponentiation | الأُس المعياري السريع
   Description (EN): Computes (base^exp) mod m efficiently using binary exponentiation, used by the RSA demo.
   الوصف (AR): يحسب (base^exp) mod m بكفاءة باستخدام الأُس الثنائي، يُستخدم في عرض RSA.
*/
function powMod(base: number, exp: number, mod: number): number {
  let result = 1;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod;
    e = Math.floor(e / 2);
    b = (b * b) % mod;
  }
  return result;
}

/* Title: Diffie-Hellman Key Exchange | تبادل مفاتيح Diffie-Hellman
   Description (EN): Demonstrates the DH protocol with a small public prime and generator: Alice and Bob choose private secrets, exchange public values, and derive a shared secret.
   الوصف (AR): يوضح بروتوكول DH بأعداد أولية ومولد صغيرين: تختار أليس وبوب أسرارًا خاصة، تتبادلان قيمًا عامة، وتشتقان سرًا مشتركًا.
*/
function diffieHellmanDemo(text: string): CryptoResult {
  const p = 23; // public prime
  const g = 5; // public generator
  const a = 6; // Alice private
  const b = 15; // Bob private
  const A = powMod(g, a, p); // Alice public
  const B = powMod(g, b, p); // Bob public
  const sAlice = powMod(B, a, p);
  const sBob = powMod(A, b, p);
  const steps: CryptoStep[] = [];
  steps.push({
    titleEn: "Public parameters: prime p & generator g",
    titleAr: "البارامترات العامة: العدد الأولي p والمولد g",
    detailEn: "Agreed-upon public values visible to everyone (and the attacker).",
    detailAr: "قيم عامة متفق عليها مرئية للجميع (وللمهاجم أيضًا).",
    value: `p = ${p}, g = ${g}`,
  });
  steps.push({
    titleEn: "Alice's private secret a",
    titleAr: "السر الخاص لأليس a",
    detailEn: "A random number known only to Alice, never transmitted.",
    detailAr: "رقم عشوائي تعرفه أليس فقط ولا يُنقل أبدًا.",
    value: `a = ${a}`,
  });
  steps.push({
    titleEn: "Alice's public value A = g^a mod p",
    titleAr: "القيمة العامة لأليس A = g^a mod p",
    detailEn: "Sent to Bob over the insecure channel; safe to intercept.",
    detailAr: "تُرسل إلى بوب عبر القناة غير الآمنة؛ آمن أن تُعترض.",
    value: `A = ${A}`,
  });
  steps.push({
    titleEn: "Bob's private secret b",
    titleAr: "السر الخاص لبوب b",
    detailEn: "A random number known only to Bob, never transmitted.",
    detailAr: "رقم عشوائي يعرفه بوب فقط ولا يُنقل أبدًا.",
    value: `b = ${b}`,
  });
  steps.push({
    titleEn: "Bob's public value B = g^b mod p",
    titleAr: "القيمة العامة لبوب B = g^b mod p",
    detailEn: "Sent to Alice over the insecure channel; safe to intercept.",
    detailAr: "تُرسل إلى أليس عبر القناة غير الآمنة؛ آمن أن تُعترض.",
    value: `B = ${B}`,
  });
  steps.push({
    titleEn: "Shared secret: Alice computes B^a mod p",
    titleAr: "السر المشترك: أليس تحسب B^a mod p",
    detailEn: "Alice uses Bob's public value and her private secret.",
    detailAr: "تستخدم أليس قيمة بوب العامة وسرها الخاص.",
    value: `s = ${sAlice}`,
  });
  steps.push({
    titleEn: "Shared secret: Bob computes A^b mod p",
    titleAr: "السر المشترك: بوب يحسب A^b mod p",
    detailEn: "Bob uses Alice's public value and his private secret. Both derive the same key.",
    detailAr: "يستخدم بوب قيمة أليس العامة وسره الخاص. كلاهما يستنتج نفس المفتاح.",
    value: `s = ${sBob}`,
  });
  steps.push({
    titleEn: "Shared secret established (message)",
    titleAr: "تم تأسيس السر المشترك (الرسالة)",
    detailEn: "The shared secret can now encrypt the message symmetrically.",
    detailAr: "يمكن الآن للسر المشترك تشفير الرسالة بشكل متماثل.",
    value: `key=${sAlice} → encrypts: "${text.slice(0, 40)}"`,
  });
  return { output: `Shared secret = ${sAlice}`, steps };
}

/* Title: SHA-256 Hash (WebCrypto) | تجزئة SHA-256 (WebCrypto)
   Description (EN): Hashes the input using the native SubtleCrypto SHA-256 implementation and displays hex steps (pre-processing note, final digest). Asynchronous.
   الوصف (AR): يجزّئ المدخل باستخدام تنفيذ SHA-256 الأصلي من SubtleCrypto ويعرض خطوات سداسية عشرية (ملاحظة المعالجة الأولية، الملخص النهائي). غير متزامن.
*/
async function sha256Demo(text: string): Promise<CryptoResult> {
  const steps: CryptoStep[] = [];
  steps.push({
    titleEn: "Input message",
    titleAr: "الرسالة المدخلة",
    detailEn: "The data to be hashed (any length).",
    detailAr: "البيانات المراد تجزئتها (أي طول).",
    value: text,
  });
  steps.push({
    titleEn: "Pre-processing: padding to 512-bit blocks",
    titleAr: "المعالجة الأولية: الحشو إلى كتل 512-بت",
    detailEn: "Message is padded so its length is a multiple of 512 bits, with the length appended.",
    detailAr: "تُحشى الرسالة ليصبح طولها من مضاعفات 512-بت، مع إلحاق الطول.",
    value: `padded length: ${Math.ceil((text.length + 9) / 64) * 64} bytes`,
  });
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  steps.push({
    titleEn: "64 rounds of compression",
    titleAr: "64 جولة ضغط",
    detailEn: "Each 512-bit block passes through 64 rounds using the SHA-256 schedule and logical functions.",
    detailAr: "تمر كل كتلة 512-بت عبر 64 جولة باستخدام جدول SHA-256 والدوال المنطقية.",
    value: "K[0..63] + Σ/Ch/Maj applied per round",
  });
  steps.push({
    titleEn: "Final digest (256-bit / 64 hex chars)",
    titleAr: "الملخص النهائي (256-بت / 64 حرف سداسي)",
    detailEn: "One-way fingerprint — cannot be reversed to the original text.",
    detailAr: "بصمة باتجاه واحد — لا يمكن عكسها إلى النص الأصلي.",
    value: hex,
  });
  return { output: hex, steps };
}

/* Title: Dispatch Crypto Operation | توجيه عملية التشفير
   Description (EN): Entry point used by the UI: routes to the correct algorithm implementation based on the id. SHA-256 is async; the rest are sync. Returns the CryptoResult (or a Promise for sha256).
   الوصف (AR): نقطة الدخول المستخدمة في الواجهة: توجه إلى تطبيق الخوارزمية الصحيح بناءً على المعرّف. SHA-256 غير متزامن؛ الباقي متزامن. يرجع CryptoResult (أو Promise لـ sha256).
*/
export function runCrypto(
  id: CryptoId,
  input: string,
  key: string,
  mode: "encrypt" | "decrypt" | "hash"
): CryptoResult | Promise<CryptoResult> {
  switch (id) {
    case "aes":
      return aesDemo(input, key, mode);
    case "des":
      return desDemo(input, key, mode);
    case "rsa":
      return rsaDemo(input);
    case "diffie-hellman":
      return diffieHellmanDemo(input);
    case "sha256":
      return sha256Demo(input);
    case "caesar":
      return mode === "decrypt" ? caesarDecrypt(input, parseInt(key || "3", 10)) : caesarCipher(input, parseInt(key || "3", 10));
  }
}

/* Title: Crypto Catalog Metadata | بيانات خوارزميات التشفير
   Description (EN): UI metadata for each crypto algorithm: names, description, whether it needs a key, supported modes, and type classification.
   الوصف (AR): بيانات واجهة لكل خوارزمية تشفير: الأسماء، الوصف، هل تحتاج مفتاح، الأوضاع المدعومة، وتصنيف النوع.
*/
export const CRYPTO_CATALOG: {
  id: CryptoId;
  nameEn: string;
  nameAr: string;
  icon: string;
  descEn: string;
  descAr: string;
  needsKey: boolean;
  keyLabelEn: string;
  keyLabelAr: string;
  keyPlaceholder: string;
  modes: ("encrypt" | "decrypt" | "hash")[];
  type: "symmetric" | "asymmetric" | "key-exchange" | "hash";
}[] = [
  {
    id: "aes",
    nameEn: "AES",
    nameAr: "AES",
    icon: "Lock",
    descEn: "Advanced Encryption Standard — symmetric block cipher (128/192/256-bit).",
    descAr: "معيار التشفير المتقدم — تشفير كتل متماثل (128/192/256-بت).",
    needsKey: true,
    keyLabelEn: "Secret Key",
    keyLabelAr: "المفتاح السري",
    keyPlaceholder: "AESKEY1280000000",
    modes: ["encrypt", "decrypt"],
    type: "symmetric",
  },
  {
    id: "des",
    nameEn: "DES",
    nameAr: "DES",
    icon: "LockKeyhole",
    descEn: "Data Encryption Standard — 64-bit symmetric Feistel cipher (now legacy).",
    descAr: "معيار تشفير البيانات — تشفير فيستل متماثل 64-بت (قديم الآن).",
    needsKey: true,
    keyLabelEn: "Secret Key",
    keyLabelAr: "المفتاح السري",
    keyPlaceholder: "DESKEY!!",
    modes: ["encrypt", "decrypt"],
    type: "symmetric",
  },
  {
    id: "rsa",
    nameEn: "RSA",
    nameAr: "RSA",
    icon: "KeyRound",
    descEn: "Rivest–Shamir–Adleman — asymmetric public-key cryptosystem.",
    descAr: "ريفيست-شامير-أدلمان — نظام تشفير غير متماثل بالمفتاح العام.",
    needsKey: false,
    keyLabelEn: "",
    keyLabelAr: "",
    keyPlaceholder: "",
    modes: ["encrypt"],
    type: "asymmetric",
  },
  {
    id: "diffie-hellman",
    nameEn: "Diffie-Hellman",
    nameAr: "ديفي-هلمان",
    icon: "Shuffle",
    descEn: "Key exchange protocol — two parties derive a shared secret in public.",
    descAr: "بروتوكول تبادل المفاتيح — يشتق طرفان سرًا مشتركًا علنًا.",
    needsKey: false,
    keyLabelEn: "",
    keyLabelAr: "",
    keyPlaceholder: "",
    modes: ["encrypt"],
    type: "key-exchange",
  },
  {
    id: "sha256",
    nameEn: "SHA-256",
    nameAr: "SHA-256",
    icon: "Fingerprint",
    descEn: "Secure Hash Algorithm — one-way 256-bit fingerprint (no key, no decrypt).",
    descAr: "خوارزمية التجزئة الآمنة — بصمة باتجاه واحد 256-بت (بدون مفتاح، بدون فك).",
    needsKey: false,
    keyLabelEn: "",
    keyLabelAr: "",
    keyPlaceholder: "",
    modes: ["hash"],
    type: "hash",
  },
  {
    id: "caesar",
    nameEn: "Caesar Cipher",
    nameAr: "شيفرة قيصر",
    icon: "Type",
    descEn: "Classical substitution cipher — shifts letters by a fixed key.",
    descAr: "شيفرة استبدال كلاسيكية — تزيح الأحرف بمفتاح ثابت.",
    needsKey: true,
    keyLabelEn: "Shift Key (number)",
    keyLabelAr: "مفتاح الإزاحة (رقم)",
    keyPlaceholder: "3",
    modes: ["encrypt", "decrypt"],
    type: "symmetric",
  },
];
