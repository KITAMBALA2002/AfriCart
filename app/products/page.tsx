"use client";
import { addToCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

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
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter((item) =>
        item.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (country) {
      data = data.filter(
        (item) => item.country === country
      );
    }

    if (category) {
      data = data.filter(
        (item) => item.category === category
      );
    }

    setFiltered(data);
  }, [search, country, category, products]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
    setFiltered(data || []);
  };

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900">
      {/* Header */}
      <section className="bg-green-950 text-white px-6 py-10">
        <h1 className="text-5xl font-black">
          Explore Products
        </h1>

        <p className="text-green-100 mt-2">
          Discover African goods from trusted sellers.
        </p>
      </section>

      {/* Filters */}
      <section className="px-6 py-6 bg-white shadow-sm">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded-xl"
          />

          <select
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
            className="border p-3 rounded-xl bg-white"
          >
            <option value="">
              All Countries
            </option>

            {countries.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="border p-3 rounded-xl bg-white"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Products */}
      <section className="px-6 py-10">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
            >
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />

              <div className="p-5">
                <h3 className="font-bold text-lg">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {product.category} • {product.country}
                </p>

                <p className="text-orange-500 font-black text-2xl mt-3">
                  ${product.price}
                </p>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                    alert("Added to cart");
                  }}
                  className="mt-4 w-full bg-orange-500 text-white py-3 rounded-2xl"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center mt-12 text-gray-500">
            No matching products found.
          </p>
        )}
      </section>
    </main>
  );
}