export interface IProduct {
  // typed product model
  id: number; // product id
  title: string; // title
  price: number; // price
  description: string; // description
  category: string; // category
  image: string; // image url
  rating?: { rate: number; count: number }; // optional rating (FakeStore provides it)
}
