"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DeleteButton from "./delete-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SellerDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-green-50 pb-24">

      {/* Header */}
      <section className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 text-white px-5 py-7 rounded-b-3xl shadow-lg">
        <p className="text-green-100 text-sm">
          Welcome back
        </p>

        <h1 className="text-3xl md:text-4xl font-black mt-1">
          Seller Dashboard
        </h1>

        <p className="text-green-100 mt-1 text-sm">
          Manage your store professionally
        </p>
      </section>

      {/* Top Row */}
      <section className="px-4 mt-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">
            My Products
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {products.length} items listed
          </p>
        </div>

        <Link
          href="/seller/add-product"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold shadow-md transition"
        >
          + Add
        </Link>
      </section>

      {/* Grid */}
      <section className="px-4 mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden border border-stone-100"
          >
            <div className="aspect-square bg-stone-100 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>

            <div className="p-4">

              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 min-h-[42px]">
                {product.name}
              </h3>

              <p className="text-orange-500 font-black text-xl mt-3">
                ${product.price}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">

                <a
                  href={`/seller/edit/${product.id}`}
                  className="text-center bg-blue-50 text-blue-700 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
                >
                  Edit
                </a>

                <DeleteButton id={product.id} />

              </div>
            </div>
          </div>
        ))}

      </section>

      {/* Empty */}
      {products.length === 0 && (
        <div className="text-center mt-16 px-4">
          <div className="text-6xl">📦</div>

          <h3 className="text-2xl font-black mt-4 text-gray-900">
            No Products Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Add your first product and start selling.
          </p>
        </div>
      )}

    </main>
  );
}