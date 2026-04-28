import { supabase } from "@/lib/supabase";
import DeleteButton from "./delete-button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellerDashboard() {
  // Check logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "seller") {
    redirect("/become-seller");
  }

  // Only seller reaches here
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("id", { ascending: false });

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900">
      {/* Header */}
      <section className="bg-green-950 text-white px-6 py-10">
        <h1 className="text-5xl font-black">
          Seller Dashboard
        </h1>

        <p className="text-green-100 mt-2">
          Manage your products and sales.
        </p>
      </section>

      <section className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Your Products
          </h2>

          <Link
            href="/seller/add-product"
            className="bg-orange-500 text-white px-6 py-3 rounded-2xl"
          >
            + Add Product
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="h-52 bg-stone-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {product.category} • {product.country}
                </p>

                <p className="text-orange-500 font-black text-2xl mt-3">
                  ${product.price}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
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

        {products?.length === 0 && (
          <p className="text-gray-500 mt-10">
            No products yet.
          </p>
        )}
      </section>
    </main>
  );
}