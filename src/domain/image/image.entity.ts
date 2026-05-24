export type Image = {
  id: number;
  slug: string;
  image: string;
  description: string | null;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
};
