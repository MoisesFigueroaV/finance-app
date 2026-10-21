"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewCategories } from "@/features/categories/hooks/use-new-categories";
import { CategoriesForm } from "@/features/categories/components/categories-form";
import { useCreateCategories } from "@/features/categories/api/use-create-categories";

export const NewCategoriesSheet = () => {
  const { isOpen, onClose } = useNewCategories();

  const mutation = useCreateCategories();

  const onSubmit = (values: { name: string }) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 px-6">
        <SheetHeader>
          <SheetTitle className="text-center">New Categories</SheetTitle>
          <SheetDescription className="text-center">
            Create a new categories to track your transactions.
          </SheetDescription>
        </SheetHeader>

        <CategoriesForm
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
