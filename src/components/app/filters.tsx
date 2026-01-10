
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

export default function Filters({ services, filters, setFilters, viewToggle }: FiltersProps) {
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
