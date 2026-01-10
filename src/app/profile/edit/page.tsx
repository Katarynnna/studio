
'use client';

import {
  ArrowLeft,
  Bed,
  Bike,
  Camera,
  Car,
  CookingPot,
  Dog,
  Footprints,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Package,
  Plus,
  ShowerHead,
  Sofa,
  Star,
  Tent,
  Trash2,
  Twitter,
  UploadCloud,
  User,
  WashingMachine,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { userProfile } from '@/components/app/user-profile-sheet';
import AppLayout from '@/components/app/app-layout';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import TrailAngelMap from '@/components/app/trail-angel-map';
import { TRAIL_ANGELS } from '@/lib/data';


export default function EditProfilePage() {
    
  return (
    <AppLayout>
    <div className="bg-background">
      <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <Link href="/" className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4'>
                <ArrowLeft className="w-4 h-4" />
                Back to map
            </Link>
          <h1 className="text-4xl font-bold font-headline">Edit Profile</h1>
          <p className="text-muted-foreground">
            Remember to save your changes at the bottom of the page.
          </p>
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <div>
                        <Label htmlFor="trailName">Trail Name</Label>
                        <Input id="trailName" defaultValue={userProfile.name} />
                    </div>
                    <div>
                        <Label htmlFor="status">Role</Label>
                         <div className="flex items-center gap-2 p-2 border rounded-md bg-secondary text-secondary-foreground">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span>Trail Angel</span>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Your last name" />
                    </div>
                </div>
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                        <Label htmlFor="status">Status</Label>
                        <RadioGroup defaultValue="angel" className="flex items-center gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hiking" id="hiking" />
                            <Label htmlFor="hiking" className="font-normal flex items-center gap-1"><Footprints className="w-4 h-4" /> Hiking</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="angel" id="angel" />
                            <Label htmlFor="angel" className="font-normal flex items-center gap-1"><Star className="w-4 h-4" /> Angeling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="off" id="off" />
                            <Label htmlFor="off" className="font-normal">Off Trail</Label>
                          </div>
                        </RadioGroup>
                    </div>
                    <div className='col-span-2'>
                        <Label>Availability</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !userProfile.availability && "text-muted-foreground"
                                )}
                            >
                                Not set
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

              <div>
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  defaultValue={userProfile.about}
                  placeholder="Tell us a little bit about yourself, your hiking experience, or what you offer as a trail angel."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

           {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>
                Add photos of yourself, your place, or your trail magic. The first image will be your profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center mb-6">
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="font-semibold">Drag & drop or click to add photos</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {userProfile.gallery.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={img.imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="destructive" className="h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                       {index !== 0 && (
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {index === 0 && <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Cover</div>}
                  </div>
                ))}
                <div className="border-2 border-dashed rounded-lg flex items-center justify-center aspect-square">
                    <Button variant="ghost" size="icon"><Plus className="text-muted-foreground"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trail Angel Details */}
          <Card>
            <CardHeader>
                <CardTitle>Trail Angel Services</CardTitle>
                <CardDescription>Select the services you can provide to hikers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-4">Sleeping Arrangements</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                           <Label htmlFor="beds-switch" className="flex items-center gap-2"><Bed/> Beds</Label>
                           <div className="flex items-center gap-4">
                                <Select defaultValue="1">
                                    <SelectTrigger className="w-20"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                    </SelectContent>
                                </Select>
                               <Switch id="beds-switch" />
                           </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                           <Label htmlFor="camping-switch" className="flex items-center gap-2"><Tent/> Camping Spot</Label>
                           <Switch id="camping-switch" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                           <Label htmlFor="couch-switch" className="flex items-center gap-2"><Sofa/> Couch / Floor Space</Label>
                           <Switch id="couch-switch" />
                        </div>
                    </div>
                </div>
                
                <Separator />

                <div>
                    <h3 className="font-semibold mb-4">Facilities & Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            {id: 'laundry', label: 'Laundry', icon: WashingMachine},
                            {id: 'wifi', label: 'WiFi', icon: Wifi},
                            {id: 'showers', label: 'Showers', icon: ShowerHead},
                            {id: 'storage', label: 'Secure Storage', icon: Lock},
                            {id: 'packages', label: 'Packages / Mail Drops', icon: Package},
                            {id: 'food', label: 'Food / Meals', icon: CookingPot},
                            {id: 'rides', label: 'Rides / Shuttle', icon: Car},
                            {id: 'pets', label: 'Pets welcome', icon: Dog},
                        ].map(service => (
                            <div key={service.id} className="flex items-center gap-2">
                                <Checkbox id={service.id} />
                                <Label htmlFor={service.id} className="font-normal flex items-center gap-1.5"><service.icon className="w-4 h-4 text-muted-foreground"/> {service.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                 <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-80 w-full rounded-lg overflow-hidden border">
                            <TrailAngelMap angels={TRAIL_ANGELS.slice(0,1)} onSelectAngel={() => {}} />
                        </div>
                        <div className="space-y-4">
                            <Input placeholder="Address Line 1" />
                            <Input placeholder="Address Line 2" />
                            <Input placeholder="City" />
                            <div className="flex gap-4">
                                <Input placeholder="State" />
                                <Input placeholder="ZIP Code" />
                            </div>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usa">United States</SelectItem>
                                    <SelectItem value="canada">Canada</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                                <Checkbox id="private-residence" />
                                <Label htmlFor="private-residence" className="text-sm font-normal text-muted-foreground">This is my private residence. Only show approximate location on the map.</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
          
          {/* Contact and Social */}
          <Card>
             <CardHeader>
                <CardTitle>Contact & Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="Your phone number" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email address" />
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-4 flex items-center justify-between">
                        Emergency Contacts 
                        <Button variant="ghost" size="sm"><Plus className="w-4 h-4 mr-1"/> Add</Button>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <Input placeholder="Name" />
                        <Input placeholder="Relationship" />
                        <Input type="tel" placeholder="Phone" />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Social Media & Links</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Instagram className="w-5 h-5 text-muted-foreground" />
                            <Input placeholder="Instagram username" defaultValue={userProfile.socials?.instagram} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Twitter className="w-5 h-5 text-muted-foreground" />
                            <Input placeholder="Twitter / X username" defaultValue={userProfile.socials?.twitter} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <Input type="url" placeholder="Website or blog URL" />
                        </div>
                    </div>
                </div>

            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
