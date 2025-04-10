import React from "react";
import { motion, MotionProps } from "framer-motion";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  pageVariants,
  getDirectionAwareSlideVariants,
} from "@/frontend/lib/animation";

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode;
  variant?: "page" | "card" | "list" | "item" | "modal" | "fade" | "slide";
  className?: string;
}

/**
 * A wrapper component that adds motion animations to its children
 * Automatically handles RTL direction for slide animations
 */
export function MotionWrapper({
  children,
  variant = "page",
  className = "",
  ...props
}: MotionWrapperProps) {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Select animation variants based on the specified variant type
  const getVariants = () => {
    switch (variant) {
      case "page":
        return pageVariants;
      case "slide":
        return getDirectionAwareSlideVariants(isRTL);
      // Add other variant cases as needed
      default:
        return pageVariants;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getVariants()}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * A list container that animates its children with staggered animations
 */
export function MotionList({
  children,
  className = "",
  ...props
}: Omit<MotionWrapperProps, "variant">) {
  return (
    <motion.ul
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.ul>
  );
}

/**
 * A list item that animates when its parent MotionList animates
 */
export function MotionListItem({
  children,
  className = "",
  ...props
}: Omit<MotionWrapperProps, "variant">) {
  return (
    <motion.li
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.li>
  );
}

/**
 * A card component with hover animations
 */
export function MotionCard({
  children,
  className = "",
  ...props
}: Omit<MotionWrapperProps, "variant">) {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.02, transition: { duration: 0.2 } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
