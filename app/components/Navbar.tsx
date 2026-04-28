"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
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
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black text-green-900"
        >
          AfriCart
        </Link>

        <nav className="hidden md:flex gap-6 font-medium">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>

          {user ? (
            <>
              <Link href="/seller">
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/become-seller">
                Become Seller
              </Link>

              <Link href="/login">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}