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
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "seller") {
      router.push("/become-seller");
      return;
    }

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900 p-6">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-black">
          Seller Dashboard
        </h1>

        <Link
          href="/seller/add-product"
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            <img
              src={product.image_url}
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="font-bold text-xl">
                {product.name}
              </h3>

              <p className="text-orange-500 font-black text-2xl mt-2">
                ${product.price}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <a
                  href={`/seller/edit/${product.id}`}
                  className="bg-blue-500 text-white py-3 rounded-2xl text-center"
                >
                  Edit
                </a>

                <DeleteButton id={product.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}