"use client";

import type { TrailAngel } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TrailRadio from "./trail-radio";
import { useState } from "react";
import TrailAngelSheet from "./trail-angel-sheet";
import { ScrollArea } from "../ui/scroll-area";
import { TRAIL_ANGELS } from "@/lib/data";

type TrailRadioSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TrailRadioSheet({ open, onOpenChange }: TrailRadioSheetProps) {
    const [selectedAngel, setSelectedAngel] = useState<TrailAngel | null>(null);

    const handleSelectAngel = (angel: TrailAngel | null) => {
        setSelectedAngel(angel);
    };

    const handleSheetOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedAngel(null);
        }
    };

    const handleAuthorClick = (authorId: string) => {
        if (authorId.startsWith('ta-')) {
            const angel = TRAIL_ANGELS.find(a => a.id === authorId);
            if (angel) handleSelectAngel(angel);
        }
        // Clicking a user's own profile can be handled inside TrailRadio, or passed up if needed
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-lg p-0" side="left">
                    <ScrollArea className="h-full">
                        <div className="p-4">
                            <TrailRadio onSelectAngel={handleAuthorClick} />
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
            <TrailAngelSheet angel={selectedAngel} onOpenChange={handleSheetOpenChange} />
        </>
    );
}
