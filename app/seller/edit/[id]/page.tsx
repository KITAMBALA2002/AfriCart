import { supabase } from "@/lib/supabase";
import EditForm from "./update-form";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return <div className="p-10">Not found</div>;
  }

  return <EditForm product={product} />;
}