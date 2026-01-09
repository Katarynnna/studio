"use client";

import { User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { LogoIcon } from "@/components/icons/logo-icon";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = {
  setProfileOpen: Dispatch<SetStateAction<boolean>>;
  setInboxOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Header({ setProfileOpen, setInboxOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <LogoIcon className="w-8 h-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold tracking-tight font-headline">
          Trail Angel Hub
        </h1>
      </Link>
      <nav className="flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" onClick={() => setInboxOpen(true)} size="icon" className="md:w-auto md:px-4">
          <Mail />
          <span className="hidden md:inline">Inbox</span>
        </Button>
        <Button variant="ghost" onClick={() => setProfileOpen(true)} size="icon" className="md:w-auto md:px-4">
          <User />
          <span className="hidden md:inline">My Account</span>
        </Button>
      </nav>
    </header>
  );
}
