export function getCart() {
  if (typeof window === "undefined") return [];

  const cart = localStorage.getItem("africart-cart");
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(items: any[]) {
  localStorage.setItem(
    "africart-cart",
    JSON.stringify(items)
  );
}

export function addToCart(product: any) {
  const cart = getCart();

  const existing = cart.find(
    (item: any) => item.id === product.id
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  saveCart(cart);
}