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
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Filter, List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredAngels = useMemo(() => {
    return TRAIL_ANGELS.filter((angel) => {
      if (
        filters.name &&
        !angel.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.location &&
        !angel.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
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

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (isMobile) {
        // Optional: close dialog on applying filters, or have an "Apply" button
        // setFilterDialogOpen(false);
    }
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className="h-full relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
           <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="secondary" className="shadow-lg">
                <Filter />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><SlidersHorizontal /> Filters</DialogTitle>
              </DialogHeader>
              <Filters
                services={ALL_SERVICES}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </DialogContent>
          </Dialog>
           <div className="flex items-center gap-2 p-2 rounded-full bg-secondary shadow-lg">
              <MapIcon size={16} />
              <Switch
                  id="view-mode-switch-mobile"
                  checked={viewMode === "list"}
                  onCheckedChange={(checked) => setViewMode(checked ? "list" : "map")}
              />
              <List size={16} />
          </div>
        </div>
        
        {viewMode === 'map' ? (
          <TrailAngelMap angels={filteredAngels} onSelectAngel={handleSelectAngel} />
        ) : (
          <TrailAngelList angels={filteredAngels} onSelectAngel={handleSelectAngel} />
        )}
        
        <TrailAngelSheet angel={selectedAngel} onOpenChange={handleSheetOpenChange} />
      </div>
    );
  }

  // Desktop View
  return (
    <div className="flex flex-row h-full">
      <div className="w-96 max-w-sm shrink-0">
        <ScrollArea className="h-full max-h-screen">
          <Card className="border-0 border-b md:border-b-0 md:border-r rounded-none">
            <div className="p-4 space-y-6">
              <Filters
                services={ALL_SERVICES}
                filters={filters}
                onFilterChange={setFilters}
              />
               <div className="flex items-center justify-center gap-2 p-1 rounded-full bg-secondary">
                  <Label htmlFor="view-mode-switch-desktop" className="pl-2 flex items-center gap-1 text-sm"><MapIcon size={16} /> Map</Label>
                  <Switch
                      id="view-mode-switch-desktop"
                      checked={viewMode === "list"}
                      onCheckedChange={(checked) => setViewMode(checked ? "list" : "map")}
                  />
                  <Label htmlFor="view-mode-switch-desktop" className="pr-2 flex items-center gap-1 text-sm"><List size={16} /> List</Label>
              </div>
              <TrailRadio onSelectAngel={handleSelectAngel} setProfileOpen={setProfileOpen} />
            </div>
          </Card>
        </ScrollArea>
      </div>
      <div className="flex-1 relative h-full">
        {viewMode === 'map' ? (
          <TrailAngelMap angels={filteredAngels} onSelectAngel={handleSelectAngel} />
        ) : (
          <TrailAngelList angels={filteredAngels} onSelectAngel={handleSelectAngel} />
        )}
      </div>
      <TrailAngelSheet angel={selectedAngel} onOpenChange={handleSheetOpenChange} />
    </div>
  );
}
