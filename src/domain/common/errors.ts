export class ProjectNotFoundError extends Error {
  constructor(id: number) {
    super(`Project with id ${id} not found`);
    this.name = 'ProjectNotFoundError';
  }
}

export class ImageNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`Image not found: ${identifier}`);
    this.name = 'ImageNotFoundError';
  }
}

export class SlugConflictError extends Error {
  constructor(slug: string) {
    super(`Slug "${slug}" is already in use`);
    this.name = 'SlugConflictError';
  }
}
