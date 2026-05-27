/**
 * app/page.tsx — Home page for Carpetstory
 *
 * Phase 2: Composes all 14 editorial sections from the HTML mockup
 *          as static React components. No animation yet (deferred to Phase 3).
 *
 * Section order matches the HTML source of truth:
 * 1. Nav            — Fixed navigation bar
 * 2. Hero           — Full-viewport opening with rug SVG
 * 3. Promise        — Foreword editorial statement
 * 4. Making         — 8-frame "The Making" photo essay
 * 5. Immersive      — Full-screen video moment
 * 6. Knot Count     — Progressive knot scale reveal
 * 7. Materials      — Wool / Silk / Cotton + dyes
 * 8. Color Story    — Floating dye skeins
 * 9. Collection     — 6 hero pieces grid
 * 10. Heritage      — Historical context with archive images
 * 11. Letter        — Founder's letter
 * 12. World         — Interior photos + press marquee
 * 13. Testimonials  — Three-column testimonial cards
 * 14. Doors         — Split CTA (private / trade)
 * 15. Inquiry       — Contact form
 * 16. Footer        — Site footer
 *
 * Appears at: / (root)
 */

import { Nav } from '@/components/editorial/Nav';
import { Hero } from '@/components/editorial/Hero';
import { PromiseSection } from '@/components/editorial/PromiseSection';
import { MakingSection } from '@/components/editorial/MakingSection';
import { ImmersiveVideo } from '@/components/editorial/ImmersiveVideo';
import { KnotCount } from '@/components/editorial/KnotCount';
import { Materials } from '@/components/editorial/Materials';
import { ColorStory } from '@/components/editorial/ColorStory';
import { Collection } from '@/components/editorial/Collection';
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
      <PromiseSection />
      <MakingSection />
      <ImmersiveVideo />
      <KnotCount />
      <Materials />
      <ColorStory />
      <Collection />
      <Heritage />
      <Letter />
      <World />
      <Testimonials />
      <Doors />
      <Inquiry />
      <Footer />
    </>
  );
}
