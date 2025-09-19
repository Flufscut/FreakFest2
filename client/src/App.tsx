import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ArtistsPage from "@/pages/ArtistsPage";

// Import all sections
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UrgencyBanner from "@/components/UrgencyBanner";
// import LineupSection from "@/components/LineupSection";
import { lazy, Suspense } from "react";
const TicketSection = lazy(() => import("@/components/TicketSection"));
const VenueSection = lazy(() => import("@/components/VenueSection"));
const EmailCapture = lazy(() => import("@/components/EmailCapture"));
import Footer from "@/components/Footer";
import GalleryPage from "@/pages/GalleryPage";
import LineupPage from "@/pages/LineupPage";
import FAQPage from "@/pages/FAQPage";
import WhatIsSection from "@/components/WhatIsSection";
import VenuePage from "@/pages/VenuePage";

function FreakfestLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <UrgencyBanner percentSold={73} />
        {/* Lineup moved to dedicated page */}
        <WhatIsSection />
        <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '1000px 1000px' as any }}>
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading tickets…</div>}>
            <TicketSection />
          </Suspense>
        </div>
        <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '1000px 1000px' as any }}>
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading venue…</div>}>
            <VenueSection />
          </Suspense>
        </div>
        <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '1000px 800px' as any }}>
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading…</div>}>
            <EmailCapture />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={FreakfestLandingPage} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/artists/:id" component={ArtistsPage} />
      <Route path="/lineup" component={LineupPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/venue" component={VenuePage} />
      <Route path="/faq" component={FAQPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
