/**
 * Delivery scheduling and validation utilities for Cerato Arte Floral.
 *
 * Rules:
 * 1. Minimum 24 hours lead time for guaranteed delivery.
 * 2. Monday to Friday slots:
 *    - 10:00 a.m. a 1:00 p.m.
 *    - 1:00 p.m. a 4:00 p.m.
 *    - 4:00 p.m. a 7:00 p.m.
 * 3. Saturday slots:
 *    - 10:00 a.m. a 1:00 p.m.
 *    - 1:00 p.m. a 4:00 p.m.
 * 4. Sundays: Sin servicio de entregas.
 */

export interface DeliverySlot {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
}

export const WEEKDAY_SLOTS: DeliverySlot[] = [
  { id: "10-13", label: "10:00 a.m. a 1:00 p.m.", startHour: 10, endHour: 13 },
  { id: "13-16", label: "1:00 p.m. a 4:00 p.m.", startHour: 13, endHour: 16 },
  { id: "16-19", label: "4:00 p.m. a 7:00 p.m.", startHour: 16, endHour: 19 },
];

export const SATURDAY_SLOTS: DeliverySlot[] = [
  { id: "10-13", label: "10:00 a.m. a 1:00 p.m.", startHour: 10, endHour: 13 },
  { id: "13-16", label: "1:00 p.m. a 4:00 p.m.", startHour: 13, endHour: 16 },
];

const LEAD_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Parses YYYY-MM-DD string into a local Date at midnight.
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Formats a local Date into YYYY-MM-DD string.
 */
export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns slots for a given date, checking day of week and 24h lead time.
 */
export function getAvailableSlotsForDate(
  dateStr: string,
  now: Date = new Date()
): { slot: DeliverySlot; isAvailable: boolean; reason?: string }[] {
  if (!dateStr) return [];
  const targetDate = parseDateString(dateStr);
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 6 = Saturday

  // Sundays have no delivery service
  if (dayOfWeek === 0) {
    return [];
  }

  const baseSlots = dayOfWeek === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
  const minAllowedTime = now.getTime() + LEAD_TIME_MS;

  return baseSlots.map((slot) => {
    // Construct start time of the slot on the target day
    const slotStartTime = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      slot.startHour,
      0,
      0,
      0
    ).getTime();

    const isAvailable = slotStartTime >= minAllowedTime;

    return {
      slot,
      isAvailable,
      reason: isAvailable
        ? undefined
        : "Requiere mínimo 24h de anticipación",
    };
  });
}

/**
 * Generates selectable days for the next N days (default 21 days),
 * calculating availability based on the 24h rule and Sunday closure.
 */
export function getUpcomingDeliveryDays(
  daysCount: number = 21,
  now: Date = new Date()
): {
  dateStr: string;
  date: Date;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isSunday: boolean;
  hasAvailableSlots: boolean;
}[] {
  const days: ReturnType<typeof getUpcomingDeliveryDays> = [];

  const dayNamesShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNamesShort = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];

  // Start checking from tomorrow (day + 1)
  for (let i = 1; i <= daysCount; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const dateStr = toISODateString(d);
    const dayOfWeek = d.getDay();
    const isSunday = dayOfWeek === 0;

    const slots = getAvailableSlotsForDate(dateStr, now);
    const hasAvailableSlots = slots.some((s) => s.isAvailable);

    days.push({
      dateStr,
      date: d,
      dayName: dayNamesShort[dayOfWeek],
      dayNumber: d.getDate(),
      monthName: monthNamesShort[d.getMonth()],
      isSunday,
      hasAvailableSlots,
    });
  }

  return days;
}

/**
 * Returns a human-friendly Spanish string for the delivery date,
 * e.g., "Miércoles, 21 de octubre de 2026".
 */
export function formatDeliveryDateHuman(dateStr: string): string {
  if (!dateStr) return "";
  const date = parseDateString(dateStr);
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
}

/**
 * Validates whether a specific slot on a specific date is currently available (passes 24h lead time).
 */
export function isDeliverySlotAvailable(
  dateStr: string,
  slotLabel: string,
  now: Date = new Date()
): boolean {
  if (!dateStr || !slotLabel) return false;
  const slots = getAvailableSlotsForDate(dateStr, now);
  const matched = slots.find((s) => s.slot.label === slotLabel);
  return matched ? matched.isAvailable : false;
}

export interface CalendarCell {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isAvailable: boolean;
  isPastOrLeadTime: boolean;
}

/**
 * Generates calendar grid cells (42 or 35 cells) for month-view display
 * with Sunday disabled and 24-hour lead time checks.
 */
export function getMonthCalendarGrid(
  year: number,
  month: number, // 0-indexed (0 = Jan, 11 = Dec)
  now: Date = new Date()
): CalendarCell[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const cells: CalendarCell[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i;
    const date = new Date(year, month - 1, dayNumber);
    const dateStr = toISODateString(date);
    cells.push({
      dateStr,
      dayNumber,
      isCurrentMonth: false,
      isSunday: date.getDay() === 0,
      isAvailable: false,
      isPastOrLeadTime: true,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = toISODateString(date);
    const isSunday = date.getDay() === 0;
    const slots = getAvailableSlotsForDate(dateStr, now);
    const hasAvailableSlots = slots.some((s) => s.isAvailable);

    cells.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isSunday,
      isAvailable: !isSunday && hasAvailableSlots,
      isPastOrLeadTime: isSunday || !hasAvailableSlots,
    });
  }

  // Next month leading days to complete full 7-day rows
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let nextD = 1; nextD <= remaining; nextD++) {
    const date = new Date(year, month + 1, nextD);
    const dateStr = toISODateString(date);
    cells.push({
      dateStr,
      dayNumber: nextD,
      isCurrentMonth: false,
      isSunday: date.getDay() === 0,
      isAvailable: false,
      isPastOrLeadTime: true,
    });
  }

  return cells;
}
