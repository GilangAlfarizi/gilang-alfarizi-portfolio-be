import { Certificate } from './certificate.entity';

export const CERTIFICATE_REPOSITORY = Symbol('CERTIFICATE_REPOSITORY');

export interface CertificateRepository {
  findAll(): Promise<Certificate[]>;
}
