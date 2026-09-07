const supportedTimeZones = new Set<string>(Intl.supportedValuesOf("timeZone"));

/** Browser-reported IANA timezone, e.g. "Europe/Berlin". */
export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * True only for a real IANA time zone name. Used to validate timezone input
 * from the browser (client-supplied values are untrusted until this passes).
 * "UTC" is accepted explicitly because some runtimes omit it from
 * `supportedValuesOf` even though browsers legitimately report it.
 */
export function isIANATimeZone(value: unknown): value is string {
  return (
    value === "UTC" ||
    (typeof value === "string" && supportedTimeZones.has(value))
  );
}
