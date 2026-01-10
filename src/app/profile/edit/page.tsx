

'use client';

import {
  ArrowLeft,
  Bed,
  Car,
  CookingPot,
  Lock,
  Mail,
  Package,
  Plus,
  Bath,
  Sofa,
  Tent,
  Trash2,
  UploadCloud,
  Wifi,
  WashingMachine,
  Youtube,
  Linkedin,
  Twitter,
  Instagram,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/components/app/app-layout';
import TrailAngelMap from '@/components/app/trail-angel-map';
import { TRAIL_ANGELS, ALL_SERVICES } from '@/lib/data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUserProfileStore } from '@/lib/user-profile-store';

const profileFormSchema = z.object({
  trailName: z.string().min(1, { message: "Trail Name is required." }),
  status: z.string().optional(),
  badges: z.string().optional(),
  about: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


// Mockup for icons not in lucide-react
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-muted-foreground"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-muted-foreground"><path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 0-8 8"></path></svg>
);


export default function EditProfilePage({ setProfileOpen, addMessageToInbox }: { setProfileOpen?: (open: boolean) => void; addMessageToInbox?: (...args: any[]) => void }) {
  const [hasBeds, setHasBeds] = useState(false);
  const { toast } = useToast();
  const { setProfile, setService, setBedCount, setSocials, setAddress, address: userAddress, setPosition } = useUserProfileStore();
    
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        trailName: "",
        status: "",
        badges: "",
        about: "",
        instagram: "",
        twitter: "",
        facebook: "",
        tiktok: "",
        youtube: "",
        linkedin: "",
        website: "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    const { instagram, twitter, facebook, tiktok, youtube, linkedin, website, ...profileData } = data;
    const badges = data.badges ? data.badges.split(',').map(b => b.trim()) : [];
    
    setProfile({ ...profileData, badges });
    setSocials({ instagram, twitter, facebook, tiktok, youtube, linkedin, website });
    
    toast({
      title: "Profile Saved!",
      description: "Your changes have been saved successfully.",
    });
  }

  const serviceIcons = {
    'beds': Bed,
    'laundry': WashingMachine,
    'wifi': Wifi,
    'showers': Bath,
    'storage': Lock,
    'mail-drop': Package,
    'food': CookingPot,
    'rides': Car,
    'camping': Tent,
    'couch-floor': Sofa,
  };

  const primaryServices = ['beds', 'couch-floor', 'camping'];
  const primaryServiceObjects = ALL_SERVICES.filter(s => primaryServices.includes(s.id));
  const otherServiceObjects = ALL_SERVICES.filter(s => !primaryServices.includes(s.id));
    
  return (
    <AppLayout>
    <div className="bg-background">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="trailName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Trail Name" {...field} className="focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-primary">
                              <SelectValue placeholder="Choose your status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hiking">Currently hiking</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="unavailable">Not available</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              
              <div>
                  <FormField
                    control={form.control}
                    name="badges"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                           <Input 
                              id="badges" 
                              placeholder="PCT Hiker 2024, Trail Angel Veteran, Trail Magic King, Thru-Hiker..."
                              {...field}
                              className="focus-visible:ring-primary"
                            />
                        </FormControl>
                         <p className="text-sm text-muted-foreground mt-1">Enter badges separated by commas</p>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                 
              </div>

              <div>
                <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            id="about"
                            placeholder="Tell us a little bit about yourself, your hiking experience, or what you offer as a trail angel."
                            rows={5}
                            {...field}
                             className="focus-visible:ring-primary"
                          />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
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
                <div className="border-2 border-dashed rounded-lg flex items-center justify-center aspect-square">
                    <Button variant="ghost" size="icon" type="button"><Plus className="text-muted-foreground"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trail Angel Details */}
          <Card>
            <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Select the services you can provide to hikers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {primaryServiceObjects.map(service => {
                       const Icon = serviceIcons[service.id as keyof typeof serviceIcons] || Car;
                       if (service.id === 'beds') {
                           return (
                             <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg col-span-2 sm:col-span-1">
                                 <div className='flex items-center gap-2'>
                                    <Checkbox id="beds-checkbox" onCheckedChange={(checked) => {
                                        setHasBeds(Boolean(checked));
                                        setService('beds', Boolean(checked));
                                    }} />
                                    <Label htmlFor="beds-checkbox" className="font-normal flex items-center gap-1.5">
                                      <Bed className="w-5 h-5 text-primary" /> Beds
                                    </Label>
                                 </div>
                                 {hasBeds && (
                                   <Input id="beds-count" type="number" min="1" max="99" placeholder="1" className="w-14 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-primary" onChange={e => setBedCount(parseInt(e.target.value) || 0)} />
                                 )}
                             </div>
                           )
                       }
                       return (
                        <div key={service.id} className="flex items-center gap-2 p-3 border rounded-lg">
                            <Checkbox id={service.id} onCheckedChange={(checked) => setService(service.id, Boolean(checked))} />
                            <Label htmlFor={service.id} className="font-normal flex items-center gap-1.5">
                              <Icon className="w-5 h-5 text-primary"/> {service.name}
                            </Label>
                        </div>
                       )
                    })}
                    {otherServiceObjects.map(service => {
                       const Icon = serviceIcons[service.id as keyof typeof serviceIcons] || Car;
                       return (
                        <div key={service.id} className="flex items-center gap-2 p-3 border rounded-lg">
                            <Checkbox id={service.id} onCheckedChange={(checked) => setService(service.id, Boolean(checked))} />
                            <Label htmlFor={service.id} className="font-normal flex items-center gap-1.5">
                              <Icon className="w-5 h-5 text-primary"/> {service.name}
                            </Label>
                        </div>
                       )
                    })}
                </div>
                
                <Separator />

                 <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-80 w-full rounded-lg overflow-hidden border">
                            <TrailAngelMap angels={TRAIL_ANGELS.slice(0,1)} onSelectAngel={() => {}} />
                        </div>
                        <div className="space-y-4">
                            <Input placeholder="Address Line 1" value={userAddress.line1} onChange={e => setAddress({ line1: e.target.value })} className="focus-visible:ring-primary"/>
                            <Input placeholder="Address Line 2" value={userAddress.line2} onChange={e => setAddress({ line2: e.target.value })} className="focus-visible:ring-primary"/>
                            <Input placeholder="City" value={userAddress.city} onChange={e => setAddress({ city: e.target.value })} className="focus-visible:ring-primary"/>
                            <div className="flex gap-4">
                                <Input placeholder="State" value={userAddress.state} onChange={e => setAddress({ state: e.target.value })} className="focus-visible:ring-primary"/>
                                <Input placeholder="ZIP Code" value={userAddress.zip} onChange={e => setAddress({ zip: e.target.value })} className="focus-visible:ring-primary"/>
                            </div>
                            <Select value={userAddress.country} onValueChange={value => setAddress({ country: value })}>
                                <SelectTrigger className="focus:ring-primary"><SelectValue placeholder="Select Country" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usa">United States</SelectItem>
                                    <SelectItem value="canada">Canada</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                                <Checkbox id="private-residence" checked={userAddress.isPrivate} onCheckedChange={checked => setAddress({ isPrivate: Boolean(checked) })} />
                                <Label htmlFor="private-residence" className="text-sm font-normal text-muted-foreground">This is my private residence. Only show approximate location on the map.</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
          
          {/* Contact */}
          <Card>
             <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>This information is private and never made public.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="firstName" placeholder="First Name" className="focus-visible:ring-primary" />
                    <Input id="lastName" placeholder="Last Name" className="focus-visible:ring-primary" />
                    <Input id="phone" type="tel" placeholder="Phone Number" className="focus-visible:ring-primary" />
                    <Input id="email" type="email" placeholder="Email" className="focus-visible:ring-primary" />
                </div>
                 <div>
                    <h3 className="font-semibold mb-4 flex items-center justify-between">
                        Emergency Contacts 
                        <Button variant="ghost" size="sm" type="button"><Plus className="w-4 h-4 mr-1"/> Add</Button>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <Input placeholder="Name" className="focus-visible:ring-primary" />
                        <Input placeholder="Relationship" className="focus-visible:ring-primary" />
                        <Input type="tel" placeholder="Phone" className="focus-visible:ring-primary" />
                    </div>
                </div>
            </CardContent>
          </Card>
          
          {/* Social Media */}
          <Card>
             <CardHeader>
                <CardTitle>Social Media & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Instagram className="w-5 h-5 text-muted-foreground" />
                            <FormField control={form.control} name="instagram" render={({ field }) => (
                              <Input placeholder="Instagram username" {...field} className="focus-visible:ring-primary" />
                            )} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Twitter className="w-5 h-5 text-muted-foreground" />
                            <FormField control={form.control} name="twitter" render={({ field }) => (
                              <Input placeholder="Twitter / X username" {...field} className="focus-visible:ring-primary" />
                            )} />
                        </div>
                        <div className="flex items-center gap-2">
                            <FacebookIcon />
                            <FormField control={form.control} name="facebook" render={({ field }) => (
                              <Input placeholder="Facebook profile URL" {...field} className="focus-visible:ring-primary" />
                            )} />
                        </div>
                        <div className="flex items-center gap-2">
                            <TikTokIcon />
                            <FormField control={form.control} name="tiktok" render={({ field }) => (
                              <Input placeholder="TikTok username" {...field} className="focus-visible:ring-primary" />
                            )} />
                        </div>
                         <div className="flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-muted-foreground" />
                            <FormField control={form.control} name="youtube" render={({ field }) => (
                              <Input placeholder="YouTube channel URL" {...field} className="focus-visible:ring-primary" />
                            )} />
                        </div>
                         <div className="flex items-center gap-2">
                            <Linkedin className="w-5 h-5 text-muted-foreground" />
                             <FormField control={form.control} name="linkedin" render={({ field }) => (
                              <Input placeholder="LinkedIn profile URL" {...field} className="focus-visible:ring-primary" />
                            )} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <FormField control={form.control} name="website" render={({ field }) => (
                           <Input type="url" placeholder="Website or blog URL" {...field} className="focus-visible:ring-primary" />
                        )} />
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <Button variant="ghost" type="button">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </div>
      </form>
      </Form>
    </div>
    </AppLayout>
  );
}
