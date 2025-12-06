"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AnimatedCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      {/* Four-curved AI cursor */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        className="relative -translate-x-1/2 -translate-y-1/2"
      >
        <motion.path
          d="M 16 8 Q 20 12 20 16 Q 20 20 16 24"
          stroke="#005bbc"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M 16 8 Q 12 12 12 16 Q 12 20 16 24"
          stroke="#005bbc"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.circle
          cx="16"
          cy="16"
          r="3"
          fill="#ffd600"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
};

export default AnimatedCursor;


