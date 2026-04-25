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

        // upload image first
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
            setMsg("Image upload failed: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
        }

        // insert product
        const { data: inserted, error: insertError } =
        await supabase
            .from("products")
            .insert([
            {
                name: form.name,
                price: Number(form.price),
                country: form.country,
                category: form.category,
                image_url: imageUrl,
            },
            ])
            .select();

        if (insertError) {
        setMsg("Save failed: " + insertError.message);
        return;
        }

        console.log(inserted);
        setMsg("Product added successfully");
    } catch (err: any) {
        setMsg("Unexpected error");
        console.log(err);
    }
    };

  return (
    <main className="min-h-screen bg-white p-8 ">
      <div className="max-w-2xl mx-auto bg-green-900 p-8 rounded-3xl shadow">
        <h1 className="text-4xl font-black mb-6">
          Add Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            placeholder="Product Name"
            className="w-full border p-3 rounded-xl bg-white text-gray-900"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Price"
            className="w-full border p-3 rounded-xl bg-white text-gray-900"
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          <select
            className="w-full border p-3 rounded-xl bg-white text-gray-900"
            onChange={(e) =>
              setForm({
                ...form,
                country: e.target.value,
              })
            }
          >
            <option>Select African Country</option>

            {countries.map((country) => (
              <option key={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-3 rounded-xl bg-white text-gray-900"
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            <option>Select Category</option>

            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] || null
              )
            }
          />

          <button className="w-full bg-orange-500 text-white py-4 rounded-2xl"> 
            Upload Product
          </button>
        </form>

        <p className="mt-4 font-medium">
          {msg}
        </p>
      </div>
    </main>
  );
}