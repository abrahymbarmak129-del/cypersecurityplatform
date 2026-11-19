// ============================================================================
// Title: Hardware State & Output Payload Builder | بناء حالة الهاردوير وحمولة المخرجات
// Description (EN): Maps the current system state (idle / protected / breached) into the concrete hardware outputs (LED color, buzzer, LCD text, sensor telemetry) that would be sent to the ESP32 and physical components.
// الوصف (AR): يربط حالة النظام الحالية (استعداد / محمي / مخترق) بمخرجات الهاردوير الملموسة (لون LED، الجرس، نص LCD، قراءات المستشعرات) التي ستُرسل إلى ESP32 والمكونات الفعلية.
// ============================================================================

import type { HardwarePayload, SystemState, LedColor, BuzzerState } from "./types";
import type { Lang } from "../i18n";

/* Title: State to LED Mapping | ربط الحالة بلون LED
   Description (EN): Returns the LED color for a given system state: yellow for idle, green for protected, red for breached.
   الوصف (AR): يرجع لون LED لحالة نظام معينة: أصفر للاستعداد، أخضر للمحمي، أحمر للمخترق.
*/
export function stateToLed(state: SystemState): LedColor {
  if (state === "idle") return "yellow";
  if (state === "protected") return "green";
  return "red";
}

/* Title: State to Buzzer Mapping | ربط الحالة بالجرس
   Description (EN): The buzzer only sounds (on) when a breach is detected; otherwise it stays off.
   الوصف (AR): الجرس يعمل فقط عند اكتشاف اختراق؛ وإلا يبقى متوقفًا.
*/
export function stateToBuzzer(state: SystemState): BuzzerState {
  return state === "breached" ? "on" : "off";
}

/* Title: State to LCD Line | ربط الحالة بسطر شاشة LCD
   Description (EN): Returns a single LCD display line in the active language for the given system state.
   الوصف (AR): يرجع سطر شاشة LCD واحد باللغة النشطة لحالة النظام المعطاة.
*/
export function stateToLcdLine(state: SystemState, lang: Lang): string {
  if (lang === "ar") {
    switch (state) {
      case "idle":
        return "المنصة جاهزة - لا يوجد هجوم";
      case "protected":
        return "يوجد هجوم وتم التصدي له";
      case "breached":
        return "تم الاختراق - الإنذار يعمل";
    }
  }
  switch (state) {
    case "idle":
      return "Platform Ready - No Attack Detected";
    case "protected":
      return "Attack Detected - Blocked by Protection";
    case "breached":
      return "BREACH DETECTED! Alarm Active";
  }
}

/* Title: Build Hardware Payload | بناء حمولة الهاردوير
   Description (EN): Assembles the full hardware payload from the current state, active language, optional telemetry values, and the configured outbound endpoint URL.
   الوصف (AR): يجمع الحمولة الكاملة للهاردوير من الحالة الحالية واللغة النشطة وقيم القراءات الاختيارية وعنوان الإرسال المُعد.
*/
export function buildHardwarePayload(
  state: SystemState,
  lang: Lang,
  endpointUrl: string,
  telemetry?: Partial<HardwarePayload["sensorReadings"]>
): HardwarePayload {
  const baseTelemetry = {
    networkTraffic: 0,
    threatLevel: 0,
    cpuLoad: 12,
    packetRate: 0,
  };
  return {
    ledColor: stateToLed(state),
    buzzer: stateToBuzzer(state),
    lcdLine: stateToLcdLine(state, lang),
    sensorReadings: { ...baseTelemetry, ...telemetry },
    timestamp: Date.now(),
    endpointUrl,
  };
}

/* Title: Telemetry by State | القراءات حسب الحالة
   Description (EN): Produces plausible sensor readings for each system state so the monitor panel shows realistic live telemetry.
   الوصف (AR): ينتج قراءات مستشعرات معقولة لكل حالة نظام ليُظهر لوح المراقبة قراءات حية واقعية.
*/
export function telemetryForState(
  state: SystemState,
  tick: number
): HardwarePayload["sensorReadings"] {
  if (state === "idle") {
    return {
      networkTraffic: 5 + (tick % 7),
      threatLevel: 0,
      cpuLoad: 10 + (tick % 6),
      packetRate: 20 + (tick % 30),
    };
  }
  if (state === "protected") {
    return {
      networkTraffic: 45 + (tick % 20),
      threatLevel: 60 + (tick % 25),
      cpuLoad: 40 + (tick % 15),
      packetRate: 800 + (tick % 400),
    };
  }
  return {
    networkTraffic: 85 + (tick % 12),
    threatLevel: 95 + (tick % 5),
    cpuLoad: 80 + (tick % 18),
    packetRate: 5000 + (tick % 3000),
  };
}
