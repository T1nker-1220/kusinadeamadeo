"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

type MotionComponent = {
  [K in keyof JSX.IntrinsicElements]: HTMLMotionProps<K>;
};

interface CustomMotionProps<Tag extends keyof JSX.IntrinsicElements> {
  type?: Tag;
  children: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
}

export const Motion = <Tag extends keyof JSX.IntrinsicElements>({
  type,
  children,
  ...props
}: CustomMotionProps<Tag> & HTMLMotionProps<Tag>) => {
  const Component = type ? (motion as any)[type] : motion.div;
  return <Component {...props}>{children}</Component>;
};
