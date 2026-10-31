"use client";

import { useOpenCategories } from "@/features/categories/hooks/use-open-categories";
import { useGetCategory } from "@/features/categories/api/use-get-category"; // <-- Usar singular (useGetCategory)
import { useEditCategories } from "@/features/categories/api/use-edit-categories";
import { useDeleteCategories } from "@/features/categories/api/use-delete-categories";
import { CategoriesForm } from "@/features/categories/components/categories-form";
import { useConfirm } from "@/app/hooks/use-confirm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

type FormValues = {
  name: string;
};

export const EditCategoriesSheet = () => {
  const { isOpen, onClose, id } = useOpenCategories();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category."
  );

  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategories(id);
  const deleteMutation = useDeleteCategories(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = categoryQuery.data
    ? { name: categoryQuery.data.name }
    : { name: "" };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Edit an existing category to organize your transactions.
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoriesForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
