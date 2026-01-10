

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

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
  Twitter,
  Instagram,
  Terminal,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

export const userProfile = {
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
  ],
  socials: {
    twitter: 'wiredhiker',
    instagram: 'wiredpct24',
  },
  position: { lat: 34.2, lng: -117.8 }
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

const MissingApiKey = () => (
    <Alert variant="destructive" className="my-4">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Google Maps API Key is Missing</AlertTitle>
      <AlertDescription>
        To display the map, please add your Google Maps API key to your environment variables.
      </AlertDescription>
    </Alert>
);


const ProfileMap = ({ position }: { position: { lat: number; lng: number }}) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return <MissingApiKey />;

    return (
        <div className='aspect-video w-full rounded-lg overflow-hidden my-4 border'>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={position}
                    defaultZoom={9}
                    mapId="profile_map"
                    disableDefaultUI={true}
                    gestureHandling="none"
                >
                    <AdvancedMarker position={position}>
                         <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </div>
    )
}

type UserProfileSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserProfileSheet({ open, onOpenChange }: UserProfileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <div className="relative flex-1 overflow-y-auto p-6">
          <SheetHeader className="p-0 space-y-2 text-left">
            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                      {userProfile.name}
                    </SheetTitle>
                    <SheetDescription>{userProfile.description}</SheetDescription>
                  </div>
                </div>
                  {userProfile.hiking && <Badge variant="outline" className="border-blue-500 text-blue-500"><Footprints className="w-3 h-3 mr-1" /> Currently Hiking</Badge>}
              </div>
            </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Last active: {userProfile.lastActivity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{userProfile.responseRate}% response rate</span>
                      </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {userProfile.badges.map((badge) => (
                      <Badge key={badge} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              <div className="flex gap-2 self-start sm:self-center">
                {userProfile.socials?.twitter && (
                  <Link href={`https://twitter.com/${userProfile.socials.twitter}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {userProfile.socials?.instagram && (
                  <Link href={`https://instagram.com/${userProfile.socials.instagram}`} target="_blank" rel="noopener noreferrer">
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about"><BadgeInfo className="w-4 h-4 mr-1" />About</TabsTrigger>
              <TabsTrigger value="gallery"><GalleryHorizontal className="w-4 h-4 mr-1" />Gallery</TabsTrigger>
              <TabsTrigger value="reviews"><Users className="w-4 h-4 mr-1" />Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <p className="text-muted-foreground mb-4">{userProfile.about}</p>
                <h4 className="font-semibold mb-2">My Location</h4>
              <ProfileMap position={userProfile.position} />
              <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
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

            <TabsContent value="reviews" className="mt-4 space-y-6">
              <h3 className="font-semibold text-lg">Reviews from Trail Angels</h3>
              {userProfile.reviews.map((review) => (
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
      </SheetContent>
    </Sheet>
  );
}
