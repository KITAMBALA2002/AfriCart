"use client";

import { usePathname } from "next/navigation";
import Navbar from "./TempNav";
import FooterNav from "./FooterMenu";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <Navbar />}

      <main className={!isHome ? "pb-20" : ""}>
        {children}
      </main>

      {!isHome && <FooterNav />}
    </>
  );
}