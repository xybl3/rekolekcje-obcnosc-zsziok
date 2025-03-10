import { CheckIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";

export const classes: { label: string; value: string }[] = [
  // Klasy 5 - TEP, TIP, THP, TRP
  { label: "5TEP", value: "5TEP" },
  { label: "5TIP", value: "5TIP" },
  { label: "5THP", value: "5THP" },
  { label: "5TRP", value: "5TRP" },
  //Klasy 4 TE, TR, TI, TRI, LOC, LOD
  { label: "4TE", value: "4TE" },
  { label: "4TR", value: "4TR" },
  { label: "4TI", value: "4TI" },
  { label: "4TRI", value: "4TRI" },
  { label: "4LOA", value: "4LOA" },
  { label: "4LOC", value: "4LOC" },
  { label: "4LOD", value: "4LOD" },
  //Klasy 3 TE TR TI TRH LOC LOD W
  { label: "3TE", value: "3TE" },
  { label: "3TR", value: "3TR" },
  { label: "3TI", value: "3TI" },
  { label: "3TRH", value: "3TRH" },
  { label: "3LOA", value: "3LOA" },
  { label: "3LOC", value: "3LOC" },
  { label: "3LOD", value: "3LOD" },
  { label: "3W", value: "3W" },
  { label: "3HW", value: "3HW" },
  //Klasy 2 TE TRH TI TR LOA LOC LOD W H
  { label: "2TE", value: "2TE" },
  { label: "2TRH", value: "2TRH" },
  { label: "2TI", value: "2TI" },
  { label: "2TR", value: "2TR" },
  { label: "2LOA", value: "2LOA" },
  { label: "2LOC", value: "2LOC" },
  { label: "2LOD", value: "2LOD" },
  { label: "2W", value: "2W" },
  { label: "2H", value: "2H" },
  //Klasy 1 TE TRH TI TR LOA LOC LOD W H
  { label: "1TE", value: "1TE" },
  { label: "1TH", value: "1TH" },
  { label: "1TRH", value: "1TRH" },
  { label: "1TI", value: "1TI" },
  { label: "1TR", value: "1TR" },
  { label: "1LOA", value: "1LOA" },
  { label: "1LOC", value: "1LOC" },
  { label: "1LOD", value: "1LOD" },
  { label: "1W", value: "1W" },
  { label: "1H", value: "1H" },
];

function ClassSelection({
  onSelect,
  defaultValue,
}: {
  onSelect: (value: string) => void;
  defaultValue?: string;
}) {
  const [classSelectionOpen, setClassSelectionOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  return (
    <Popover open={classSelectionOpen} onOpenChange={setClassSelectionOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between dark:text-white"
        >
          {/* {value ? value.toUpperCase() : "Wybierz klasę.."} */}
          {value && (
            <span>
              {classes.find((e) => e.value.toLowerCase() === value)?.label}
            </span>
          )}
          {!value && <span className="opacity-50">Wybierz klasę</span>}
          {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 h-[300px] bg-transparent">
        <Command className="">
          <CommandInput placeholder="Wybierz klasę" className="h-9" />
          <CommandEmpty>Klasa nie znaleziona</CommandEmpty>
          <CommandGroup className="overflow-y-auto scrollbar scrollbar">
            {classes.map((cla) => (
              <CommandItem
                key={cla.value}
                value={cla.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setClassSelectionOpen(false);
                  onSelect(currentValue);
                }}
              >
                {cla.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === cla.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ClassSelection;
