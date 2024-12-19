"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

// type Role = Record<"value" | "label", string>;
type Role = Record<"id" | "label", string>;

type MultiSelectProps = {
  selectedPermissions: Role[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<Role[]>>;
  permissions: Role[];
  placeholder: string;
};
export function MultiSelectPermissions({
  setSelectedPermissions: setSelected,
  permissions,
  selectedPermissions: selected,
  placeholder,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  //const [selected, setSelected] = React.useState<Framework[]>([FRAMEWORKS[1]]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((framework: Role) => {
    setSelected((prev) => prev.filter((s) => s.id !== framework.id));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );
console.log(selected)
console.log(permissions)
  const selectables = permissions.filter(
    (permission) => !selected.includes(permission)
  );

  console.log(selectables, selected, inputValue);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
        <div className="flex w-fit items-start flex-wrap gap-1">
          {selected.map((permission) => {
            return (
              <Badge key={permission.id} variant="defaultBtn">
                {permission.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(permission);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(permission)}
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </Badge>
            );
          })}

          {/* Avoid having the "Search" Icon */}
          <div className="flex w-fit">
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="w-20 ml-2 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
      <div
        className="relative mt
      -2"
      >
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover  shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((permission) => {
                  return (
                    <CommandItem
                      key={permission.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, permission]);
                      }}
                      className={
                        "cursor-pointer data-[selected='true']:bg-blue-500 data-[selected=true]:text-white text-muted-foreground hover:bg-blue-500 hover:text-white"
                      }
                    >
                      {permission.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
