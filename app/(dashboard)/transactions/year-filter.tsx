"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Cuántos años hacia atrás se ofrecen en el selector
const YEARS_BACK = 5;

export const YearFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: YEARS_BACK + 1 },
    (_, i) => String(currentYear - i)
  );

  // El año seleccionado se deduce de from/to en la URL
  const from = params.get("from");
  const to = params.get("to");
  const year = from ? from.slice(0, 4) : "";
  const selected =
    from && to && from === `${year}-01-01` && to === `${year}-12-31`
      ? year
      : "all";

  const onChange = (value: string) => {
    const query = new URLSearchParams(params.toString());

    if (value === "all") {
      query.delete("from");
      query.delete("to");
    } else {
      query.set("from", `${value}-01-01`);
      query.set("to", `${value}-12-31`);
    }

    const qs = query.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by year"
      className="h-8 w-full lg:w-auto rounded-md border border-input bg-background px-3 text-sm"
    >
      <option value="all">All years</option>
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
};
