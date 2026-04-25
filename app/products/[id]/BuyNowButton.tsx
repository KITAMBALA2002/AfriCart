"use client";

import { addToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

export default function BuyNowButton({
  product,
}: {
  product: any;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        addToCart(product);
        router.push("/checkout");
      }}
      className="bg-green-900 text-white px-8 py-4 rounded-2xl hover:bg-green-950 transition"
    >
      Buy Now
    </button>
  );
}