import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TransitionType =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  transitionKey?: string | number; // Unique identifier for the page/component
  type?: TransitionType;
  duration?: number; // in seconds
  delay?: number; // in seconds
  className?: string;
}

const getTransitionVariants = (type: TransitionType) => {
  switch (type) {
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case "slide-up":
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };
    case "slide-down":
      return {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      };
    case "slide-left":
      return {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
      };
    case "slide-right":
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
      };
    case "scale":
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
};

const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
  children,
  transitionKey,
  type = "fade",
  duration = 0.3,
  delay = 0,
  className,
}) => {
  const variants = getTransitionVariants(type);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration, delay, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
