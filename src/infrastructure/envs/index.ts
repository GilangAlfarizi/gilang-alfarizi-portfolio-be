import * as Joi from 'joi';

class Envs {
  port!: number;
  databaseUrl!: string;
  imagekitPublicKey!: string;
  imagekitPrivateKey!: string;
  imagekitUrlEndpoint!: string;
  redisUrl?: string;
  redisToken?: string;
  cacheTtlProjectsList!: number;
  cacheTtlProjectDetail!: number;
  cacheTtlImages!: number;
  cacheTtlCertificates!: number;
  cacheTtlSkills!: number;
  corsOrigins!: string[];
}

const parseCorsOrigins = (value?: string): string[] => {
  const raw = value?.trim() || 'http://localhost:5173';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const validationSchema = Joi.object({
  port: Joi.number().required(),
  databaseUrl: Joi.string().required(),
  imagekitPublicKey: Joi.string().required(),
  imagekitPrivateKey: Joi.string().required(),
  imagekitUrlEndpoint: Joi.string().required(),
  redisUrl: Joi.string().optional().allow(''),
  redisToken: Joi.string().optional().allow(''),
  cacheTtlProjectsList: Joi.number().default(300),
  cacheTtlProjectDetail: Joi.number().default(600),
  cacheTtlImages: Joi.number().default(300),
  cacheTtlCertificates: Joi.number().default(600),
  cacheTtlSkills: Joi.number().default(600),
  corsOrigins: Joi.array().items(Joi.string()).min(1),
});

export const envsConfig = (): Envs => {
  const { error, value } = validationSchema.validate({
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL!,
    imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    redisUrl: process.env.REDIS_URL,
    redisToken: process.env.REDIS_TOKEN,
    cacheTtlProjectsList: Number(process.env.CACHE_TTL_PROJECTS_LIST ?? 300),
    cacheTtlProjectDetail: Number(process.env.CACHE_TTL_PROJECT_DETAIL ?? 600),
    cacheTtlImages: Number(process.env.CACHE_TTL_IMAGES ?? 300),
    cacheTtlCertificates: Number(process.env.CACHE_TTL_CERTIFICATES ?? 600),
    cacheTtlSkills: Number(process.env.CACHE_TTL_SKILLS ?? 600),
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  });

  if (error) throw new Error(error.message);

  return value;
};
