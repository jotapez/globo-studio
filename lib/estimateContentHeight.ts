/**
 * lib/estimateContentHeight.ts
 *
 * Pre-computes estimated content height from project data (before images load).
 * Used by ScrollPaddingShell for a stable bottom transition — same technique
 * as the top transition (scroll-based, no ResizeObserver).
 *
 * Layout tokens (mobile): content-width 353px, wrapper padding 12px, gap 12px.
 * Block heights derived from aspect-ratio (reserved before image load).
 */

import type { ContentBlock } from '@/lib/projects';

// Mobile layout constants (from tokens.css)
const CONTENT_WIDTH_MOBILE = 353;
const WRAPPER_PADDING_MOBILE = 12;
const WRAPPER_GAP_MOBILE = 12;
const HERO_PADDING_TOP_MOBILE = 104; // fallback; actual uses CSS var
const PAGE_PADDING_BOTTOM_MOBILE = 104;

// ProjectIntro mobile: pt-8, gap-16, heading (40/54), body (16/21)
// Estimate ~2 lines heading (108px) + ~4 lines body (84px) + gaps
const INTRO_HEIGHT_MOBILE = 220;

// Caption: ~2 lines at 21px line-height
const CAPTION_HEIGHT = 44;

function parseAspectRatio(ratio: string): number {
  const [w, h] = ratio.split('/').map(Number);
  return h / w;
}

function blockHeightMobile(block: ContentBlock): number {
  const innerWidth = CONTENT_WIDTH_MOBILE - WRAPPER_PADDING_MOBILE * 2;
  switch (block.type) {
    case 'hero':
      return innerWidth * (470 / 329);
    case 'single-white':
    case 'single-color': {
      const pad = 16;
      const imgWidth = innerWidth - pad * 2;
      return pad * 2 + imgWidth * parseAspectRatio(block.aspectRatio);
    }
    case 'full-bleed':
      return innerWidth * parseAspectRatio(block.aspectRatio);
    case 'two-image': {
      const colWidth = innerWidth;
      const h1 = colWidth * parseAspectRatio(block.aspectRatioA);
      const h2 = colWidth * parseAspectRatio(block.aspectRatioB);
      return h1 + 32 + h2;
    }
    case 'caption':
      return CAPTION_HEIGHT;
    default:
      return 0;
  }
}

/**
 * Returns estimated document Y of ScrollPaddingShell bottom (mobile).
 * Use for bottom transition: when scrollY + viewportHeight approaches this,
 * padding transitions from 0 to 20px.
 */
export function estimateContentBottomMobile(
  contentBlocks: ContentBlock[],
  heroPaddingTop = HERO_PADDING_TOP_MOBILE,
  pagePaddingBottom = PAGE_PADDING_BOTTOM_MOBILE
): number {
  const introHeight = INTRO_HEIGHT_MOBILE;
  const blockHeights = contentBlocks.map(blockHeightMobile);
  const totalBlockHeight = blockHeights.reduce((a, b) => a + b, 0);
  const gapCount = contentBlocks.length;
  const totalGaps = WRAPPER_GAP_MOBILE * gapCount;
  const wrapperPadding = WRAPPER_PADDING_MOBILE * 2;

  const pageWrapperHeight =
    wrapperPadding + introHeight + totalGaps + totalBlockHeight;

  return heroPaddingTop + pageWrapperHeight + pagePaddingBottom;
}
