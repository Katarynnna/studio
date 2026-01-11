'use client';

import type { TrailAngel } from '@/lib/types';
import { ALL_SERVICES } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import {
  Users,
  GalleryHorizontal,
  BadgeInfo,
  Calendar as CalendarIcon,
  Star,
  Clock,
  MessageCircle,
  Footprints,
  Twitter,
  Instagram,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import SendMessageDialog from './send-message-dialog';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import StaticCalendar from './static-calendar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { COUNTRIES } from '@/app/profile/edit/page';
import { useUserProfileStore } from '@/lib/user-profile-store';

type ProfileData = Partial<TrailAngel> & {
    trailName?: string;
    avatar?: string;
    contact?: any;
    address?: any;
    bedCount?: number;
    status?: string;
};

type ProfileSheetProps = {
  profile: ProfileData | null;
  isCurrentUser?: boolean;
  onOpenChange: (open: boolean) => void;
};


function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 pt-2">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-2 h-2 ${
            i < rating ? 'text-accent fill-accent' : 'text-muted-foreground'
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
                         <div className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-lg"></div>
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </div>
    )
}


export default function ProfileSheet({ profile, isCurrentUser = false, onOpenChange }: ProfileSheetProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const userProfile = useUserProfileStore();

  const sourceProfile = isCurrentUser ? userProfile : profile;
  
  if (!sourceProfile) return null;

  // *** UNIFIED PROFILE DATA STRUCTURE ***
  const displayProfile = {
    id: isCurrentUser ? 'user-wired' : (sourceProfile as TrailAngel).id,
    name: isCurrentUser ? userProfile.trailName : (sourceProfile as TrailAngel).name,
    avatar: isCurrentUser ? userProfile.avatar : (sourceProfile as TrailAngel).gallery?.[0],
    location: isCurrentUser 
      ? [userProfile.address.city, userProfile.address.state, COUNTRIES.find(c => c.value === userProfile.address.country)?.label || userProfile.address.country].filter(Boolean).join(', ')
      : (sourceProfile as TrailAngel).location,
    status: isCurrentUser ? userProfile.status : ((sourceProfile as TrailAngel).hiking ? 'hiking' : ''),
    lastActivity: sourceProfile.lastActivity,
    responseRate: sourceProfile.responseRate,
    badges: isCurrentUser 
      ? userProfile.badges 
      : (typeof sourceProfile.badges === 'string' ? sourceProfile.badges.split(',').map(b => b.trim()).filter(Boolean) : []),
    socials: sourceProfile.socials,
    about: sourceProfile.about,
    verified: sourceProfile.verified,
    donationExpected: !isCurrentUser && (sourceProfile as TrailAngel).donationExpected,
    services: sourceProfile.services || [],
    bedCount: isCurrentUser ? userProfile.bedCount : undefined,
    position: sourceProfile.position,
    gallery: isCurrentUser ? userProfile.gallery : (sourceProfile.gallery || []).map((g, i) => ({ imageUrl: g, description: `Gallery image ${i+1}`, imageHint: ''})),
    availability: sourceProfile.availability || [],
    reviews: sourceProfile.reviews || [],
  };
  
  const profileServices = ALL_SERVICES.filter((s) => displayProfile.services.includes(s.id));

  return (
    <Sheet open={!!profile} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={displayProfile.avatar} alt={displayProfile.name} />
                    <AvatarFallback>{displayProfile.name ? displayProfile.name.charAt(0) : 'P'}</AvatarFallback>
                </Avatar>
                <div className="space-y-1.5 flex-1">
                    <SheetTitle className="text-3xl font-headline flex items-center gap-2">
                      {displayProfile.name}
                      {displayProfile.verified && <CheckCircle2 className="w-6 h-6 text-primary" title="Verified Angel" />}
                    </SheetTitle>
                    <SheetDescription>{displayProfile.location}</SheetDescription>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-muted-foreground">
                        {displayProfile.lastActivity && <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Last active: {displayProfile.lastActivity}</span>
                        </div>}
                        {displayProfile.responseRate && <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{displayProfile.responseRate}% response rate</span>
                        </div>}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {displayProfile.badges.map((badge) => (
                            <Badge key={badge} variant="secondary">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                    {displayProfile.status === 'hiking' && <Badge variant="outline" className="border-primary text-primary"><Footprints className="w-3 h-3 mr-1" /> Currently Hiking</Badge>}
                </div>
                <div className="flex gap-2 self-start sm:self-center">
                    {displayProfile.socials?.twitter && (
                    <Link href={`https://twitter.com/${displayProfile.socials.twitter}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                        <Twitter className="h-4 w-4" />
                        </Button>
                    </Link>
                    )}
                    {displayProfile.socials?.instagram && (
                    <Link href={`https://instagram.com/${displayProfile.socials.instagram}`} target="_blank" rel="noopener noreferrer">
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about"><BadgeInfo className="w-4 h-4 mr-1 hidden sm:inline-flex" />About</TabsTrigger>
              <TabsTrigger value="availability"><CalendarIcon className="w-4 h-4 mr-1 hidden sm:inline-flex" />Calendar</TabsTrigger>
              <TabsTrigger value="gallery"><GalleryHorizontal className="w-4 h-4 mr-1 hidden sm:inline-flex" />Gallery</TabsTrigger>
              <TabsTrigger value="reviews"><Users className="w-4 h-4 mr-1 hidden sm:inline-flex" />Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <p className="text-muted-foreground mb-4">{displayProfile.about}</p>
              
              <div className="flex items-center gap-2 my-4">
                <h4 className="font-semibold">{isCurrentUser ? "Services I Can Offer" : "Services Offered"}</h4>
                {displayProfile.donationExpected && <Badge variant="destructive">Donation Expected</Badge>}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {profileServices.map((service) => (
                  <div key={service.id} className="flex items-center gap-3">
                    <service.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{service.name} {isCurrentUser && service.id === 'beds' && displayProfile.bedCount && displayProfile.bedCount > 0 ? `(${displayProfile.bedCount})` : ''}</span>
                  </div>
                ))}
              </div>
              
              {displayProfile.position && (
                  <>
                    <h4 className="font-semibold mt-6 mb-2">Location</h4>
                    <ProfileMap position={displayProfile.position} />
                  </>
              )}

              {isCurrentUser ? (
                 <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                </Button>
              ) : (
                <SendMessageDialog angel={profile as TrailAngel} open={dialogOpen} onOpenChange={setDialogOpen}>
                    <Button className="w-full mt-6">
                        Message
                    </Button>
                </SendMessageDialog>
              )}

            </TabsContent>
            
            <TabsContent value="availability" className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Highlighted dates show when {displayProfile.name} is available.</p>
              <div className="flex justify-center rounded-md border p-4">
                <StaticCalendar availableDates={displayProfile.availability} />
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              {displayProfile.gallery.length === 0 ? (
                 <div className="text-center text-muted-foreground py-12">
                    <p>No photos yet. Add some from the edit profile page!</p>
                 </div>
              ) : (
                <Carousel className="w-full">
                    <CarouselContent>
                    {displayProfile.gallery.map((img, index) => (
                        <CarouselItem key={isCurrentUser ? (img as any).id : index}>
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
              {displayProfile.reviews.map((review) => (
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
