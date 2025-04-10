import React from "react";
import { AnimatePresence } from "framer-motion";
import { MotionWrapper } from "@/frontend/components/ui/motion-wrapper";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that adds page transition animations
 * to route changes using Framer Motion
 */
export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <MotionWrapper
        key={location.pathname}
        variant="page"
        className={className}
      >
        {children}
      </MotionWrapper>
    </AnimatePresence>
  );
}
