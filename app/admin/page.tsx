"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    loadOrders();
  };

  const badgeColor = (status: string) => {
    if (status === "Delivered")
      return "bg-green-100 text-green-700";
    if (status === "Processing")
      return "bg-blue-100 text-blue-700";

    return "bg-orange-100 text-orange-700";
  };

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900">
      {/* Header */}
      <section className="bg-green-950 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-300 font-semibold">
            ADMIN PANEL
          </p>

          <h1 className="text-5xl font-black mt-2">
            Orders Dashboard
          </h1>

          <p className="text-green-100 mt-2">
            Manage customer orders across AfriCart.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow text-center">
            <p className="text-2xl font-bold">
              No orders yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-lg p-6"
              >
                {/* Top Row */}
                <div className="grid md:grid-cols-4 gap-5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-black text-xl">
                      #{order.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>
                    <p className="font-bold">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Location
                    </p>
                    <p className="font-bold">
                      {order.country}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.city}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>
                    <p className="font-black text-2xl text-orange-500">
                      ${order.total}
                    </p>
                  </div>
                </div>

                {/* Middle */}
                <div className="mt-6 flex flex-wrap gap-3 items-center">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${badgeColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <span className="text-sm text-gray-600">
                    Payment: {order.payment_method}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  <button
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "Pending"
                      )
                    }
                    className="bg-orange-500 text-white py-3 rounded-2xl font-bold"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "Processing"
                      )
                    }
                    className="bg-blue-500 text-white py-3 rounded-2xl font-bold"
                  >
                    Processing
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "Delivered"
                      )
                    }
                    className="bg-green-600 text-white py-3 rounded-2xl font-bold"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}