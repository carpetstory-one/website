'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

const QUOTES = [1, 2, 3] as const;

export function Testimonials() {
  const t = useTranslations('Testimonials');

  return (
    <section
      className="testimonials-editorial"
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials-inner">
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1] as any,
          }}
          viewport={{ once: true }}
        >
          <h2
            id="testimonials-heading"
            className="label"
            style={{ display: 'block', textAlign: 'center', margin: 0 }}
          >
            {t('label')}
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '48px',
            marginTop: '48px',
          }}
        >
          {QUOTES.map((idx, i) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1] as any,
              }}
              viewport={{ once: true }}
            >
              <div
                className="testimonial-accent-line"
                style={{ marginBottom: '24px' }}
              />
              <blockquote className="testimonial-quote" style={{ margin: 0 }}>
                &ldquo;{t(`q${idx}`)}&rdquo;
              </blockquote>
              <div
                className="testimonial-attribution"
                style={{ marginTop: '20px' }}
              >
                <span className="testimonial-name">{t(`n${idx}`)}</span>
                <span className="testimonial-role">{t(`r${idx}`)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
