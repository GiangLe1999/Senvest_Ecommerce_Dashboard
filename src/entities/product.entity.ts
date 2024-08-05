import type { Variant } from "@/views/apps/ecommerce/products/add/ProductAddOrEditForm";
import type { LocalizedString } from "./common.entity";
import type { Category } from "./category.entity";

export interface Product {
  _id: string;
  name: LocalizedString;
  slug: LocalizedString;
  description: LocalizedString;
  images: string[];
  products: string[];
  status: string;
  category: Category;
  variants: Variant[];
  videos?: string[];
}
