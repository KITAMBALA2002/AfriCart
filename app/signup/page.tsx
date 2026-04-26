"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const signup = async () => {
    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }

    setMsg("Creating account...");

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      setMsg(error.message);
      return;
    }

    if (data.user?.id) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          email,
          role,
        },
      ]);
    }

    setMsg("Account created successfully");

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const input =
    "w-full border-2 border-white/20 bg-white/10 text-white placeholder-white/70 p-4 rounded-2xl text-lg backdrop-blur";

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left */}
      <section className="hidden lg:flex bg-gradient-to-br from-green-950 via-green-800 to-orange-500 p-14 items-center">
        <div>
          <p className="text-orange-200 font-semibold tracking-widest">
            JOIN AFRICART
          </p>

          <h1 className="text-6xl font-black mt-4 leading-tight">
            Buy Smarter.
            <br />
            Sell Faster.
            <br />
            Grow Bigger.
          </h1>

          <p className="mt-6 text-xl text-white/80 max-w-lg">
            Africa’s marketplace for trusted buyers, bold sellers, and rising local brands.
          </p>

          <div className="mt-8 space-y-3 text-lg">
            <p>✓ Secure Accounts</p>
            <p>✓ Local Opportunities</p>
            <p>✓ Cross-Border Growth</p>
          </div>
        </div>
      </section>

      {/* Right */}
      <section className="flex items-center justify-center p-6 bg-zinc-950">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <h2 className="text-5xl font-black">
            Create Account
          </h2>

          <p className="text-white/70 mt-2 mb-8">
            Join the future of African commerce.
          </p>

          <div className="space-y-5">
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className={input}
            >
              <option className="text-black" value="buyer">Buyer</option>
              <option className="text-black" value="seller">Seller</option>
            </select>

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

            <input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              className={input}
              onChange={(e) =>
                setConfirm(e.target.value)
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
              onClick={signup}
              className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl text-xl font-black transition"
            >
              Sign Up
            </button>

            <p className="text-orange-200 font-medium">
              {msg}
            </p>

            <p className="text-sm text-white/70">
              Already have an account?{" "}
              <a href="/login" className="text-orange-400 font-bold">
                Login
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}