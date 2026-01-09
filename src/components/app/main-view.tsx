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
        <TrailAngelMap
          angels={filteredAngels}
          onSelectAngel={handleSelectAngel}
        />
      </div>
      <TrailAngelSheet
        angel={selectedAngel}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
}
