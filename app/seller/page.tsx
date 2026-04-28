"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import DeleteButton from "./delete-button";

export default function SellerDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [sellerName, setSellerName] = useState("Seller");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role,email")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "seller") {
      router.push("/become-seller");
      return;
    }

    setSellerName(
      profile?.email?.split("@")[0] || "Seller"
    );

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  const totalProducts = products.length;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-50">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900 pb-24">
      {/* Header */}
      <section className="bg-green-950 text-white px-4 md:px-6 py-8 rounded-b-3xl shadow">
        <p className="text-green-200 text-sm">
          Welcome back
        </p>

        <h1 className="text-3xl md:text-5xl font-black mt-1">
          {sellerName}
        </h1>

        <p className="text-green-100 mt-2 text-sm md:text-base">
          Manage your store and grow sales.
        </p>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-6 -mt-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">
              Products
            </p>

            <h2 className="text-3xl font-black mt-1">
              {totalProducts}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">
              Status
            </p>

            <h2 className="text-xl font-black mt-2 text-green-700">
              Active
            </h2>
          </div>
        </div>
      </section>

      {/* Top Action */}
      <section className="px-4 md:px-6 mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-black">
          My Products
        </h2>

        <Link
          href="/seller/add-product"
          className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm"
        >
          + Add
        </Link>
      </section>

      {/* Products */}
      <section className="px-4 md:px-6 mt-5">
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No products yet.
            </p>

            <Link
              href="/seller/add-product"
              className="inline-block mt-4 bg-orange-500 text-white px-5 py-3 rounded-2xl font-bold"
            >
              Upload First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-28 md:h-52 object-cover"
                />

                <div className="p-3 md:p-5">
                  <h3 className="font-bold text-sm md:text-xl line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  <p className="text-orange-500 font-black text-lg md:text-2xl mt-2">
                    ${product.price}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <a
                      href={`/seller/edit/${product.id}`}
                      className="bg-blue-500 text-white py-2 text-sm rounded-xl text-center"
                    >
                      Edit
                    </a>

                    <DeleteButton
                      id={product.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mobile Floating Add Button */}
      <Link
        href="/seller/add-product"
        className="md:hidden fixed bottom-5 right-5 bg-orange-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-xl"
      >
        +
      </Link>
    </main>
  );
}