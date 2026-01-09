import { MountainSnow, User, Mail, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

type HeaderProps = {
  setProfileOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Header({ setProfileOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <MountainSnow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Trail Angel Hub
        </h1>
      </Link>
      <nav className="flex items-center gap-1">
        <Button variant="ghost" asChild>
          <Link href="/">
            <Compass />
            <span>Explore</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/inbox">
            <Mail />
            <span>Inbox</span>
          </Link>
        </Button>
        <Button variant="ghost" onClick={() => setProfileOpen(true)}>
          <User />
          <span>My Account</span>
        </Button>
      </nav>
    </header>
  );
}
