'use client';

/**
 * ProjectImage — Next.js Image wrapper with a fixed-size loading placeholder.
 *
 * Renders /loading-image.svg centred over the image container while the actual
 * image is loading. The overlay is removed as soon as onLoad fires.
 *
 * Usage: drop-in replacement for <Image> inside any `relative`-positioned
 * container on project pages.
 */

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

// Fixed display size for the loading SVG — independent of the container size.
const LOADER_W = 300;
const LOADER_H = 165; // preserves 2112:1160 aspect ratio

export function ProjectImage({ onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/loading-image.svg"
            width={LOADER_W}
            height={LOADER_H}
            alt=""
            aria-hidden
          />
        </div>
      )}
      <Image
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
