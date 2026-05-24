import * as Joi from 'joi';

class Envs {
  port!: number;
  databaseUrl!: string;
  imagekitPublicKey!: string;
  imagekitPrivateKey!: string;
  imagekitUrlEndpoint!: string;
  redisUrl?: string;
  redisToken?: string;
}

export const validationSchema = Joi.object({
  port: Joi.number().required(),
  databaseUrl: Joi.string().required(),
  imagekitPublicKey: Joi.string().required(),
  imagekitPrivateKey: Joi.string().required(),
  imagekitUrlEndpoint: Joi.string().required(),
  redisUrl: Joi.string().optional().allow(''),
  redisToken: Joi.string().optional().allow(''),
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
  });

  if (error) throw new Error(error.message);

  return value;
};
