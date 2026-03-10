import { CreateCartProductRequ } from "./Create-Cart-Product-Requ";

export interface CreateCartResp {
  id: number;
  userId: number;
  date: string;
  products: CreateCartProductRequ[];
}