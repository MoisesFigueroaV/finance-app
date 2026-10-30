"use client";

import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) => {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    const newValue = (parseFloat(value) * -1).toString();
    onChange(newValue);
  };

  return (
    <div className="relative">
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "bg-slate-400 hover:bg-slate-500 absolute left-1.5 top-1.5 flex items-center justify-center rounded-md p-2 transition",
                isIncome && "bg-emerald-500 hover:bg-emerald-600",
                isExpense && "bg-rose-500 hover:bg-rose-600"
              )}
            >
              {!parsedValue && <Info className="size-4 text-white" />}
              {isIncome && <PlusCircle className="size-4 text-white" />}
              {isExpense && <MinusCircle className="size-4 text-white" />}
            </button>
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom" sideOffset={4}>
            <Tooltip.Popup className="z-50 rounded bg-slate-900 px-2.5 py-1 text-xs text-white shadow-md">
              [+] Income | [-] Expense
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <CurrencyInput
        prefix="$"
        className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        value={value}
        decimalsLimit={2}
        decimalScale={2}
        onValueChange={onChange}
        disabled={disabled}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {isIncome && "This will count as income"}
        {isExpense && "This will count as an expense"}
      </p>
    </div>
  );
};
