'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

type ChildProps = {
  'data-id': string;
  className?: string;
  children?: React.ReactNode;
};

type CloneExtraProps = React.Attributes & {
  onClick: () => void;
  'data-checked': boolean;
  className: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

type AnimatedBackgroundProps = {
  children:
    | React.ReactElement<ChildProps>
    | React.ReactElement<ChildProps>[];
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: object;
  enableHover?: boolean;
  /** Unique layoutId for the active pill. Override to avoid conflicts when
   *  multiple AnimatedBackground instances are mounted simultaneously. */
  layoutId?: string;
  /** Set to false to disable the opacity fade-in/out on the pill (avoids flash
   *  when the pill colour changes across theme boundaries). Default: true. */
  animateOpacity?: boolean;
  /** Optional inline styles for the pill (e.g. borderRadius: 9999 to prevent
   *  distortion during layout morph between different-sized targets). */
  pillStyle?: React.CSSProperties;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
  layoutId = 'animated-background',
  animateOpacity = true,
  pillStyle,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultValue ?? null);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setActiveId(defaultValue);
    }
  }, [defaultValue]);

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id);
    onValueChange?.(id);
  };

  return (
    <>
      {React.Children.map(children, (child, index) => {
        const id = child.props['data-id'];
        const isActive = activeId === id;

        return React.cloneElement(
          child,
          {
            key: id ?? index,
            onClick: () => handleSetActiveId(id),
            ...(enableHover && {
              onMouseEnter: () => handleSetActiveId(id),
              onMouseLeave: () => handleSetActiveId(null),
            }),
            'data-checked': isActive,
            className: cn('relative inline-flex', child.props.className),
          } as CloneExtraProps,
          <>
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key={id}
                  layoutId={layoutId}
                  className={cn('absolute inset-0', className)}
                  style={pillStyle}
                  transition={transition}
                  initial={animateOpacity ? { opacity: 0 } : false}
                  animate={animateOpacity ? { opacity: 1 } : undefined}
                  exit={animateOpacity ? { opacity: 0 } : undefined}
                />
              )}
            </AnimatePresence>
            {child.props.children}
          </>
        );
      })}
    </>
  );
}
