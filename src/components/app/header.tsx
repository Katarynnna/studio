import { MountainSnow, User, Mail, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b shrink-0">
      <div className="flex items-center gap-2">
        <MountainSnow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Trail Angel Hub
        </h1>
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="ghost" className="hidden md:flex">
          <Compass />
          <span>Explore</span>
        </Button>
        <Button variant="ghost" className="hidden md:flex">
          <Mail />
          <span>Inbox</span>
        </Button>
        <Button variant="ghost" className="hidden md:flex">
          <User />
          <span>My Account</span>
        </Button>
      </nav>
    </header>
  );
}
