"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NavButton } from "@/components/ui/nav-button";
import { useMedia } from "react-use";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const routes = [
  {
    href: "/",
    label: "Overview"
  },
  {
    href: "/transactions",
    label: "Transactions"
  },
  {
    href: "/accounts",
    label: "Accounts"
  },
  {
    href: "/categories",
    label: "Categories"
  },
  {
    href: "/settings",
    label: "Settings"
  }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={ pathname === route.href }
        />
      ))}
    </nav>
  )
};
