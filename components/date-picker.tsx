"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

type Props = {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabled?: boolean;
};

export const DatePicker = ({
  value,
  onChange,
  disabled,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />

            {value ? (
              format(value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        }
      />

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-auto p-0"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
