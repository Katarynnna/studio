
"use client";

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, getDate, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type StaticCalendarProps = {
  availableDates: Date[];
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StaticCalendar({ availableDates }: StaticCalendarProps) {
  const [currentDate, setCurrentDate] = useState(availableDates[0] || new Date());

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start, end });

  const startingDayIndex = getDay(start);

  const availableDatesSet = useMemo(() => 
    new Set(availableDates.map(d => d.toDateString())),
    [availableDates]
  );
  
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold font-headline">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground">
        {WEEKDAYS.map(day => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map(day => {
          const isAvailable = availableDatesSet.has(day.toDateString());
          return (
            <div
              key={day.toString()}
              className={cn(
                "w-full aspect-square flex items-center justify-center rounded-md text-sm",
                isAvailable ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground/50"
              )}
            >
              {getDate(day)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
