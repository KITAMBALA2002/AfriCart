"use client";

import { useEffect, useState } from "react";
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

  const updateQty = async (id:number, qty:number) => {
    if (qty <= 0) return removeItem(id);

    await supabase
      .from("cart_items")
      .update({ quantity: qty })
      .eq("id", id);

    loadCart();
  };

  const removeItem = async (id:number) => {
    await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);

    loadCart();
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50 pb-28">
      
      {/* Header */}
      <section className="bg-green-900 text-white px-4 py-6 shadow-md">
        <h1 className="text-3xl md:text-5xl font-black">
          Your Cart
        </h1>
        <p className="text-green-100 mt-1">
          Ready for checkout
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">

        {/* Items */}
        <div className="lg:col-span-2 space-y-4">

          {loading && (
            <div className="bg-white rounded-3xl p-6 shadow">
              Loading...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="bg-black rounded-3xl p-10 text-center shadow">
              <div className="text-5xl">🛒</div>
              <h2 className="text-2xl font-black mt-4">
                Cart is empty
              </h2>
              <p className="text-gray-500 mt-2">
                Add products to continue shopping.
              </p>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.cart_id}
              className="bg-white rounded-3xl p-4 shadow-md border border-stone-100"
            >
              <div className="flex gap-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 rounded-2xl object-cover"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-lg leading-tight">
                    {item.name}
                  </h2>

                  <p className="text-orange-500 font-black text-xl mt-1">
                    ${item.price}
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() =>
                        updateQty(item.cart_id, item.qty - 1)
                      }
                      className="w-10 h-10 rounded-xl bg-stone-100 text-lg"
                    >
                      −
                    </button>

                    <span className="font-bold w-8 text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(item.cart_id, item.qty + 1)
                      }
                      className="w-10 h-10 rounded-xl bg-stone-100 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="font-black text-lg">
                  ${item.price * item.qty}
                </p>

                <button
                  onClick={() =>
                    removeItem(item.cart_id)
                  }
                  className="text-red-500 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Summary */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-6">
            <h3 className="text-2xl font-black">
              Summary
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between text-2xl font-black pt-4 border-t">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <a href="/checkout">
              <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black">
                Checkout
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Checkout */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Total
            </p>
            <p className="text-2xl font-black">
              ${total}
            </p>
          </div>

          <a href="/checkout">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black">
              Checkout
            </button>
          </a>
        </div>
      )}
    </main>
  );
}