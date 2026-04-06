'use client';
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

type WavePathProps = React.ComponentProps<'div'> & {
  onLineMouseEnter?: () => void;
  onLineMouseLeave?: () => void;
};

export function WavePath({ className, onLineMouseEnter, onLineMouseLeave, ...props }: WavePathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  let progress = 0;
  let x = 0.2;
  let time = Math.PI / 2;
  let reqId: number | null = null;

  const getWidth = () => containerRef.current?.offsetWidth ?? window.innerWidth * 0.7;

  useEffect(() => {
    setPath(progress);
  }, []);

  const setPath = (progress: number) => {
    const width = getWidth();
    if (path.current) {
      path.current.setAttributeNS(
        null,
        'd',
        `M0 100 Q${width * x} ${100 + progress * 0.6}, ${width} 100`,
      );
    }
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const manageMouseEnter = () => {
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  const manageMouseMove = (e: React.MouseEvent) => {
    const { movementY, clientX } = e;
    if (path.current) {
      const pathBound = path.current.getBoundingClientRect();
      x = (clientX - pathBound.left) / pathBound.width;
      progress += movementY;
      setPath(progress);
    }
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp(progress, 0, 0.025);
    time += 0.2;
    setPath(newProgress);
    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  };

  return (
    <div ref={containerRef} className={cn('relative h-px w-full', className)} {...props}>
      <div
        onMouseEnter={() => { manageMouseEnter(); onLineMouseEnter?.(); }}
        onMouseMove={manageMouseMove}
        onMouseLeave={() => { manageMouseLeave(); onLineMouseLeave?.(); }}
        className="relative -top-5 z-10 h-10 w-full hover:-top-[150px] hover:h-[300px]"
      />
      <svg className="absolute -top-[100px] h-[300px] w-full">
        <path ref={path} className="fill-none stroke-current" strokeWidth={1} />
      </svg>
    </div>
  );
}
