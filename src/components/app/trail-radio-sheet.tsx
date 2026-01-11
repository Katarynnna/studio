
"use client";

import type { TrailAngel } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import TrailRadio from "./trail-radio";
import { useState } from "react";
import ProfileSheet from "./profile-sheet";
import { TRAIL_ANGELS } from "@/lib/data";
import { Radio, X } from "lucide-react";
import { Separator } from "../ui/separator";

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
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-headline flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Radio className="w-8 h-8" />
                                Trail Radio
                            </span>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="-mx-6"><Separator className="my-6"/></div>
                    <TrailRadio onSelectAngel={handleAuthorClick} isSheet={true} />
                </SheetContent>
            </Sheet>
            <ProfileSheet profile={selectedAngel} onOpenChange={handleSheetOpenChange} />
        </>
    );
}
