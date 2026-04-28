"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BecomeSellerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const upgrade = async () => {
    setLoading(true);
    setMsg("Upgrading account...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: "seller" })
      .eq("id", user.id);

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setMsg("Account upgraded successfully!");

    setTimeout(() => {
      router.push("/seller");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <p className="text-orange-300 font-semibold tracking-widest">
          START SELLING
        </p>

        <h1 className="text-5xl font-black mt-3 leading-tight">
          Become a Seller on AfriCart
        </h1>

        <p className="text-white/70 mt-5 text-lg">
          Use your existing account to open your store, upload products,
          reach customers, and grow your income across Africa.
        </p>

        <div className="mt-8 space-y-3 text-white/80">
          <p>✓ Keep same email and password</p>
          <p>✓ Start uploading products today</p>
          <p>✓ Manage orders easily</p>
          <p>✓ Reach more buyers</p>
        </div>

        <button
          onClick={upgrade}
          disabled={loading}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl text-xl font-black transition disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Upgrade to Seller"}
        </button>

        {msg && (
          <p className="mt-5 text-green-300 font-medium">
            {msg}
          </p>
        )}

        <p className="mt-6 text-sm text-white/60 text-center">
          No new account needed.
        </p>
      </div>
    </main>
  );
}