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
import { ContactFooterV3 } from '@/components/ui/ContactFooterV3';
import { TwoImageLayout } from '@/components/ui/TwoImageLayout';
import { ScrollPaddingShell } from '@/components/ui/ScrollPaddingShell';
import { VideoBlock } from '@/components/ui/VideoBlock';
import { PasswordGate } from '@/components/ui/PasswordGate';
import { ChapterTracker } from '@/components/ui/ChapterTracker';

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
    ...(project.footerThemeColor && { themeColor: project.footerThemeColor }),
  };
}

// ─── block renderer ───────────────────────────────────────────────────────────

function renderBlock(block: ContentBlock, i: number): React.ReactNode {
  const key = `${block.type}-${i}`;
  const sentinel = block.chapterLabel ? (
    <div
      key={`sentinel-${i}`}
      data-chapter-sentinel={block.chapterLabel}
      aria-hidden="true"
      style={{ height: 0, overflow: 'hidden' }}
    />
  ) : null;
  const wrap = (node: React.ReactNode) =>
    sentinel ? <React.Fragment key={key}>{sentinel}{node}</React.Fragment> : node;

  switch (block.type) {
    case 'hero':
      return wrap(
        <HeroImageLayout
          key={key}
          src={block.src}
          mobileSrc={block.mobileSrc}
          alt={block.alt}
          priority={block.priority}
        />
      );

    case 'single-white':
      return wrap(
        <SingleImageWhiteCard
          key={key}
          src={block.src}
          alt={block.alt}
          aspectRatio={block.aspectRatio}
        />
      );

    case 'single-color':
      return wrap(
        <SingleImageColorBackground
          key={key}
          src={block.src}
          alt={block.alt}
          color={block.color}
          aspectRatio={block.aspectRatio}
        />
      );

    case 'full-bleed':
      return wrap(
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
      return wrap(
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
      return wrap(
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
        return wrap(
          <CaptionText key={key} alignment="space-between">
            <span>{block.text[0]}</span>
            <span>{block.text[1]}</span>
          </CaptionText>
        );
      }
      return wrap(
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

  const projectContent = (
    <>
      {project.footerThemeColor && (
        <style>{`html, body { background-color: ${project.footerThemeColor} !important; }`}</style>
      )}
      <main aria-labelledby="project-heading">
        <ScrollPaddingShell
          bgColor={project.bgColor}
          estimatedContentBottom={estimateContentBottomMobile(project.contentBlocks)}
          className="
            pt-[var(--hero-padding-top-mobile)] md:pt-[var(--hero-padding-top-desktop)]
          "
        >
          <PageWrapper bgColor={project.wrapperColor}>
            <ProjectIntro
              id="project-heading"
              heading={project.intro.heading}
              body={project.intro.body}
              extraBody={project.intro.extraBody}
              bodyColor={project.intro.extraBody ? 'primary' : 'muted'}
            />
            <ChapterTracker />
            {project.contentBlocks.map((block, i) => renderBlock(block, i))}
          </PageWrapper>
        </ScrollPaddingShell>

        <div
          data-chapter-sentinel=""
          aria-hidden="true"
          style={{ height: 0, overflow: 'hidden' }}
        />
        <ContactFooterV3
          bgColor={project.footerBgColor}
          theme={project.footerTheme}
        />
      </main>
    </>
  );

  if (project.passwordProtected && project.password) {
    return (
      <PasswordGate
        password={project.password}
        slug={project.slug}
        bgColor={project.bgColor}
        accentColor={project.footerThemeColor ?? '#000000'}
        footerBgColor={project.footerBgColor}
        footerTheme={project.footerTheme}
      >
        {projectContent}
      </PasswordGate>
    );
  }

  return projectContent;
}
