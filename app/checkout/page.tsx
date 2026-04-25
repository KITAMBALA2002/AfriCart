"use client";

import { useEffect, useState } from "react";
import { getCart, saveCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    payment_method: "",
  });

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
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
      setMsg("Order failed");
      return;
    }

    saveCart([]);
    setItems([]);
    setMsg("Order placed successfully!");
  };

  const inputStyle =
    "w-full border-2 border-gray-300 bg-white text-gray-900 p-4 rounded-2xl text-lg font-medium focus:outline-none focus:border-orange-500";

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="border-b bg-gradient-to-r from-green-950 to-green-800 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-300 font-semibold tracking-wide">
            SECURE CHECKOUT
          </p>

          <h1 className="text-5xl md:text-6xl font-black mt-2 leading-tight">
            Complete Your Order
          </h1>

          <p className="text-green-100 mt-3 text-lg">
            Fast delivery across Africa with trusted payment methods.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 bg-white border rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-black mb-6">
            Delivery Details
          </h2>

          <div className="space-y-5">
            <input
              placeholder="Full Name"
              className={inputStyle}
              onChange={(e) =>
                setForm({
                  ...form,
                  customer_name: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone Number"
              className={inputStyle}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <div className="grid md:grid-cols-2 gap-5">
              <input
                placeholder="Country"
                className={inputStyle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    country: e.target.value,
                  })
                }
              />

              <input
                placeholder="City / Area"
                className={inputStyle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value,
                  })
                }
              />
            </div>

            <textarea
              placeholder="Delivery Address"
              className={`${inputStyle} h-32`}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />

            <h3 className="text-2xl font-black pt-4">
              Payment Method
            </h3>

            <select
              className={inputStyle}
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
              <option>Airtel Money</option>
              <option>M-Pesa</option>
              <option>MTN MoMo</option>
              <option>Cash on Delivery</option>
              <option>Bank Transfer</option>
            </select>

            <button
              onClick={placeOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl text-xl font-black transition"
            >
              Place Order
            </button>

            {msg && (
              <p className="text-lg font-semibold text-gray-700">
                {msg}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="bg-white border rounded-3xl shadow-lg p-8 h-fit sticky top-6">
          <h2 className="text-3xl font-black">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b pb-3"
              >
                <div>
                  <p className="font-bold">
                    {item.name}
                  </p>
                  <p className="text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>

                <p className="font-bold">
                  $
                  {item.price *
                    item.qty}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between text-3xl font-black">
            <span>Total</span>
            <span className="text-orange-500">
              ${total}
            </span>
          </div>

          <div className="mt-6 space-y-2 text-gray-700 font-medium">
            <p>✓ Secure checkout</p>
            <p>✓ Trusted African sellers</p>
            <p>✓ Regional delivery support</p>
          </div>
        </div>
      </section>
    </main>
  );
}