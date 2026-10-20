"use client";

import { Edit, MoreHorizontal } from "lucide-react";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-8 p-0 flex items-center justify-center hover:bg-slate-100 rounded-md">
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpen(id)}>
          <Edit className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
