"use client";

import { User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";

type HeaderProps = {
  setProfileOpen: Dispatch<SetStateAction<boolean>>;
  setInboxOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Header({ setProfileOpen, setInboxOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/assets/logo.svg" alt="Trail Angel Hub Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Trail Angel Hub
        </h1>
      </Link>
      <nav className="flex items-center gap-1">
        <Button variant="ghost" onClick={() => setInboxOpen(true)}>
          <Mail className="text-primary" />
          <span>Inbox</span>
        </Button>
        <Button variant="ghost" onClick={() => setProfileOpen(true)}>
          <User className="text-accent" />
          <span>My Account</span>
        </Button>
      </nav>
    </header>
  );
}
