import type { LocalizedString } from "./common.entity";

export interface Category {
  _id: string;
  name: LocalizedString;
  slug: LocalizedString;
  description: LocalizedString;
  image?: string;
  status: string;
  products: string[];
}
