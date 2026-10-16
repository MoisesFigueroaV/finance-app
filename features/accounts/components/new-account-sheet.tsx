"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { AccountForm } from "@/features/accounts/components/account-form";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const onSubmit = (values: { name: string }) => {
    console.log({ values });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 px-6">
        <SheetHeader>
          <SheetTitle className="text-center">New Account</SheetTitle>
          <SheetDescription className="text-center">
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>

        <AccountForm
          onSubmit={onSubmit}
          disabled={false}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
