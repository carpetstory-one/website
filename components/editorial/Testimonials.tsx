"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from 'next-intl';

const TOTAL = 9;

export function Testimonials() {
  const t = useTranslations('Testimonials');
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TOTAL);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + TOTAL) % TOTAL);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const idx = current + 1;
  const quote = t(`q${idx}`);
  const name = t(`n${idx}`);
  const role = t(`r${idx}`);

  return (
    <section className="testimonials-editorial" id="testimonials" aria-labelledby="testimonials-heading">
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
          <h2 id="testimonials-heading" className="label" style={{ display: 'block', textAlign: 'center', margin: 0 }}>
            {t('label')}
          </h2>
        </motion.div>

        <div className="testimonial-quote-area">
          <div className="testimonial-accent-line" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="testimonial-slide"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as any,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) next();
                else if (info.offset.x > 50) prev();
              }}
            >
              <blockquote className="testimonial-quote">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="testimonial-attribution">
                <span className="testimonial-name">{name}</span>
                <span className="testimonial-role">{role}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="testimonial-accent-line" />
        </div>

        <div className="testimonial-nav">
          <button
            type="button"
            onClick={prev}
            className="testimonial-arrow magnetic"
            aria-label={t('prev')}
          >
            ←
          </button>
          <span className="testimonial-counter" aria-live="polite">
            {String(idx).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={next}
            className="testimonial-arrow magnetic"
            aria-label={t('next')}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
