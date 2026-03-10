import { CreateCartProductRequ } from "./Create-Cart-Product-Requ";

export interface CreateCartBodyRequ {
  userId: number;
  date: string;
  products: CreateCartProductRequ[];
}