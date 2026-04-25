"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EditForm({
  product,
}: any) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    category: product.category,
    country: product.country,
  });

  const [msg, setMsg] = useState("");

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase
      .from("products")
      .update(form)
      .eq("id", product.id);

    if (error) {
      setMsg("Update failed");
    } else {
      setMsg("Updated successfully");

      setTimeout(() => {
        router.push("/seller");
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-2xl mx-auto bg-stone-900 text-white p-8 rounded-3xl shadow">
        <h1 className="text-4xl font-black mb-6">
          Edit Product
        </h1>

        <form
          onSubmit={handleUpdate}
          className="space-y-5"
        >
          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            value={form.country}
            onChange={(e) =>
              setForm({
                ...form,
                country: e.target.value,
              })
            }
            className="w-full border p-3 rounded-xl"
          />

          <button className="w-full bg-green-900 text-white py-4 rounded-2xl">
            Save Changes
          </button>
        </form>

        <p className="mt-4">{msg}</p>
      </div>
    </main>
  );
}