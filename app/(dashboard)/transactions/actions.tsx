"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Menu as DropdownMenu } from "@base-ui/react/menu";

import { useConfirm } from "@/app/hooks/use-confirm";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";

import { Button } from "@/components/ui/button";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const deleteMutation = useDeleteTransaction(id);
  const { onOpen } = useOpenTransaction();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          render={
            <Button variant="ghost" className="size-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenu.Portal>
          <DropdownMenu.Positioner side="bottom" align="end" sideOffset={4}>
            <DropdownMenu.Popup className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none">
              <DropdownMenu.Item
                disabled={deleteMutation.isPending}
                onClick={() => onOpen(id)}
                className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                <Edit className="mr-2 size-4" />
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-rose-600 outline-none transition-colors hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700 disabled:pointer-events-none disabled:opacity-50"
              >
                <Trash className="mr-2 size-4" />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Popup>
          </DropdownMenu.Positioner>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};
