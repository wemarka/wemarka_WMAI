import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { pageVariants } from "@/frontend/lib/animation";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  disableAnimation?: boolean;
}

/**
 * Wrapper component that adds page transition animations
 * to route changes using Framer Motion
 */
export function PageTransition({
  children,
  className = "",
  disableAnimation = false,
}: PageTransitionProps) {
  const location = useLocation();

  // If animations are disabled, render without AnimatePresence
  if (disableAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
