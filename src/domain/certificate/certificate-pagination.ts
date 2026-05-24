import { Certificate } from './certificate.entity';

export type CertificatePaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedCertificates = {
  data: Certificate[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
