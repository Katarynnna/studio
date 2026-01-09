

"use client";

import type { TrailAngel } from "@/lib/types";
import { ALL_SERVICES } from "@/lib/data";
import Image from 'next/image';
import Link from 'next/link';
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Users,
  GalleryHorizontal,
  BadgeInfo,
  Calendar as CalendarIcon,
  Star,
  CheckCircle2,
  Clock,
  MessageCircle,
  Footprints,
  Twitter,
  Instagram,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SendMessageDialog from "./send-message-dialog";
import { useState } from "react";

type TrailAngelSheetProps = {
  angel: TrailAngel | null;
  onOpenChange: (open: boolean) => void;
  addMessageToInbox?: (angel: TrailAngel, message: string) => void;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 pt-2">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-2 h-2 ${
            i < rating ? "text-accent fill-accent" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function TrailAngelSheet({ angel, onOpenChange, addMessageToInbox }: TrailAngelSheetProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  if (!angel) return null;

  const services = ALL_SERVICES.filter((s) => angel.services.includes(s.id));
  const galleryImages = PlaceHolderImages.slice(0, angel.gallery.length);

  return (
    <Sheet open={!!angel} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="space-y-2 text-left">
              <div className="flex items-center gap-4">
                 <Avatar className="w-20 h-20">
                  <AvatarImage src={angel.gallery[0]} alt={angel.name} />
                  <AvatarFallback>{angel.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                    {angel.name}
                    {angel.verified && <CheckCircle2 className="w-6 h-6 text-blue-500" title="Verified Angel" />}
                  </SheetTitle>
                  <SheetDescription>{angel.location}</SheetDescription>
                   {angel.hiking && <Badge variant="outline" className="border-blue-500 text-blue-500"><Footprints className="w-3 h-3 mr-1" /> Currently Hiking</Badge>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Last active: {angel.lastActivity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{angel.responseRate}% response rate</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {angel.badges.map((badge) => (
                        <Badge key={badge} variant="secondary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                <div className="flex gap-2 self-start sm:self-center">
                  {angel.socials?.twitter && (
                    <Link href={`https://twitter.com/${angel.socials.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  {angel.socials?.instagram && (
                    <Link href={`https://instagram.com/${angel.socials.instagram}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetHeader>
            
            <Separator className="my-6" />
            
            <Tabs defaultValue="about" className="mt-6">
              <TabsList className="grid w-full grid-cols-4 h-auto sm:h-10 text-xs p-1">
                <TabsTrigger value="about" className="p-1 text-xs sm:text-sm"><BadgeInfo className="w-4 h-4 mr-1 hidden sm:inline-flex" />About</TabsTrigger>
                <TabsTrigger value="availability" className="p-1 text-xs sm:text-sm"><CalendarIcon className="w-4 h-4 mr-1 hidden sm:inline-flex" />Calendar</TabsTrigger>
                <TabsTrigger value="gallery" className="p-1 text-xs sm:text-sm"><GalleryHorizontal className="w-4 h-4 mr-1 hidden sm:inline-flex" />Gallery</TabsTrigger>
                <TabsTrigger value="reviews" className="p-1 text-xs sm:text-sm"><Users className="w-4 h-4 mr-1 hidden sm:inline-flex" />Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4">
                <p className="text-muted-foreground mb-4">{angel.about}</p>
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-semibold">Services Offered</h4>
                  {angel.donationExpected && <Badge variant="destructive">Donation Expected</Badge>}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center gap-3">
                      <service.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                  ))}
                </div>
                <SendMessageDialog angel={angel} open={dialogOpen} onOpenChange={setDialogOpen} addMessageToInbox={addMessageToInbox}>
                    <Button className="w-full mt-6">
                       Message
                    </Button>
                </SendMessageDialog>

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

              <TabsContent value="reviews" className="mt-4 space-y-6">
                {angel.reviews.map((review) => (
                  <div key={review.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.author}</p>
                        <span className="text-xs text-muted-foreground pt-0.5">{review.date}</span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="text-sm text-muted-foreground pt-2">{review.comment}</p>
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
