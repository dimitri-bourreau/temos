"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { LocaleToggle } from "@/components/molecules/locale-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { MobileSidebarContent } from "./mobile-nav";

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-1">
        <LocaleToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
