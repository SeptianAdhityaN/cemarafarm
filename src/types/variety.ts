export interface Variety {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}