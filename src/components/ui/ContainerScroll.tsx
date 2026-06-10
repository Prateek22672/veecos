"use client";

import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * Scroll-driven 3D reveal: a tilted card rotates flat and scales up as it
 * scrolls into view. Adapted to the Veecos design system.
 */
export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scaleRange: [number, number] = isMobile ? [0.8, 1] : [1.04, 1];
  const rotate = useTransform(scrollYProgress, [0.05, 0.45], [22, 0]);
  const scale = useTransform(scrollYProgress, [0.05, 0.45], scaleRange);
  const translate = useTransform(scrollYProgress, [0, 0.45], [60, -20]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[30rem] items-center justify-center p-2 md:h-[42rem] md:p-10"
    >
      <div className="relative w-full" style={{ perspective: "1200px" }}>
        <Header translate={reduce ? undefined : translate}>
          {titleComponent}
        </Header>
        <Card rotate={reduce ? undefined : rotate} scale={reduce ? undefined : scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  children,
}: {
  translate?: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ y: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {children}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate?: MotionValue<number>;
  scale?: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a",
      }}
      className="mx-auto -mt-6 h-[15rem] w-full max-w-4xl rounded-[1.75rem] border border-white/10 bg-charcoal p-2 shadow-2xl sm:h-[18rem] md:h-[26rem] md:p-3"
    >
      <div className="size-full overflow-hidden rounded-[1.5rem] bg-night">
        {children}
      </div>
    </motion.div>
  );
}
