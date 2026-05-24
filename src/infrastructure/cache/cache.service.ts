import { envsConfig } from '@infrastructure/envs';
import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class CacheService {
  private readonly redis: Redis | null;
  readonly enabled: boolean;

  constructor() {
    const env = envsConfig();
    if (env.redisUrl && env.redisToken) {
      this.redis = new Redis({
        url: env.redisUrl,
        token: env.redisToken,
      });
      this.enabled = true;
    } else {
      this.redis = null;
      this.enabled = false;
    }
  }

  get ttl() {
    const env = envsConfig();
    return {
      projectsList: env.cacheTtlProjectsList,
      projectDetail: env.cacheTtlProjectDetail,
      images: env.cacheTtlImages,
      certificates: env.cacheTtlCertificates,
      skills: env.cacheTtlSkills,
    };
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.redis) {
      return null;
    }
    const value = await this.redis.get<T>(key);
    return value ?? null;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.enabled || !this.redis) {
      return;
    }
    await this.redis.set(key, value, { ex: ttlSeconds });
  }

  async del(...keys: string[]): Promise<void> {
    if (!this.enabled || !this.redis || keys.length === 0) {
      return;
    }
    await this.redis.del(...keys);
  }

  async ping(): Promise<'up' | 'down' | 'disabled'> {
    if (!this.enabled || !this.redis) {
      return 'disabled';
    }
    try {
      const result = await this.redis.ping();
      return result === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }
}
