"use client";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

export default function Home() {
  const { onOpen } = useNewAccount();
  const { data: accounts, isLoading } = useGetAccounts();

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <div className="h-56 w-full flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-slate-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl text-white font-semibold">Cuentas</h1>
        <Button onClick={onOpen} size="sm">
          <Plus className="size-4 mr-2" />
          Agregar nueva
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts?.map((account) => (
          <div key={account.id} className="p-4 bg-white rounded-md shadow-sm border">
            {account.name}
          </div>
        ))}
      </div>
    </div>
  );
}
