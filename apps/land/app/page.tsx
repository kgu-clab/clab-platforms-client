import {
  HeroSection,
  StatsSection,
  CtaSection,
  LandingFooter,
  ActivitySection,
} from '@/components/home';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative pt-header-height">
      <HeroSection />
      <StatsSection />
      <ActivitySection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
