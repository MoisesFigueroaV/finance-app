"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Popover } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-day-picker/style.css";

type Props = {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button
            disabled={disabled}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={4}>
          <Popover.Popup className="z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none">
            <DayPicker
              mode="single"
              selected={value}
              onSelect={onChange}
              disabled={disabled}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
