"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created. Check email.");
      window.location.href = "/login";
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl font-black mb-2 text-orange-500">
          Join AfriCart
        </h1>

        <p className="text-gray-500 mb-6">
          Create your customer account
        </p>

        <input
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signup}
          className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition"
        >
          Create Account
        </button>

        <p className="mt-5 text-sm text-center">
          Already have account?{" "}
          <Link href="/login" className="text-green-900 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}