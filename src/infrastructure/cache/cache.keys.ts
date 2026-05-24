export const CacheKeys = {
  projectsList: () => 'portfolio:projects:list',
  project: (id: number) => `portfolio:project:${id}`,
  projectImages: (projectId: number) => `portfolio:project:${projectId}:images`,
  image: (id: number) => `portfolio:image:${id}`,
  imageBySlug: (slug: string) => `portfolio:image:slug:${slug}`,
} as const;
