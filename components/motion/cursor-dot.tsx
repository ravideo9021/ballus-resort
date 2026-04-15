"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorDot() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    const hasTouch = window.matchMedia("(hover: none)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time touch detection on mount
    setIsTouchDevice(hasTouch);
    if (hasTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
      animate={{
        x: position.x - 6,
        y: position.y - 6,
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.6 : 0.8,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
    >
      <div className="w-3 h-3 rounded-full bg-[#C9A24B]" />
    </motion.div>
  );
}
