
"use client";

import type { TrailAngel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Footprints, CheckCircle2 } from "lucide-react";

type TrailAngelListProps = {
  angels: TrailAngel[];
  onSelectAngel: (angel: TrailAngel) => void;
};

export default function TrailAngelList({ angels, onSelectAngel }: TrailAngelListProps) {
  return (
      <div className="p-4 grid gap-4 sm:grid-cols-2 pt-20 md:pt-4">
        {angels.map((angel) => (
          <Card 
            key={angel.id} 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelectAngel(angel)}
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={angel.gallery[0]} alt={angel.name} />
                  <AvatarFallback>{angel.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl font-headline">{angel.name}</span>
                    {angel.verified && <CheckCircle2 className="w-5 h-5 text-blue-500" title="Verified Angel" />}
                  </CardTitle>
                  <CardDescription>{angel.location}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 h-14">{angel.about}</p>
              <div className="flex flex-wrap gap-1 mt-4">
                {angel.hiking && <Badge variant="outline" className="border-blue-500 text-blue-500"><Footprints className="w-3 h-3 mr-1" /> Currently Hiking</Badge>}
                {angel.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
  );
}

