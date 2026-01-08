"use client";

import type { Service } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter } from "lucide-react";

export type FilterState = {
  name: string;
  services: string[];
  donationExpected: "any" | "yes" | "no";
};

type FiltersProps = {
  services: Service[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
};

export default function Filters({ services, filters, onFilterChange }: FiltersProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, name: e.target.value });
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const newServices = checked
      ? [...filters.services, serviceId]
      : filters.services.filter((id) => id !== serviceId);
    onFilterChange({ ...filters, services: newServices });
  };
  
  const handleDonationChange = (value: "any" | "yes" | "no") => {
    onFilterChange({ ...filters, donationExpected: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-6 h-6" />
          <span>Filter Angels</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name-filter">Name</Label>
          <Input
            id="name-filter"
            placeholder="e.g. Bighorn Betty"
            value={filters.name}
            onChange={handleNameChange}
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
                  onCheckedChange={(checked) => handleServiceChange(service.id, !!checked)}
                />
                <Label htmlFor={`service-${service.id}`} className="font-normal">{service.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Donation Expected</Label>
          <RadioGroup 
            value={filters.donationExpected} 
            onValueChange={handleDonationChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="donation-any" />
              <Label htmlFor="donation-any" className="font-normal">Any</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="donation-yes" />
              <Label htmlFor="donation-yes" className="font-normal">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="donation-no" />
              <Label htmlFor="donation-no" className="font-normal">No</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
