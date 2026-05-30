import type { MDXComponents } from 'mdx/types';

/**
 * mdx-components.tsx
 *
 * Maps standard Markdown elements to the Carpetstory bespoke typography system.
 * This ensures any .mdx page inherently matches the editorial styling of the main site.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-ink mb-12 text-[40px] leading-[1.05] font-light tracking-[-0.02em] md:text-[56px] lg:text-[72px]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-ink mt-20 mb-8 text-[32px] leading-[1.1] font-light tracking-[-0.02em] md:text-[40px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-ink mt-12 mb-6 text-[24px] leading-[1.2] font-light tracking-[-0.01em] md:text-[28px]">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="body-lg text-ink-soft mb-8 max-w-3xl">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="link always text-accent">
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="body-lg text-ink-soft mb-8 max-w-3xl list-inside list-disc space-y-3">
        {children}
      </ul>
    ),
    li: ({ children }) => <li>{children}</li>,
    strong: ({ children }) => (
      <strong className="text-ink font-medium">{children}</strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-ink/20 text-ink/80 font-display my-10 max-w-2xl border-l pl-6 text-[20px] italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-ink-faint my-16" />,
    Aside: ({ children }: { children: React.ReactNode }) => (
      <aside className="bg-canvas-warm border-accent text-ink-soft my-10 border-l-2 p-6 text-[15px] leading-relaxed md:float-right md:mb-10 md:ml-10 md:w-[300px]">
        {children}
      </aside>
    ),
    // Allows overriding default components
    ...components,
  };
}
