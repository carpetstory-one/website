'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="bg-background flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="border-ink/10 bg-canvas-warm/30 w-full max-w-xs rounded-none border p-10"
                  key={i}
                >
                  <div className="text-ink text-[15px] leading-[1.6]">
                    {text}
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <Image
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      loading="lazy"
                      sizes="40px"
                      className="h-10 w-10 rounded-full object-cover grayscale"
                    />
                    <div className="flex flex-col">
                      <div className="text-ink text-[14px] leading-5 font-medium tracking-tight">
                        {name}
                      </div>
                      <div className="text-ink-soft mt-1 text-[12px] leading-5 tracking-tight uppercase opacity-60">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
