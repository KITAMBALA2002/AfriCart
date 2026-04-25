"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
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

  const updateOrderStatus = async (
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
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-green-100 font-medium">
            Admin Panel
          </p>

          <h1 className="text-5xl font-black mt-2">
            Orders Management
          </h1>

          <p className="text-green-100 mt-2">
            View and manage customer orders
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
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id}
                    </p>
                    <p className="font-semibold text-lg">
                      {order.customer_name}
                    </p>
                    <p className="text-gray-600">
                      {order.customer_email}
                    </p>
                    <p className="text-gray-600">
                      {order.customer_phone}
                    </p>
                    <p className="text-gray-600">
                      {order.delivery_address}
                    </p>
                    <p className="font-semibold mt-2">
                      Total: ${order.total_amount}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <div className="mt-4 space-y-2">
                      {order.status !== "processing" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "processing")
                          }
                          className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Mark Processing
                        </button>
                      )}
                      {order.status !== "shipped" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "shipped")
                          }
                          className="block w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status !== "delivered" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "delivered")
                          }
                          className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "cancelled")
                          }
                          className="block w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
