/**
 * lib/press.ts — Press logo data for the marquee section
 *
 * All publications from the HTML mockup's marquee section, verbatim.
 * Some entries are italic (matching the mockup's .italic class).
 */

export interface PressItem {
  /** Publication name */
  name: string;
  /** Whether to render in italic Fraunces */
  italic?: boolean;
}

export const pressLogos: PressItem[] = [
  { name: 'Architectural Digest' },
  { name: 'Elle Decor' },
  { name: 'Wallpaper*', italic: true },
  { name: 'World of Interiors' },
  { name: 'Vogue Living' },
  { name: 'The Gentlewoman', italic: true },
  { name: 'Cabana' },
  { name: 'House & Garden' },
];
