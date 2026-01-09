"use client";

import { useState, useMemo, useEffect } from "react";
import type { TrailAngel } from "@/lib/types";
import { TRAIL_ANGELS, ALL_SERVICES } from "@/lib/data";
import Filters, { type FilterState } from "./filters";
import TrailRadio from "./trail-radio";
import TrailAngelMap from "./trail-angel-map";
import TrailAngelSheet from "./trail-angel-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import TrailAngelList from "./trail-angel-list";
import { List, Map as MapIcon } from "lucide-react";

const initialFilters: FilterState = {
  name: "",
  location: "",
  services: [],
  donationRequired: false,
};

export default function MainView() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedAngel, setSelectedAngel] = useState<TrailAngel | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredAngels = useMemo(() => {
    return TRAIL_ANGELS.filter((angel) => {
      // Name filter
      if (
        filters.name &&
        !angel.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }
      
      // Location filter
      if (
        filters.location &&
        !angel.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Services filter
      if (filters.services.length > 0) {
        const angelServices = angel.services;
        const hasAllServices = filters.services.every(serviceId => {
          const serviceDef = ALL_SERVICES.find(s => s.id === serviceId);
          if (serviceDef?.associatedServices) {
            return serviceDef.associatedServices.some(as => angelServices.includes(as));
          }
          return angelServices.includes(serviceId);
        });
        if (!hasAllServices) return false;
      }

      // Donation filter
      if (filters.donationRequired) {
        if (!angel.donationExpected) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const handleSelectAngel = (angel: TrailAngel | null) => {
    setSelectedAngel(angel);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedAngel(null);
    }
  };

  if (!isClient) {
    // Render a placeholder on the server and during the initial client render
    return null;
  }

  return (
    <div className="flex h-full">
      <Card className="w-full max-w-sm border-0 border-r rounded-none">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            <div className="flex justify-between items-center pr-2">
              <Label htmlFor="view-mode-switch" className="flex items-center gap-2 text-lg font-semibold">
                {viewMode === "map" ? <MapIcon /> : <List />}
                <span>{viewMode === "map" ? "Map View" : "List View"}</span>
              </Label>
              <Switch
                id="view-mode-switch"
                checked={viewMode === "list"}
                onCheckedChange={(checked) => setViewMode(checked ? "list" : "map")}
              />
            </div>
            <Filters
              services={ALL_SERVICES}
              filters={filters}
              onFilterChange={setFilters}
            />
            <TrailRadio />
          </div>
        </ScrollArea>
      </Card>
      <div className="flex-1 relative">
        {viewMode === 'map' ? (
          <TrailAngelMap
            angels={filteredAngels}
            onSelectAngel={handleSelectAngel}
          />
        ) : (
          <TrailAngelList 
            angels={filteredAngels}
            onSelectAngel={handleSelectAngel}
          />
        )}
      </div>
      <TrailAngelSheet
        angel={selectedAngel}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
}
