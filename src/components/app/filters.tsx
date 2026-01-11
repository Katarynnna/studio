
"use client";

import type { Service } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import React from 'react';
import { Button } from "../ui/button";


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


export type FilterState = {
  name: string;
  location: string;
  services: string[];
};

type FiltersProps = {
  services: Service[];
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  viewToggle?: ReactNode;
  hasActiveFilters?: boolean;
  clearFilters: () => void;
};

export default function Filters({ services, filters, setFilters, viewToggle, hasActiveFilters, clearFilters }: FiltersProps) {
  const isMobile = useIsMobile();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFilters(prev => {
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: newServices };
    });
  };

  const content = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            placeholder="Name"
            value={filters.name}
            onChange={handleTextChange}
          />
          <Input
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleTextChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Services Offered</Label>
          <div className="grid grid-cols-2 gap-2">
            {services.map((service) => (
                <div key={service.id} className="flex items-center gap-2">
                    <Checkbox
                        id={`service-${service.id}`}
                        checked={filters.services.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <Label htmlFor={`service-${service.id}`} className="font-normal">{service.name}</Label>
                </div>
            ))}
          </div>
        </div>
      </div>
  )

  if (isMobile) {
      return content;
  }
  
  const clearFilterButton = (
    <Button variant="ghost" size="icon" onClick={clearFilters} disabled={!hasActiveFilters} className="h-9 w-9 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 disabled:bg-muted disabled:text-muted-foreground">
        <FunnelX className="w-5 h-5" />
        <span className="sr-only">Clear filters</span>
    </Button>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-6 h-6" />
              <span>Filter</span>
            </CardTitle>
        </div>
        <div className="flex items-center gap-2">
            {viewToggle}
            {clearFilterButton}
        </div>
      </CardHeader>
      <CardContent className="relative">
          {content}
      </CardContent>
    </Card>
  );
}
