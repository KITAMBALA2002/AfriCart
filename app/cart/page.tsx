"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data: cartRows } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (!cartRows || cartRows.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    const ids = cartRows.map((r) => r.product_id);

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);

    const merged = cartRows.map((row) => {
      const product = products?.find(
        (p) => p.id === row.product_id
      );

      return {
        cart_id: row.id,
        qty: row.quantity,
        ...product,
      };
    });

    setItems(merged);
    setLoading(false);
  };

  const updateQty = async (
    id: number,
    qty: number
  ) => {
    if (qty <= 0) return removeItem(id);

    await supabase
      .from("cart_items")
      .update({ quantity: qty })
      .eq("id", id);

    loadCart();
  };

  const removeItem = async (id: number) => {
    await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);

    loadCart();
  };

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  return (
    <main className="min-h-screen bg-stone-50 pb-28">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 text-white px-4 md:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase tracking-widest text-sm text-green-100 font-semibold">
            Secure Checkout
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-2">
            Your Cart
          </h1>

          <p className="text-green-100 mt-2 text-base md:text-lg">
            Review your items and continue to payment.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <p className="font-semibold text-gray-700">
                Loading cart...
              </p>
            </div>
          )}

          {!loading &&
            items.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm border">
                <div className="text-6xl">
                  🛒
                </div>

                <h2 className="text-3xl font-black mt-4 text-gray-900">
                  Cart is empty
                </h2>

                <p className="text-gray-500 mt-2">
                  Add products to start shopping.
                </p>

                <Link
                  href="/products"
                  className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
                >
                  Browse Products
                </Link>
              </div>
            )}

          {items.map((item) => (
            <div
              key={item.cart_id}
              className="bg-white rounded-3xl p-4 md:p-5 border border-stone-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 md:w-28 md:h-28 bg-stone-100 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-lg md:text-xl text-gray-900 leading-tight">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Qty: {item.qty}
                  </p>

                  <p className="text-orange-500 font-black text-2xl mt-2">
                    ${item.price}
                  </p>

                  {/* Controls */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => updateQty(item.cart_id, item.qty - 1)}
                      className="w-10 h-10 rounded-xl bg-green-900 text-white hover:bg-green-950 font-black text-xl transition"
                    >
                      −
                    </button>

                    <span className="w-10 text-center font-black text-xl text-gray-900">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => updateQty(item.cart_id, item.qty + 1)}
                      className="w-10 h-10 rounded-xl bg-orange-500 text-white hover:bg-orange-600 font-black text-xl transition"
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        removeItem(
                          item.cart_id
                        )
                      }
                      className="ml-auto text-red-500 font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-gray-500 font-medium">
                  Subtotal
                </span>

                <span className="text-xl font-black text-gray-900">
                  $
                  {item.price *
                    item.qty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:block">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg sticky top-6">
            <h3 className="text-2xl font-black text-gray-900">
              Order Summary
            </h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>
                  {items.length}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-2xl font-black text-gray-900">
                <span>Total</span>
                <span>
                  ${total}
                </span>
              </div>
            </div>

            <a href="/checkout">
              <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition">
                Proceed to Checkout
              </button>
            </a>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Secure payment with trusted methods
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Checkout Bar */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Total
            </p>
            <p className="text-2xl font-black text-gray-900">
              ${total}
            </p>
          </div>

          <a href="/checkout">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black transition">
              Checkout
            </button>
          </a>
        </div>
      )}
    </main>
  );
}