import { SkillTypeValue } from '@domain/skill';

export const CacheKeys = {
  projectsList: () => 'portfolio:projects:list',
  project: (id: number) => `portfolio:project:${id}`,
  projectImages: (projectId: number) => `portfolio:project:${projectId}:images`,
  image: (id: number) => `portfolio:image:${id}`,
  imageBySlug: (slug: string) => `portfolio:image:slug:${slug}`,
  certificatesList: (page: number, pageSize: number) =>
    `portfolio:certificates:list:page:${page}:size:${pageSize}`,
  skillsList: () => 'portfolio:skills:list',
  skillsByType: (type: SkillTypeValue) => `portfolio:skills:type:${type}`,
} as const;
