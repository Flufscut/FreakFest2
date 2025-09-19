import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16 w-full flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">404 Page Not Found</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The page you’re looking for doesn’t exist.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
