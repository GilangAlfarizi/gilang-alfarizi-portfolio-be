import {
  CertificatePaginationParams,
  PaginatedCertificates,
} from './certificate-pagination';

export const CERTIFICATE_REPOSITORY = Symbol('CERTIFICATE_REPOSITORY');

export interface CertificateRepository {
  findPaginated(params: CertificatePaginationParams): Promise<PaginatedCertificates>;
}
