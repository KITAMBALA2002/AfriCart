"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddProductPage() {
  const countries = [
    "Malawi",
    "Kenya",
    "Nigeria",
    "Ghana",
    "South Africa",
    "Zambia",
    "Tanzania",
    "Rwanda",
    "Uganda",
    "Botswana",
    "Namibia",
    "Zimbabwe",
    "Ethiopia",
    "Senegal",
    "Cameroon",
    "Mozambique",
    "DR Congo",
    "Angola",
    "Egypt",
    "Morocco",
  ];

  const categories = [
    "Fashion",
    "Food",
    "Electronics",
    "Home",
    "Crafts",
    "Beauty",
    "Agriculture",
    "Books",
    "Health",
    "Automotive",
  ];

  const [form, setForm] = useState({
    name: "",
    price: "",
    country: "",
    category: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("Uploading...");

    try {
      let imageUrl = "";

      if (file) {
        const cleanName = file.name
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9.-]/g, "")
          .toLowerCase();

        const fileName = `${Date.now()}-${cleanName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("products")
            .upload(fileName, file);

        if (uploadError) {
          setMsg("Image upload failed");
          return;
        }

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("products")
        .insert([
          {
            name: form.name,
            price: Number(form.price),
            country: form.country,
            category: form.category,
            image_url: imageUrl,
          },
        ]);

      if (error) {
        setMsg("Save failed");
        return;
      }

      setMsg("✅ Product uploaded successfully");

      setForm({
        name: "",
        price: "",
        country: "",
        category: "",
      });

      setFile(null);
    } catch {
      setMsg("Unexpected error");
    }
  };

  const input =
    "w-full bg-white border border-stone-200 rounded-2xl px-4 py-4 text-gray-900 outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-orange-50 py-10 px-4">

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-start">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white rounded-[32px] p-8 shadow-2xl">

          <p className="uppercase tracking-widest text-orange-300 font-semibold text-sm">
            Seller Center
          </p>

          <h1 className="text-5xl font-black mt-4 leading-tight">
            Add New
            <br />
            Product
          </h1>

          <p className="mt-5 text-green-100 text-lg leading-relaxed">
            Upload your products and reach buyers across Africa.
            Fast listing. Trusted selling. Real growth.
          </p>

          <div className="mt-8 space-y-4 text-sm">

            <div className="bg-white/10 rounded-2xl p-4">
              📦 Sell physical & digital products
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              🌍 Reach multiple African countries
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              💳 Receive secure payments
            </div>

          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-white rounded-[32px] border border-stone-100 shadow-2xl p-6 md:p-8">

          <div className="mb-6">
            <p className="text-orange-500 font-bold uppercase text-sm tracking-wider">
              Product Form
            </p>

            <h2 className="text-3xl font-black text-gray-900">
              Upload Product
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              placeholder="Product Name"
              value={form.name}
              className={input}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Price"
              type="number"
              value={form.price}
              className={input}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
            />

            <select
              value={form.country}
              className={input}
              onChange={(e) =>
                setForm({
                  ...form,
                  country: e.target.value,
                })
              }
            >
              <option value="">
                Select African Country
              </option>

              {countries.map((country) => (
                <option key={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              value={form.category}
              className={input}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              <option value="">
                Select Category
              </option>

              {categories.map((cat) => (
                <option key={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Upload Box */}
            <label className="block border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center cursor-pointer hover:border-orange-400 transition">

              <p className="text-gray-700 font-semibold">
                📷 Click to choose product image
              </p>

              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, WEBP
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
              />

              {file && (
                <p className="mt-3 text-green-700 font-semibold text-sm">
                  {file.name}
                </p>
              )}
            </label>

            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-md transition"
            >
              Upload Product
            </button>

            {msg && (
              <p className="text-center font-semibold text-green-700">
                {msg}
              </p>
            )}

          </form>
        </div>
      </div>
    </main>
  );
}