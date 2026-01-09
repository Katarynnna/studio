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
import TrailAngelList from "./trail-angel-list";

const initialFilters: FilterState = {
  name: "",
  location: "",
  services: [],
};

type MainViewProps = {
  setProfileOpen?: (open: boolean) => void;
};

export default function MainView({ setProfileOpen }: MainViewProps) {
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
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-96 md:max-w-sm shrink-0">
        <ScrollArea className="h-full md:max-h-screen">
          <Card className="border-0 border-b md:border-b-0 md:border-r rounded-none">
            <div className="p-4 space-y-6">
              <Filters
                services={ALL_SERVICES}
                filters={filters}
                onFilterChange={setFilters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              <TrailRadio onSelectAngel={handleSelectAngel} setProfileOpen={setProfileOpen} />
            </div>
          </Card>
        </ScrollArea>
      </div>
      <div className="flex-1 relative h-96 md:h-full">
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
