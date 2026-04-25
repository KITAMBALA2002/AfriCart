export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-4xl font-bold text-red-500">
          Product not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900">
      {/* Header */}
      <section className="bg-green-950 text-white px-6 py-10">
        <p className="text-green-100 mb-2">
          Products / {product.name}
        </p>

        <h1 className="text-5xl font-black">
          {product.name}
        </h1>
      </section>

      {/* Content */}
      <section className="px-6 py-12 grid lg:grid-cols-2 gap-10">
        {/* Product Visual */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="h-[420px] bg-stone-100 rounded-3xl overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <span className="bg-green-100 text-green-900 px-3 py-1 rounded-full text-sm">
            {product.country}
          </span>

          <h2 className="text-4xl font-bold mt-4 mb-4">
            {product.name}
          </h2>

          <p className="text-sm text-gray-500 mb-2">
            {product.category}
          </p>

          <p className="text-orange-500 text-3xl font-black mb-6">
            ${product.price}
          </p>

          <p className="text-gray-600 leading-7 mb-8">
            Trusted African marketplace product sold through AfriCart.
            Quality checked and ready for delivery.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-stone-100 rounded-2xl p-4">
              🚚 Fast Delivery
            </div>
            <div className="bg-stone-100 rounded-2xl p-4">
              💳 Mobile Money
            </div>
            <div className="bg-stone-100 rounded-2xl p-4">
              🛡️ Verified Seller
            </div>
            <div className="bg-stone-100 rounded-2xl p-4">
              ↩️ Easy Returns
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-orange-500 text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition">
              Add to Cart
            </button>

            <button className="bg-green-900 text-white px-8 py-4 rounded-2xl hover:bg-green-950 transition">
              Buy Now
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Product ID: {product.id}
          </p>
        </div>
      </section>
    </main>
  );
}