"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { type DataTableFeatures } from "@/components/data-table-features";

export type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>["data"][number];

export const columns: ColumnDef<DataTableFeatures, ResponseType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];
