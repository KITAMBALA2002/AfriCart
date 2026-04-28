"use client";

import Link from "next/link";

export default function FooterNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="grid grid-cols-5 text-center text-xs font-medium">
        <Link href="/" className="py-3">
          🏠
          <div>Home</div>
        </Link>

        <Link
          href="/products"
          className="py-3"
        >
          🔍
          <div>Browse</div>
        </Link>

        <Link href="/cart" className="py-3">
          🛒
          <div>Cart</div>
        </Link>

        <Link
          href="/seller"
          className="py-3"
        >
          🏪
          <div>Seller</div>
        </Link>

        <Link
          href="/login"
          className="py-3"
        >
          👤
          <div>Account</div>
        </Link>
      </div>
    </nav>
  );
}