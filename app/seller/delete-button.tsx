"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
}: {
  id: number;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = confirm("Delete this product?");

    if (!ok) return;

    await supabase
      .from("products")
      .delete()
      .eq("id", id);

    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="w-full bg-red-500 text-white py-3 rounded-2xl"
    >
      Delete Product
    </button>
  );
}