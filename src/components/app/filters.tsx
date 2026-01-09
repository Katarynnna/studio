"use client";

import type { Service } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type FilterState = {
  name: string;
  location: string;
  services: string[];
};

type FiltersProps = {
  services: Service[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
};

export default function Filters({ services, filters, onFilterChange }: FiltersProps) {
  const isMobile = useIsMobile();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const newServices = checked
      ? [...filters.services, serviceId]
      : filters.services.filter((id) => id !== serviceId);
    onFilterChange({ ...filters, services: newServices });
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
              <div key={service.id} className="flex items-center gap-2">
                <Checkbox
                  id={`service-${service.id}`}
                  checked={filters.services.includes(service.id)}
                  onCheckedChange={(checked) => handleServiceChange(service.id, !!checked)}
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6" />
          <span>Filter Angels</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
          {content}
      </CardContent>
    </Card>
  );
}
