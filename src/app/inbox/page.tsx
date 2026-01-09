import AppLayout from "@/components/app/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function InboxPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>You have no new messages.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Your message history will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
