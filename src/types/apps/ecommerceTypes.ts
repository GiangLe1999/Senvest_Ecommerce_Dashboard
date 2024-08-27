import type { LocalizedString } from "@/entities/common.entity";

export type Customer = {
  id: number;
  customer: string;
  customerId: string;
  email: string;
  country: string;
  countryCode: string;
  countryFlag?: string;
  order: number;
  totalSpent: number;
  avatar: string;
  status?: string;
  contact?: string;
};

export type ReferralsType = {
  id: number;
  user: string;
  email: string;
  avatar: string;
  referredId: number;
  status: string;
  value: string;
  earning: string;
};

export type ReviewType = {
  _id: string;
  product: {name: LocalizedString};
  variant: {fragrance: string, images: string[]};
  email: string;
  name: string;
  status: "Pending" | "Published";
  createdAt: string;
  rating: number;
  comment:string;
};

export type ProductType = {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  slug: LocalizedString;
  category: { name: LocalizedString; image?: string };
  price: string;
  status: string;
  totalQuantitySold: number;
  totalSales: number;
  variants: {
    color: string;
    stock: number;
    price: number;
    discountedPrice?: number;
    discountedFrom?: string;
    discountedTo?: string;
    images: string[];
  }[];
};

export type OrderType = {
  id: number;
  order: string;
  customer: string;
  email: string;
  avatar: string;
  payment: number;
  status: string;
  spent: number;
  method: string;
  date: string;
  time: string;
  methodNumber: number;
};

export type ECommerceType = {
  orderData: OrderType[];
  customerData: Customer[];
  reviews: ReviewType[];
  referrals: ReferralsType[];
};
