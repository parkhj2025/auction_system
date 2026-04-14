import { HeroSearch } from "@/components/home/HeroSearch";
import { RegionStrip } from "@/components/home/RegionStrip";
import { CardCarousel } from "@/components/home/CardCarousel";
import { ContentShowcase } from "@/components/home/ContentShowcase";
import { WhySection } from "@/components/home/WhySection";
import { FlowSteps } from "@/components/home/FlowSteps";
import { Pricing } from "@/components/home/Pricing";
import { TrustCTA } from "@/components/home/TrustCTA";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch />
      <RegionStrip />
      <CardCarousel />
      <ContentShowcase />
      <WhySection />
      <FlowSteps />
      <Pricing />
      <TrustCTA />
    </main>
  );
}
