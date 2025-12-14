export type Order = {
  price: number;
  size: number;
};

export const asks: Order[] = Array.from({ length: 12 }).map((_, i) => ({
  price: 90450 + i * 5,
  size: Math.floor(Math.random() * 500 + 50),
}));

export const bids: Order[] = Array.from({ length: 12 }).map((_, i) => ({
  price: 90450 - i * 5,
  size: Math.floor(Math.random() * 500 + 50),
}));
