import { Image } from './image.entity';

export const IMAGE_REPOSITORY = Symbol('IMAGE_REPOSITORY');

export type CreateImageInput = {
  slug: string;
  image: string;
  description?: string | null;
  projectId: number;
};

export type UpdateImageInput = {
  slug?: string;
  description?: string | null;
};

export interface ImageRepository {
  findByProjectId(projectId: number): Promise<Image[]>;
  findById(id: number): Promise<Image | null>;
  findBySlug(slug: string): Promise<Image | null>;
  existsBySlug(slug: string, excludeId?: number): Promise<boolean>;
  create(data: CreateImageInput): Promise<Image>;
  update(id: number, data: UpdateImageInput): Promise<Image>;
  delete(id: number): Promise<void>;
}
