import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import React from 'react';

import { getProject, getAllSlugs, type ContentBlock } from '@/lib/projects';
import { estimateContentBottomMobile } from '@/lib/estimateContentHeight';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { ProjectIntro } from '@/components/ui/ProjectIntro';
import { HeroImageLayout } from '@/components/ui/HeroImageLayout';
import { SingleImageWhiteCard } from '@/components/ui/SingleImageWhiteCard';
import { SingleImageColorBackground } from '@/components/ui/SingleImageColorBackground';
import { FullBleedImageLayout } from '@/components/ui/FullBleedImageLayout';
import { CaptionText } from '@/components/ui/CaptionText';
import { ContactFooter } from '@/components/ui/ContactFooter';
import { TwoImageLayout } from '@/components/ui/TwoImageLayout';
import { ScrollPaddingShell } from '@/components/ui/ScrollPaddingShell';
import { VideoBlock } from '@/components/ui/VideoBlock';

// ─── static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.clientName} — Globo Studio`,
    description: project.intro.description,
  };
}

// ─── block renderer ───────────────────────────────────────────────────────────

function renderBlock(block: ContentBlock, i: number): React.ReactNode {
  const key = `${block.type}-${i}`;
  switch (block.type) {
    case 'hero':
      return (
        <HeroImageLayout
          key={key}
          src={block.src}
          alt={block.alt}
          priority={block.priority}
          className="mt-[20px] md:mt-0"
        />
      );

    case 'single-white':
      return (
        <SingleImageWhiteCard
          key={key}
          src={block.src}
          alt={block.alt}
          aspectRatio={block.aspectRatio}
        />
      );

    case 'single-color':
      return (
        <SingleImageColorBackground
          key={key}
          src={block.src}
          alt={block.alt}
          color={block.color}
          aspectRatio={block.aspectRatio}
        />
      );

    case 'full-bleed':
      return (
        <FullBleedImageLayout
          key={key}
          src={block.src}
          alt={block.alt}
          color={block.color}
          aspectRatio={block.aspectRatio}
          objectFit={block.objectFit}
        />
      );

    case 'two-image':
      return (
        <TwoImageLayout
          key={key}
          srcA={block.srcA}
          altA={block.altA}
          aspectRatioA={block.aspectRatioA}
          srcB={block.srcB}
          altB={block.altB}
          aspectRatioB={block.aspectRatioB}
          color={block.color}
          colorB={block.colorB}
          maxHeightB={block.maxHeightB}
        />
      );

    case 'video':
      return (
        <VideoBlock
          key={key}
          src={block.src}
          title={block.title}
          color={block.color}
          aspectRatio={block.aspectRatio}
        />
      );

    case 'caption':
      if (block.alignment === 'space-between' && Array.isArray(block.text)) {
        return (
          <CaptionText key={key} alignment="space-between">
            <span>{block.text[0]}</span>
            <span>{block.text[1]}</span>
          </CaptionText>
        );
      }
      return (
        <CaptionText key={key} alignment={block.alignment}>
          <span>{block.text as string}</span>
        </CaptionText>
      );
  }
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main aria-labelledby="project-heading">
      <ScrollPaddingShell
        bgColor={project.bgColor}
        estimatedContentBottom={estimateContentBottomMobile(project.contentBlocks)}
        className="
          pt-[var(--hero-padding-top-mobile)] md:pt-[var(--hero-padding-top-desktop)]
          pb-[var(--page-padding-bottom-mobile)] md:pb-[var(--page-padding-bottom-desktop)]
        "
      >
        <PageWrapper bgColor={project.wrapperColor}>
          <ProjectIntro
            id="project-heading"
            heading={project.intro.heading}
            body={project.intro.body}
          />
          {project.contentBlocks.map((block, i) => renderBlock(block, i))}
        </PageWrapper>
      </ScrollPaddingShell>

      <ContactFooter showClocks={false} footerBarGap />
    </main>
  );
}
