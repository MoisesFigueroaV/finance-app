"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export const AccountFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const { data: accounts, isLoading } = useGetAccounts();

  // La cuenta seleccionada vive en la URL (?accountId=...)
  const accountId = params.get("accountId") ?? "all";

  const onChange = (value: string) => {
    // Se copian los parámetros actuales para conservar from/to (año)
    const query = new URLSearchParams(params.toString());

    if (value === "all") {
      query.delete("accountId");
    } else {
      query.set("accountId", value);
    }

    const qs = query.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <select
      value={accountId}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      aria-label="Filter by account"
      className="h-8 w-full lg:w-auto rounded-md border border-input bg-background px-3 text-sm"
    >
      <option value="all">All accounts</option>
      {(accounts ?? []).map((account) => (
        <option key={account.id} value={account.id}>
          {account.name}
        </option>
      ))}
    </select>
  );
};
