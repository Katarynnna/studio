"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Users,
  GalleryHorizontal,
  BadgeInfo,
  Star,
  Clock,
  MessageCircle,
  Footprints,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const userProfile = {
  name: 'Wired',
  description: "PCT Class of '24",
  avatar: "https://picsum.photos/seed/123/200/200",
  about: "Just a hiker trying to make it from Mexico to Canada. I love meeting new people and sharing trail stories. Always on the lookout for good coffee and a place to charge my power bank.",
  hiking: true,
  badges: ['Thru-Hiker', 'Triple Crowner Aspirant'],
  lastActivity: 'Active now',
  responseRate: 98,
  gallery: PlaceHolderImages.slice(0, 3),
  reviews: [
      { id: 'r-1-1', author: 'Bighorn Betty', rating: 5, comment: 'Wired was a respectful and tidy guest. A joy to host!', date: '2023-05-10' },
      { id: 'r-1-2', author: 'Cascade Dave', rating: 5, comment: 'Great conversation. Left the place cleaner than they found it.', date: '2023-08-02' },
  ]
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

type UserProfileSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserProfileSheet({ open, onOpenChange }: UserProfileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="p-0 space-y-2 text-left">
              <div className="flex items-center gap-4">
                 <Avatar className="w-20 h-20">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-start">
                    <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                      {userProfile.name}
                    </SheetTitle>
                    <Button variant="outline" size="sm">Edit Profile</Button>
                  </div>
                  <SheetDescription>{userProfile.description}</SheetDescription>
                   {userProfile.hiking && <Badge variant="outline" className="border-blue-500 text-blue-500"><Footprints className="w-3 h-3 mr-1" /> Currently Hiking</Badge>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {userProfile.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </SheetHeader>

            <div className="grid grid-cols-2 gap-4 my-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Last active: {userProfile.lastActivity}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>{userProfile.responseRate}% response rate</span>
                </div>
            </div>

            <Separator />
            
            <Tabs defaultValue="about" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about"><BadgeInfo className="w-4 h-4 mr-1" />About</TabsTrigger>
                <TabsTrigger value="gallery"><GalleryHorizontal className="w-4 h-4 mr-1" />Gallery</TabsTrigger>
                <TabsTrigger value="reviews"><Users className="w-4 h-4 mr-1" />Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4">
                <p className="text-muted-foreground mb-4">{userProfile.about}</p>
                 <Button className="w-full mt-6">
                   Message
                </Button>
              </TabsContent>

              <TabsContent value="gallery" className="mt-4">
                <Carousel className="w-full">
                  <CarouselContent>
                    {userProfile.gallery.map((img, index) => (
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
                <h3 className="font-semibold text-lg">Reviews from Trail Angels</h3>
                {userProfile.reviews.map((review) => (
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
