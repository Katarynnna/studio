

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
  CheckCircle2,
  Linkedin,
  Youtube,
  Link as LinkIcon,
} from 'lucide-react';
import SendMessageDialog from './send-message-dialog';
import { useState } from 'react';
import StaticCalendar from './static-calendar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { COUNTRIES } from '@/app/profile/edit/page';
import { useUserProfileStore } from '@/lib/user-profile-store';
import ProfileMap from './profile-map';


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

// Mockup for icons not in lucide-react
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 0-8 8"></path></svg>
);


export default function ProfileSheet({ profile, isCurrentUser = false, onOpenChange }: ProfileSheetProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const userProfile = useUserProfileStore();

  const sourceProfile = isCurrentUser ? userProfile : profile;
  
  if (!sourceProfile) return null;

  const displayProfile = {
    id: isCurrentUser ? 'user-wired' : (sourceProfile as TrailAngel).id,
    name: isCurrentUser ? userProfile.trailName : (sourceProfile as TrailAngel).name,
    avatar: isCurrentUser ? userProfile.avatar : (sourceProfile as TrailAngel).gallery?.[0],
    location: isCurrentUser 
      ? [userProfile.address.city, userProfile.address.state, COUNTRIES.find(c => c.value === userProfile.address.country)?.label || userProfile.address.country].filter(Boolean).join(', ')
      : (sourceProfile as TrailAngel).location,
    status: isCurrentUser ? userProfile.status : ((sourceProfile as TrailAngel).hiking ? 'hiking' : 'available'),
    lastActivity: sourceProfile.lastActivity,
    responseRate: sourceProfile.responseRate,
    badges: isCurrentUser 
      ? userProfile.badges 
      : (typeof sourceProfile.badges === 'string' ? sourceProfile.badges.split(',').map(b => b.trim()).filter(Boolean) : []),
    socials: sourceProfile.socials || {},
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
  const hasServices = profileServices.length > 0;
  const showCalendar = hasServices && displayProfile.availability.length > 0;

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
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs text-muted-foreground pt-4">
                {displayProfile.lastActivity && <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Last active: {displayProfile.lastActivity}</span>
                </div>}
                {displayProfile.responseRate && <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{displayProfile.responseRate}% response rate</span>
                </div>}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-4">
                <div className="flex-1 space-y-2">
                    {displayProfile.status === 'hiking' && <Badge variant="outline" className="border-primary text-primary"><Footprints className="w-3 h-3 mr-1" /> Currently Hiking</Badge>}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {displayProfile.badges.map((badge) => (
                            <Badge key={badge} variant="secondary">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
          </SheetHeader>
          
          <div className='-mx-6'><Separator className="my-6" /></div>
          
          <Tabs defaultValue="about">
            <TabsList className={`grid w-full grid-cols-${showCalendar ? '4' : '3'}`}>
              <TabsTrigger value="about"><BadgeInfo className="w-4 h-4 mr-1 hidden sm:inline-flex" />About</TabsTrigger>
              {showCalendar && <TabsTrigger value="availability"><CalendarIcon className="w-4 h-4 mr-1 hidden sm:inline-flex" />Calendar</TabsTrigger>}
              <TabsTrigger value="gallery"><GalleryHorizontal className="w-4 h-4 mr-1 hidden sm:inline-flex" />Gallery</TabsTrigger>
              <TabsTrigger value="reviews"><Users className="w-4 h-4 mr-1 hidden sm:inline-flex" />Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <p className="text-muted-foreground mb-4">{displayProfile.about}</p>
              
               {Object.values(displayProfile.socials).some(s => !!s) && (
                <>
                <h4 className="font-semibold">Socials & Links</h4>
                <div className="grid grid-cols-2 gap-2 my-4 text-sm">
                    {displayProfile.socials.instagram && <Link href={`https://instagram.com/${displayProfile.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Instagram className="w-4 h-4" /> Instagram</Link>}
                    {displayProfile.socials.twitter && <Link href={`https://twitter.com/${displayProfile.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Twitter className="w-4 h-4" /> Twitter / X</Link>}
                    {displayProfile.socials.facebook && <Link href={displayProfile.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><FacebookIcon /> Facebook</Link>}
                    {displayProfile.socials.tiktok && <Link href={`https://tiktok.com/@${displayProfile.socials.tiktok}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><TikTokIcon /> TikTok</Link>}
                    {displayProfile.socials.youtube && <Link href={displayProfile.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Youtube className="w-4 h-4" /> YouTube</Link>}
                    {displayProfile.socials.linkedin && <Link href={displayProfile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Linkedin className="w-4 h-4" /> LinkedIn</Link>}
                    {displayProfile.socials.website && <Link href={displayProfile.socials.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><LinkIcon className="w-4 h-4" /> Website</Link>}
                </div>
                </>
              )}
              
              {hasServices && (
                <>
                  <div className="flex items-center gap-2 my-4">
                    <h4 className="font-semibold">{isCurrentUser ? 'Services I Can Offer' : 'Services Offered'}</h4>
                    {displayProfile.donationExpected && <Badge variant="destructive">Donation Expected</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-4">
                    {profileServices.map((service) => (
                      <div key={service.id} className="flex items-center gap-2">
                        <service.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">{service.name} {isCurrentUser && service.id === 'beds' && displayProfile.bedCount && displayProfile.bedCount > 0 ? `(${displayProfile.bedCount})` : ''}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {displayProfile.position && (
                  <>
                    <h4 className="font-semibold mt-6">My Location</h4>
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
            
            {showCalendar && (
                <TabsContent value="availability" className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Highlighted dates show when {displayProfile.name} is available.</p>
                <div className="flex justify-center rounded-md border p-4">
                    <StaticCalendar availableDates={displayProfile.availability} />
                </div>
                </TabsContent>
            )}

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
