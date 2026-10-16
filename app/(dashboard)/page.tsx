"use client";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function Home() {
  const { onOpen } = useNewAccount();
  const { data: accounts, isLoading } = useGetAccounts();

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      {/* El header y el botón nunca se desmontan ni parpadean */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl text-white font-semibold">Cuentas</h1>
        <Button onClick={onOpen} size="sm">
          <Plus className="size-4 mr-2" />
          Agregar nueva
        </Button>
      </div>

      {/* Solo se alternan los elementos de la lista o las barras de carga */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts?.map((account) => (
            <div
              key={account.id}
              className="p-4 bg-white rounded-md shadow-sm border"
            >
              {account.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
