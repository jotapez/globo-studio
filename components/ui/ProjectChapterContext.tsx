'use client';

import { createContext, useContext } from 'react';

interface ProjectChapterContextValue {
  chapterLabel: string | null;
  setChapterLabel: (label: string | null) => void;
}

export const ProjectChapterContext = createContext<ProjectChapterContextValue>({
  chapterLabel: null,
  setChapterLabel: () => {},
});

export const useProjectChapter = () => useContext(ProjectChapterContext);
