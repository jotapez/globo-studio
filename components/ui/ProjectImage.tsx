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


export function ProjectImage({ onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/loading-image.svg"
            alt=""
            aria-hidden
            className="w-[300px] h-[165px] md:w-[450px] md:h-[248px]"
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
