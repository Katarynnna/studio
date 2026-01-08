"use client";

import type { TrailAngel } from "@/lib/types";
import { ALL_SERVICES } from "@/lib/data";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Users,
  GalleryHorizontal,
  BadgeInfo,
  Calendar as CalendarIcon,
  Star,
  Mail,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type TrailAngelSheetProps = {
  angel: TrailAngel | null;
  onOpenChange: (open: boolean) => void;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-accent fill-accent" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function TrailAngelSheet({ angel, onOpenChange }: TrailAngelSheetProps) {
  if (!angel) return null;

  const services = ALL_SERVICES.filter((s) => angel.services.includes(s.id));
  const galleryImages = PlaceHolderImages.slice(0, angel.gallery.length);

  return (
    <Sheet open={!!angel} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="space-y-2 text-left">
              <SheetTitle className="text-3xl font-headline">{angel.name}</SheetTitle>
              <SheetDescription>{angel.location}</SheetDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                {angel.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
                {angel.donationExpected && <Badge variant="destructive">Donation Expected</Badge>}
              </div>
            </SheetHeader>
            <Separator className="my-6" />
            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about"><BadgeInfo className="w-4 h-4 mr-1" />About</TabsTrigger>
                <TabsTrigger value="availability"><CalendarIcon className="w-4 h-4 mr-1" />Calendar</TabsTrigger>
                <TabsTrigger value="gallery"><GalleryHorizontal className="w-4 h-4 mr-1" />Gallery</TabsTrigger>
                <TabsTrigger value="reviews"><Users className="w-4 h-4 mr-1" />Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4">
                <p className="text-muted-foreground mb-4">{angel.about}</p>
                <h4 className="font-semibold mb-2">Services Offered</h4>
                <div className="grid grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center gap-3">
                      <service.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6"><Mail className="w-4 h-4 mr-2" /> Message {angel.name}</Button>
              </TabsContent>
              
              <TabsContent value="availability" className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Highlighted dates show when {angel.name} is available.</p>
                <div className="flex justify-center rounded-md border">
                  <Calendar
                    mode="multiple"
                    selected={angel.availability}
                    defaultMonth={angel.availability[0] || new Date()}
                    className="my-4"
                  />
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-4">
                <Carousel className="w-full">
                  <CarouselContent>
                    {galleryImages.map((img, index) => (
                      <CarouselItem key={index}>
                          <Card>
                            <CardContent className="flex aspect-video items-center justify-center p-0">
                               <Image
                                 src={img.imageUrl}
                                 alt={img.description}
                                 width={600}
                                 height={400}
                                 data-ai-hint={img.imageHint}
                                 className="rounded-lg object-cover"
                               />
                            </CardContent>
                          </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4" />
                  <CarouselNext className="-right-4" />
                </Carousel>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 space-y-4">
                {angel.reviews.map((review) => (
                  <div key={review.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.author}</p>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
