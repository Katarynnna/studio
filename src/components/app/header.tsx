
"use client";

import { User, Mail, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { LogoIcon } from "@/components/icons/logo-icon";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = {
  setProfileOpen: Dispatch<SetStateAction<boolean>>;
  setInboxOpen: Dispatch<SetStateAction<boolean>>;
  setTrailRadioOpen: Dispatch<SetStateAction<boolean>>;
  hasUnreadMessages: boolean;
};

export default function Header({ setProfileOpen, setInboxOpen, setTrailRadioOpen, hasUnreadMessages }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b shrink-0 z-20 bg-background">
      <Link href="/" className="flex items-center gap-2">
        <LogoIcon className="w-8 h-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold tracking-tight font-headline hidden sm:block">
          Trail Angel Hub
        </h1>
      </Link>
      <nav className="flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" onClick={() => setTrailRadioOpen(true)} size="icon" className="md:hidden">
            <Radio />
            <span className="sr-only">Trail Radio</span>
        </Button>
        <Button variant="ghost" onClick={() => setInboxOpen(true)} size="icon" className="relative group">
            {hasUnreadMessages && (
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-accent z-10 transition-opacity group-hover:opacity-0" />
            )}
          <Mail />
          <span className="sr-only md:hidden">Inbox</span>
        </Button>
        <Button variant="ghost" onClick={() => setProfileOpen(true)} size="icon">
          <User />
          <span className="sr-only md:hidden">My Account</span>
        </Button>
      </nav>
    </header>
  );
}
