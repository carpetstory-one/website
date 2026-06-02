import { Suspense } from 'react';
import { Nav } from '@/components/editorial/Nav';
import { Hero } from '@/components/editorial/Hero';
import { Collection } from '@/components/editorial/Collection';
import { PromiseSection } from '@/components/editorial/PromiseSection';
import { WorldStage } from '@/components/editorial/WorldStage';
import { MakingSection } from '@/components/editorial/MakingSection';
import { KnotCount } from '@/components/editorial/KnotCount';
import { Materials } from '@/components/editorial/Materials';
import { Heritage } from '@/components/editorial/Heritage';
import { Letter } from '@/components/editorial/Letter';
import { World } from '@/components/editorial/World';
import { Testimonials } from '@/components/editorial/Testimonials';
import { Doors } from '@/components/editorial/Doors';
import { Inquiry } from '@/components/editorial/Inquiry';
import { Footer } from '@/components/editorial/Footer';

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <Collection />
      <PromiseSection />
      <WorldStage />
      <MakingSection />
      <KnotCount />
      <Materials />
      <Heritage />
      <Letter />
      <World />
      <Testimonials />
      <Doors />
      <Suspense fallback={<div className="py-24" />}>
        <Inquiry />
      </Suspense>
      <Footer />
    </>
  );
}
