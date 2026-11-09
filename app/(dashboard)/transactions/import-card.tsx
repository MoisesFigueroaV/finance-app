import { useState } from "react";
import { format, parse } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { convertAmountToMiliunits } from "@/lib/utils";

import { ImportTable } from "./import-table";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
  "amount",
  "date",
  "payee",
] as const;

type RequiredOption = (typeof requiredOptions)[number];

interface SelectedColumnsState {
  [key: string]: string | null;
}

export type ImportedRow = {
  amount: number;
  date: string;
  payee: string;
};

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: ImportedRow[]) => void;
};

export const ImportCard = ({
  data,
  onCancel,
  onSubmit,
}: Props) => {
  const [selectedColumns, setSelectedColumns] =
    useState<SelectedColumnsState>({});

  const headers = data[0] ?? [];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;

      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const mappedData = {
      headers: headers.map((_header, index) => {
        return selectedColumns[`column_${index}`] || null;
      }),

      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            return selectedColumns[`column_${index}`]
              ? cell
              : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce<Record<string, string>>(
        (acc, cell, index) => {
          const header = mappedData.headers[index];

          if (header !== null && cell !== null) {
            acc[header] = cell;
          }

          return acc;
        },
        {}
      );
    });

    const formattedData: ImportedRow[] = arrayOfData.map((item) => {
      if (
        !item.amount ||
        !item.date ||
        !item.payee
      ) {
        throw new Error(
          "Missing required transaction data"
        );
      }

      return {
        amount: convertAmountToMiliunits(
          parseFloat(item.amount)
        ),
        date: format(
          parse(item.date, dateFormat, new Date()),
          outputFormat
        ),
        payee: item.payee,
      };
    });

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>

          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              onClick={onCancel}
              size="sm"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              onClick={handleContinue}
              className="w-full lg:w-auto"
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
