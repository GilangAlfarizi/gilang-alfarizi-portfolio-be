export type Certificate = {
  id: number;
  title: string;
  issuer: string | null;
  issuedAt: string | null;
  image: string | null;
  credential: string | null;
  createdAt: Date;
  updatedAt: Date;
};
