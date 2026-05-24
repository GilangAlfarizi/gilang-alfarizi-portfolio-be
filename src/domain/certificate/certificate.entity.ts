export type Certificate = {
  id: number;
  title: string;
  issuer: string | null;
  image: string | null;
  validUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
