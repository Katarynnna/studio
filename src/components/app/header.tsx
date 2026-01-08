import { MountainSnow } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center h-16 px-4 md:px-6 border-b shrink-0">
      <div className="flex items-center gap-2">
        <MountainSnow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Trail Angel Hub
        </h1>
      </div>
    </header>
  );
}
