"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const login = async () => {
    setMsg("Signing in...");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setMsg(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

    if (profile?.role === "seller") {
      router.push("/seller");
    } else if (profile?.role === "admin") {
      router.push("/admin/orders");
    } else {
      router.push("/");
    }
  };

  const input =
    "w-full border-2 border-white/20 bg-white/10 text-white placeholder-white/70 p-4 rounded-2xl text-lg backdrop-blur";

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left */}
      <section className="hidden lg:flex bg-gradient-to-br from-orange-600 via-orange-500 to-green-800 p-14 items-center">
        <div>
          <p className="font-semibold tracking-widest">
            WELCOME BACK
          </p>

          <h1 className="text-6xl font-black mt-4 leading-tight">
            Your Store.
            <br />
            Your Orders.
            <br />
            Your Growth.
          </h1>

          <p className="mt-6 text-xl text-white/80 max-w-lg">
            Log in to continue building success across Africa.
          </p>

          <div className="mt-8 space-y-3 text-lg">
            <p>✓ Manage Products</p>
            <p>✓ Track Orders</p>
            <p>✓ Grow Revenue</p>
          </div>
        </div>
      </section>

      {/* Right */}
      <section className="flex items-center justify-center p-6 bg-zinc-950">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <h2 className="text-5xl font-black">
            Login
          </h2>

          <p className="text-white/70 mt-2 mb-8">
            Continue your AfriCart journey.
          </p>

          <div className="space-y-5">
            <input
              placeholder="Email Address"
              className={input}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className={input}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <label className="flex gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                onChange={() =>
                  setShow(!show)
                }
              />
              Show Password
            </label>

            <button
              onClick={login}
              className="w-full bg-green-700 hover:bg-green-800 py-4 rounded-2xl text-xl font-black transition"
            >
              Login
            </button>

            <p className="text-orange-200 font-medium">
              {msg}
            </p>

            <p className="text-sm text-white/70">
              Need an account?{" "}
              <a href="/signup" className="text-orange-400 font-bold">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}