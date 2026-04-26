"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddToCartButton({
  product,
}: {
  product: any;
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({
          quantity: existing.quantity + 1,
        })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        });
    }

    setLoading(false);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition disabled:opacity-60"
    >
      {loading
        ? "Adding..."
        : added
        ? "✓ Added"
        : "Add to Cart"}
    </button>
  );
}