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
      <h1 className="font-display font-light text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.02em] text-ink mb-12">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display font-light text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-ink mt-20 mb-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-light text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.01em] text-ink mt-12 mb-6">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="body-lg text-ink-soft mb-8 max-w-3xl">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="link always text-accent">
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside body-lg text-ink-soft mb-8 space-y-3 max-w-3xl">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li>{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-medium text-ink">{children}</strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-ink/20 pl-6 my-10 italic text-ink/80 text-[20px] max-w-2xl font-display">
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className="my-16 border-ink-faint" />
    ),
    Aside: ({ children }: { children: React.ReactNode }) => (
      <aside className="my-10 p-6 bg-canvas-warm border-l-2 border-accent text-[15px] leading-relaxed text-ink-soft md:float-right md:w-[300px] md:ml-10 md:mb-10">
        {children}
      </aside>
    ),
    // Allows overriding default components
    ...components,
  };
}
