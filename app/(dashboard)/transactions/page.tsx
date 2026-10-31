"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet"; // <-- Importar

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./columns";

export default function TransactionsPage() {
  const newTransaction = useNewTransaction();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-y-0">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-125 w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <NewTransactionSheet />
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-y-0">
            <CardTitle className="text-xl line-clamp-1">
              Transaction History
            </CardTitle>
            <Button onClick={newTransaction.onOpen} size="sm">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              filterKey="payee"
              columns={columns}
              data={transactions}
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                deleteTransactions.mutate({ ids });
              }}
              disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
