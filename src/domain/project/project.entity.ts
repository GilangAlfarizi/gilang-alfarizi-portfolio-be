import { Image } from '@domain/image';

export type Project = {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
};

export type CreateProjectInput = {
  title: string;
  description?: string | null;
};

export type UpdateProjectInput = {
  title?: string;
  description?: string | null;
};
