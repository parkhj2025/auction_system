"use client";

import { cn } from "@/lib/utils";
import React from "react";

/* Aceternity UI — Aurora Background (https://ui.aceternity.com/components/aurora-background).
 * v11 정정: Background Boxes (hover 의존) → Aurora Background (자율 모션 + 모바일 정합).
 * 모션: CSS @keyframes aurora 60s 무한 (globals.css 정합).
 * 색: green primary #00C853 + green-light #A7F3D0 + white.
 * GPU accelerated: will-change transform / filter blur(40px) / opacity 0.6.
 * prefers-reduced-motion: animation none (globals.css 정합). */

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  showRadialGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "transition-bg relative flex flex-col items-center justify-center bg-white text-slate-950",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={
          {
            "--aurora":
              "repeating-linear-gradient(100deg, #00C853 10%, #A7F3D0 15%, #ffffff 20%, #A7F3D0 25%, #00C853 30%)",
            "--white-gradient":
              "repeating-linear-gradient(100deg, #ffffff 0%, #ffffff 7%, transparent 10%, transparent 12%, #ffffff 16%)",
            "--green-300": "#86EFAC",
            "--green-500": "#00C853",
            "--green-100": "#A7F3D0",
            "--white": "#ffffff",
            "--transparent": "transparent",
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            `aurora-bg pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--green-500)_10%,var(--green-100)_15%,var(--white)_20%,var(--green-100)_25%,var(--green-500)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};
