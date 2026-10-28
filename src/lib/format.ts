/**
 * Display helpers shared by the storefront and the admin.
 */

/**
 * Normalise any customer-entered phone number to international format for
 * display and tel: links. Nigerian local numbers (0XXXXXXXXXX) are converted
 * to +234..., bare 234... numbers get a leading +. Anything unrecognisable is
 * returned unchanged (trimmed) so we never mangle odd input.
 */
export function intlPhone(raw: string): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "";
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;

  if (hasPlus) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  if (digits.startsWith("234")) return `+${digits}`;
  return trimmed;
}

/**
 * Normalise a customer-entered Nigerian phone number to the stored
 * international form "+234XXXXXXXXXX". Accepts an 11-digit local number
 * starting with 0 (0XXXXXXXXXX), a bare country-code number (234XXXXXXXXXX)
 * or an already-international one (+234XXXXXXXXXX); spaces, dashes and
 * brackets are allowed anywhere. Returns null for anything else (wrong
 * length, other countries, letters, empty) so callers can show an inline
 * validation error. Phones are handled as strings end to end - never with
 * Number()/parseInt, which would swallow the leading zero.
 */
export function formatNigerianPhone(raw: string): string | null {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/[\s()-]/g, "").replace(/^\+/, "");
  if (/^0\d{10}$/.test(digits)) return `+234${digits.slice(1)}`;
  if (/^234\d{10}$/.test(digits)) return `+${digits}`;
  return null;
}

/**
 * True when two phone strings refer to the same number across formats:
 * both normalise to the same +234 number, or (legacy fallback for stored
 * numbers that predate normalisation) their digit-only forms match.
 */
export function phonesMatch(a: string, b: string): boolean {
  const normalisedA = formatNigerianPhone(a);
  const normalisedB = formatNigerianPhone(b);
  if (normalisedA && normalisedB) return normalisedA === normalisedB;
  return a.replace(/\D/g, "") === b.replace(/\D/g, "");
}

/** Digits-only form suitable for a tel: href (keeps a leading +). */
export function telHref(raw: string): string {
  const intl = intlPhone(raw);
  return intl.startsWith("+") ? intl.replace(/[^\d+]/g, "") : intl.replace(/\D/g, "");
}

const SWATCH_COLORS: Record<string, string> = {
  "natural black": "#1f1f1f",
  "jet black": "#0d0d0d",
  "off black": "#2b2b2b",
  "dark brown": "#3e2723",
  "chocolate brown": "#5d4037",
  "honey blonde": "#d9b382",
  "ginger blonde": "#c98a3d",
  auburn: "#6d3a2a",
};

/** Map a colour name to a swatch hex (neutral fallback for unknown names). */
export function swatchColor(name: string): string {
  return SWATCH_COLORS[(name ?? "").trim().toLowerCase()] ?? "#8a7350";
}

/** Pretty-print an international Nigerian number: +234 812 345 6789. */
export function formatIntlPhone(raw: string): string {
  const intl = intlPhone(raw);
  const m = intl.match(/^\+(\d{3})(\d{3})(\d{3})(\d+)$/);
  if (m) return `+${m[1]} ${m[2]} ${m[3]} ${m[4]}`;
  return intl;
}

/**
 * Studio pickup location from Settings: "address, city". Skips the city when
 * the address already contains it (e.g. "Lagos, Nigeria" + "Lagos") so the
 * line never reads "Lagos, Nigeria, Lagos".
 */
export function studioLocation(address: string, city: string): string {
  const a = (address ?? "").trim();
  const c = (city ?? "").trim();
  if (a && c && !a.toLowerCase().includes(c.toLowerCase())) return `${a}, ${c}`;
  return a || c;
}
