"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-none border border-ink/10 max-w-xs w-full bg-canvas-warm/30" key={i}>
                  <div className="text-[15px] leading-[1.6] text-ink">{text}</div>
                  <div className="flex items-center gap-4 mt-8">
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
                      <div className="font-medium tracking-tight leading-5 text-[14px] text-ink">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight text-[12px] uppercase text-ink-soft mt-1">{role}</div>
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
