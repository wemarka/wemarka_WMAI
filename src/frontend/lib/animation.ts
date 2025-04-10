import { Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Slide transition variants
export const slideVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Direction-aware slide variants for RTL/LTR support
export const getDirectionAwareSlideVariants = (isRTL: boolean): Variants => {
  const xInitial = isRTL ? -20 : 20;
  const xExit = isRTL ? 20 : -20;

  return {
    initial: {
      opacity: 0,
      x: xInitial,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: xExit,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };
};

// Card hover variants
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// List item stagger variants
export const listContainerVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Modal/dialog variants
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1], // Custom ease curve for a nice pop effect
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Fade in variants
export const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
