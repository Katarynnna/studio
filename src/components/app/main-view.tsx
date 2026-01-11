

"use client";

import { useState, useMemo, useEffect } from "react";
import type { TrailAngel } from "@/lib/types";
import { TRAIL_ANGELS, ALL_SERVICES } from "@/lib/data";
import Filters, { type FilterState } from "./filters";
import TrailRadio from "./trail-radio";
import TrailAngelMap from "./trail-angel-map";
import ProfileSheet from "./profile-sheet";
import TrailAngelList from "./trail-angel-list";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Filter, List, Map as MapIcon, X, Frown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const initialFilters: FilterState = {
  name: "",
  location: "",
  services: [],
};

const FunnelX = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3h18v5l-7 7v6l-4-3v-3l-7-7z" />
    <path d="m15 3-6 6" />
  </svg>
);


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
  
  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = filters.name !== '' || filters.location !== '' || filters.services.length > 0;
  
  const clearFilterButton = (
    <Button variant="ghost" size="icon" onClick={clearFilters} disabled={!hasActiveFilters} className="h-9 w-9 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 disabled:bg-muted disabled:text-muted-foreground">
        <FunnelX className="w-5 h-5" />
        <span className="sr-only">Clear filters</span>
    </Button>
  );

  const viewToggle = (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0 p-1 rounded-full bg-secondary shadow-inner">
        <Button onClick={() => setViewMode('map')} size="sm" variant={viewMode === 'map' ? 'default' : 'ghost'} className={cn("rounded-full h-8 w-8 p-2", viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
          <MapIcon size={16} />
        </Button>
        <Button onClick={() => setViewMode('list')} size="sm" variant={viewMode === 'list' ? 'default' : 'ghost'} className={cn("rounded-full h-8 w-8 p-2", viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
          <List size={16} />
        </Button>
      </div>
    </div>
  );

  if (!isClient) {
    return null; // Render nothing on the server
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className={cn("h-full relative", viewMode === 'map' ? 'overflow-hidden' : 'overflow-y-auto')}>
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
           <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="default" className="rounded-full shadow-lg">
                <Filter />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Filter /> Filter</span>
                     <Button variant="ghost" size="icon" onClick={() => { clearFilters(); setFilterDialogOpen(false);}} className="h-8 w-8">
                        <FunnelX className="w-4 h-4 text-green-600" />
                        <span className="sr-only">Clear filters</span>
                    </Button>
                </DialogTitle>
              </DialogHeader>
              <Filters
                services={ALL_SERVICES}
                filters={filters}
                setFilters={setFilters}
              />
            </DialogContent>
          </Dialog>
           {clearFilterButton}
        </div>
        <div className="absolute top-4 right-4 z-10">
            {viewToggle}
        </div>
        
        <div className="h-full w-full">
            {viewMode === 'map' ? (
            <TrailAngelMap angels={filteredAngels} onSelectAngel={handleSelectAngel} />
            ) : (
            <div className="pt-16">
               {filteredAngels.length > 0 ? (
                <TrailAngelList angels={filteredAngels} onSelectAngel={handleSelectAngel} />
              ) : (
                <div className="text-center pt-20 text-muted-foreground">
                  <Frown className="w-12 h-12 mx-auto mb-2" />
                  <p>No trail angels match your filters.</p>
                </div>
              )}
            </div>
            )}
        </div>
        
        <ProfileSheet profile={selectedAngel} onOpenChange={handleSheetOpenChange} />
      </div>
    );
  }

  // Desktop View
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_384px]">
      <div className="flex-1">
        {viewMode === 'map' ? (
          <TrailAngelMap angels={filteredAngels} onSelectAngel={handleSelectAngel} />
        ) : (
           <div className="h-full overflow-y-auto">
            {filteredAngels.length > 0 ? (
              <TrailAngelList angels={filteredAngels} onSelectAngel={handleSelectAngel} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                 <Frown className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">No trail angels match your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-96 max-w-sm shrink-0 border-l bg-background">
        <div className="p-4 space-y-4">
          <Filters
            services={ALL_SERVICES}
            filters={filters}
            setFilters={setFilters}
            viewToggle={viewToggle}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
          />
          <TrailRadio onSelectAngel={handleSelectAngel} setProfileOpen={setProfileOpen} />
        </div>
      </div>
      <ProfileSheet profile={selectedAngel} onOpenChange={handleSheetOpenChange} />
    </div>
  );
}
