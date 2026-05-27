/**
 * lib/testimonials.ts — Testimonial data for Carpetstory
 *
 * All 9 testimonials from the HTML mockup, verbatim.
 * Split into 3 columns for the vertical-scrolling testimonials section.
 *
 * Avatar images use Unsplash face crops that are known to exist.
 */

export interface Testimonial {
  /** The quote text — exact copy from the HTML */
  quote: string;
  /** Client or studio name */
  name: string;
  /** Location or role */
  role: string;
  /** Avatar image URL (Unsplash face crop) */
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'It arrived in a wooden crate that smelled of cedar. The rug smelled of wool and sun. Eight months later, both still do.',
    name: 'Camille Bertin',
    role: 'Paris, France',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      'We have one Carpetstory in the dining room. Guests always sit on the floor.',
    name: 'Studio Iro',
    role: 'London, UK',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      "You don't buy a piece like this. You inherit it forward.",
    name: 'Marcou & Vasilakis',
    role: 'Athens, Greece',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      'I asked Aashrit for something the colour of late afternoon. What arrived was exactly that.',
    name: 'Lila Hartwell',
    role: 'Brooklyn, NY',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      'The pile is so dense your foot sinks a quarter inch. I notice it every morning.',
    name: 'Quincy Architects',
    role: 'Practice, NYC',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      'Specified for a client in Geneva. They wrote a year later just to say the rug had aged better than the room around it.',
    name: 'Henrik Vogel',
    role: 'Architect, Zurich',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      "It looks like something you'd find in a museum and want to take home. We took it home.",
    name: 'Anya Kapoor',
    role: 'Mumbai, India',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      "The corner curls slightly where the loom ended. I love that. A machine wouldn't have left that.",
    name: 'Tom Halloran',
    role: 'Private client, Dublin',
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote:
      "Eight months is a long time to wait for a floor. Forty years is a long time to keep one. We're betting on the second number.",
    name: 'Studio Marais',
    role: 'Paris, France',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces',
  },
];

/** Column A: testimonials 0-2 */
export const columnA = testimonials.slice(0, 3);

/** Column B: testimonials 3-5 */
export const columnB = testimonials.slice(3, 6);

/** Column C: testimonials 6-8 */
export const columnC = testimonials.slice(6, 9);
