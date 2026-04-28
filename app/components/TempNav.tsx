"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black text-green-900"
        >
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-orange-500">Afri</span>
            <span className="text-green-900">Cart</span>
          </h1>
        </Link>

        <nav className="hidden md:flex gap-6 font-semibold text-gray-800 items-center">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>

          {user ? (
            <>
              <Link 
                href="/seller"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200"
              >
                Dashboard
              </Link>

              <button 
                onClick={logout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link  
                href="/become-seller"
                className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600"
              >
                Become Seller
              </Link>

              <Link 
                href="/login"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}