
"use client";

import type { Service } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import React from 'react';

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
};

// Internal component to prevent re-renders of the entire filter list
const ServiceCheckbox = React.memo(({ service, isChecked, onToggle }: { service: Service, isChecked: boolean, onToggle: (id: string, checked: boolean) => void }) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`service-${service.id}`}
        checked={isChecked}
        onCheckedChange={(checked) => onToggle(service.id, !!checked)}
      />
      <Label htmlFor={`service-${service.id}`} className="font-normal">{service.name}</Label>
    </div>
  );
});
ServiceCheckbox.displayName = 'ServiceCheckbox';


export default function Filters({ services, filters, setFilters, viewToggle }: FiltersProps) {
  const isMobile = useIsMobile();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleServiceToggle = (serviceId: string, isChecked: boolean) => {
    setFilters(prev => {
        const newServices = isChecked
        ? [...prev.services, serviceId]
        : prev.services.filter((id) => id !== serviceId);
        return { ...prev, services: newServices };
    });
  };
  
  const content = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name-filter">Name</Label>
            <Input
              id="name-filter"
              name="name"
              placeholder="e.g. Bighorn Betty"
              value={filters.name}
              onChange={handleTextChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-filter">Location</Label>
            <Input
              id="location-filter"
              name="location"
              placeholder="e.g. Wrightwood, CA"
              value={filters.location}
              onChange={handleTextChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Services Offered</Label>
          <div className="grid grid-cols-2 gap-2">
            {services.map((service) => (
               <ServiceCheckbox 
                key={service.id}
                service={service}
                isChecked={filters.services.includes(service.id)}
                onToggle={handleServiceToggle}
              />
            ))}
          </div>
        </div>
      </div>
  )

  if (isMobile) {
      return content;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-6 h-6" />
          <span>Filter Angels</span>
        </CardTitle>
        {viewToggle}
      </CardHeader>
      <CardContent>
          {content}
      </CardContent>
    </Card>
  );
}
