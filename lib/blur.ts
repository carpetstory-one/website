/**
 * Tiny inline LQIP for next/image placeholder="blur" on remote images.
 * Returns a base64 SVG data URL of a solid warm tone that next/image
 * enlarges + blurs while the full image loads. Keeps a color in the frame
 * instantly with zero extra network requests.
 */
export function blurDataURL(color = '#cdbfa6'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${color}"/></svg>`;
  const base64 =
    typeof window === 'undefined'
      ? Buffer.from(svg).toString('base64')
      : window.btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
