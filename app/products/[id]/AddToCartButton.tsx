"use client";

import { addToCart } from "@/lib/cart";

export default function AddToCartButton({
  product,
}: {
  product: any;
}) {
  return (
    <button
      onClick={() => {
        addToCart(product);
        alert("Added to cart");
      }}
      className="bg-orange-500 text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition"
    >
      Add to Cart
    </button>
  );
}