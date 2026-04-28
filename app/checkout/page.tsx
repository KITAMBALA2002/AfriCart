"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    payment_method: "",
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;
    if (!user) return;

    const { data: cartRows } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (!cartRows || cartRows.length === 0) {
      setItems([]);
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
  };

  const updateQty = async (id: number, qty: number) => {
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
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (
      !form.customer_name ||
      !form.phone ||
      !form.country ||
      !form.city ||
      !form.address ||
      !form.payment_method
    ) {
      setMsg("Please complete all fields.");
      return;
    }

    if (items.length === 0) {
      setMsg("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMsg("Placing order...");

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          ...form,
          items,
          total,
          status: "Pending",
        },
      ]);

    if (error) {
      setMsg("Order failed.");
      setLoading(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", session?.user?.id);

    setItems([]);
    setMsg("✅ Order placed successfully!");
    setLoading(false);
  };

  const input =
    "w-full bg-white border border-stone-200 px-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400 text-gray-900";

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-orange-50 pb-24">

      {/* Header */}
      <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 text-white px-4 py-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black">
            Checkout
          </h1>

          <p className="text-green-100 mt-2 text-lg">
            Complete your order securely
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">

        {/* LEFT FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-stone-100 p-6 md:p-8">

          <div className="mb-6">
            <p className="text-orange-500 font-bold uppercase text-sm tracking-wider">
              Delivery
            </p>

            <h2 className="text-3xl font-black text-gray-900">
              Shipping Details
            </h2>
          </div>

          <div className="space-y-4">

            <input
              placeholder="Full Name"
              className={input}
              onChange={(e) =>
                setForm({
                  ...form,
                  customer_name: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone Number"
              className={input}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <div className="grid md:grid-cols-2 gap-4">

              <input
                placeholder="Country"
                className={input}
                onChange={(e) =>
                  setForm({
                    ...form,
                    country: e.target.value,
                  })
                }
              />

              <input
                placeholder="City"
                className={input}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value,
                  })
                }
              />

            </div>

            <textarea
              placeholder="Full Address"
              className={`${input} h-32 resize-none`}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />

            <select
              className={input}
              onChange={(e) =>
                setForm({
                  ...form,
                  payment_method: e.target.value,
                })
              }
            >
              <option value="">
                Select Payment Method
              </option>

              <option>M-Pesa</option>
              <option>Airtel Money</option>
              <option>Cash on Delivery</option>
              <option>Bank Transfer</option>
            </select>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition shadow-md"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            {msg && (
              <p className="text-center font-semibold text-green-700 pt-2">
                {msg}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-6 h-fit lg:sticky lg:top-24">

          <h2 className="text-3xl font-black text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-5">

            {items.map((item) => (
              <div
                key={item.cart_id}
                className="border-b border-stone-200 pb-5"
              >
                <div className="flex gap-3">

                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-stone-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>

                    <p className="text-orange-500 font-black mt-1">
                      ${item.price}
                    </p>

                    <div className="flex items-center gap-2 mt-3">

                      <button
                        onClick={() =>
                          updateQty(item.cart_id, item.qty - 1)
                        }
                        className="w-9 h-9 rounded-xl bg-stone-100 text-gray-900 font-bold hover:bg-stone-200"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-black text-lg text-gray-900">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item.cart_id, item.qty + 1)
                        }
                        className="w-9 h-9 rounded-xl bg-stone-100 text-gray-900 font-bold hover:bg-stone-200"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          removeItem(item.cart_id)
                        }
                        className="ml-auto text-red-500 text-sm font-semibold"
                      >
                        Remove
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

          <div className="mt-6 pt-5 border-t border-stone-200 space-y-3">

            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between text-3xl font-black text-gray-900">
              <span>Total</span>
              <span>${total}</span>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}