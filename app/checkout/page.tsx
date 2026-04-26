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
    "w-full border-2 border-gray-200 p-4 rounded-2xl focus:outline-none focus:border-orange-500";

  return (
    <main className="min-h-screen bg-gradient-to-b from-white-100 via-orange-50 to-green-50 pb-28">

      <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 text-white px-4 py-7 shadow-lg">
        <h1 className="text-4xl font-black">
          Checkout
        </h1>
        <p className="text-green-100">
          Complete your order securely
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">

        {/* FORM */}
        <div className="lg:col-span-2 bg-black rounded-3xl p-6 shadow">

          <h2 className="text-2xl font-black mb-5">
            Delivery Details
          </h2>

          <div className="space-y-4">

            <input
              placeholder="Full Name" 
              className={input}
              onChange={(e)=>
                setForm({...form,customer_name:e.target.value})
              }
            />

            <input
              placeholder="Phone Number"
              className={input}
              onChange={(e)=>
                setForm({...form,phone:e.target.value})
              }
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Country"
                className={input}
                onChange={(e)=>
                  setForm({...form,country:e.target.value})
                }
              />

              <input
                placeholder="City"
                className={input}
                onChange={(e)=>
                  setForm({...form,city:e.target.value})
                }
              />
            </div>

            <textarea
              placeholder="Address"
              className={`${input} h-28`}
              onChange={(e)=>
                setForm({...form,address:e.target.value})
              }
            />

            <select
              className={input}
              onChange={(e)=>
                setForm({...form,payment_method:e.target.value})
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
              className="w-full bg-orange-500 text-whit py-4 rounded-2xl font-black text-lg"
            >
              {loading ? "Placing..." : "Place Order"}
            </button>

            {msg && (
              <p className="font-semibold text-center">
                {msg}
              </p>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-black rounded-3xl p-6 shadow h-fit">

          <h2 className="text-2xl font-black">
            Order Summary
          </h2>

          <div className="mt-5 space-y-4 ">
            {items.map((item) => (
              <div
                key={item.cart_id}
                className="border-b pb-4 "
              >
                <p className="font-bold">
                  {item.name}
                </p>

                <p className="text-orange-500 font-bold">
                  ${item.price}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() =>
                      updateQty(item.cart_id, item.qty - 1)
                    }
                    className="px-3 py-1 bg-gray-200 rounded-xl"
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() =>
                      updateQty(item.cart_id, item.qty + 1)
                    }
                    className="px-3 py-1 bg-gray-100 rounded-xl"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeItem(item.cart_id)
                    }
                    className="ml-auto text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between text-2xl font-black">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </section>
    </main>
  );
}