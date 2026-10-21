"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { type DataTableFeatures } from "@/components/data-table-features";
import { Checkbox } from "@/components/ui/checkbox";
import { Actions } from "@/components/actions";

export type ResponseType = InferResponseType<typeof client.api.categories.$get, 200>["data"][number];

export const columns: ColumnDef<DataTableFeatures, ResponseType, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all categories"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select categories"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "includesString",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  }
];
