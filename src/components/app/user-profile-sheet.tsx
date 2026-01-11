

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useUserProfileStore } from '@/lib/user-profile-store';
import { ALL_SERVICES } from "@/lib/data";

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
import { COUNTRIES } from '@/app/profile/edit/page';

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
  const userProfile = useUserProfileStore((state) => state);
  const userServices = ALL_SERVICES.filter(s => userProfile.services.includes(s.id));
  const countryName = COUNTRIES.find(c => c.value === userProfile.address.country)?.label || userProfile.address.country;
  const userLocation = [userProfile.address.city, userProfile.address.state, countryName].filter(Boolean).join(', ');


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                <AvatarImage src={userProfile.avatar} alt={userProfile.trailName} />
                <AvatarFallback>{userProfile.trailName ? userProfile.trailName.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                      {userProfile.trailName || 'Trail Name'}
                    </SheetTitle>
                    <SheetDescription>{userLocation || userProfile.description}</SheetDescription>
                  </div>
                </div>
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
                  {userProfile.status === 'hiking' && <Badge variant="outline" className="border-primary text-primary"><Footprints className="w-3 h-3 mr-1" /> Currently Hiking</Badge>}
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
        <div className='-mx-6'><Separator className="my-6" /></div>
        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about"><BadgeInfo className="w-4 h-4 mr-1" />About</TabsTrigger>
            <TabsTrigger value="gallery"><GalleryHorizontal className="w-4 h-4 mr-1" />Gallery</TabsTrigger>
            <TabsTrigger value="reviews"><Users className="w-4 h-4 mr-1" />Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-4">
            <p className="text-muted-foreground mb-4">{userProfile.about}</p>
            
            {userServices.length > 0 && (
              <>
                <h4 className="font-semibold mb-4">Services I Can Offer</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-4">
                  {userServices.map((service) => (
                    <div key={service.id} className="flex items-center gap-3">
                      <service.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground">{service.name} {service.id === 'beds' && userProfile.bedCount > 0 && `(${userProfile.bedCount})`}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(userProfile.address.city || userProfile.address.state) && (
              <>
                <h4 className="font-semibold mt-6 mb-2">My Location</h4>
                <p className="text-sm text-muted-foreground">{userLocation}</p>
                <ProfileMap position={userProfile.position} />
              </>
            )}
            
            <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
             {userProfile.gallery.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>No photos yet. Add some from the edit profile page!</p>
              </div>
            ) : (
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
            )}
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
      </SheetContent>
    </Sheet>
  );
}
