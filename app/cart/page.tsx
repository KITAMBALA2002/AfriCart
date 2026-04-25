"use client";

import { useEffect, useState } from "react";
import { getCart, saveCart } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const updateQty = (id: number, change: number) => {
    const updated = items
      .map((item) =>
        item.id === id
          ? { ...item, qty: item.qty + change }
          : item
      )
      .filter((item) => item.qty > 0);

    setItems(updated);
    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = items.filter(
      (item) => item.id !== id
    );
    setItems(updated);
    saveCart(updated);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-orange-50 text-gray-900">
      {/* Header */}
      <section className="px-6 py-10 border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-500 font-semibold">
            Secure Checkout Ready
          </p>
          <h1 className="text-5xl font-black mt-2">
            Your Cart
          </h1>
          <p className="text-gray-500 mt-2">
            Review your selected African products.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-sm text-center">
              <p className="text-2xl font-bold">
                Your cart is empty
              </p>
              <p className="text-gray-500 mt-2">
                Add products to continue shopping.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-sm p-5 flex gap-5 items-center"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-28 h-28 rounded-2xl object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-bold text-xl">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    ${item.price} each
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() =>
                        updateQty(item.id, -1)
                      }
                      className="w-10 h-10 rounded-xl bg-stone-100 text-lg"
                    >
                      −
                    </button>

                    <span className="font-bold text-lg min-w-[24px] text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(item.id, 1)
                      }
                      className="w-10 h-10 rounded-xl bg-stone-100 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-2xl text-orange-500">
                    $
                    {item.price * item.qty}
                  </p>

                  <button
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="text-red-500 text-sm mt-3"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="h-fit sticky top-6">
          <div className="bg-white rounded-3xl shadow-sm p-7">
            <h3 className="text-2xl font-black">
              Order Summary
            </h3>

            <div className="mt-6 space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-2xl font-black text-gray-900">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            <a href="/checkout">
              <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold transition">
                Proceed to Checkout
              </button>
            </a>

            <div className="mt-5 text-sm text-gray-500 space-y-2">
              <p>✓ Secure payments</p>
              <p>✓ Trusted African sellers</p>
              <p>✓ Fast regional delivery</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}