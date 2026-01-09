import AppLayout from "@/components/app/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="https://picsum.photos/seed/123/200/200" alt="Hiker" />
              <AvatarFallback>H</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">Wired</CardTitle>
            <CardDescription>PCT Class of '24</CardDescription>
            <Button className="mt-4">Edit Profile</Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">About Me</h3>
            <p className="text-muted-foreground">
              Just a hiker trying to make it from Mexico to Canada. I love meeting new people and sharing trail stories. Always on the lookout for good coffee and a place to charge my power bank.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
