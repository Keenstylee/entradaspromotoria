import { supabase } from "./supabaseClient.js";

const BUCKET = "web-friendly";

// extrae el número de "cap31.JPG" => 31
function getNum(name = "") {
  const m = name.match(/\d+/);
  return m ? parseInt(m[0], 10) : Number.POSITIVE_INFINITY;
}

export async function getScreens() {
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200,
    offset: 0,
    // puedes dejar esto, pero igual ordenaremos abajo correctamente
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error("❌ Error listando capturas:", error.message);
    return [];
  }

  const files = (data || [])
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
    .sort((a, b) => {
      const na = getNum(a.name);
      const nb = getNum(b.name);
      if (na !== nb) return na - nb;
      // si empatan (raro), desempata por nombre
      return a.name.localeCompare(b.name);
    });

  const images = files.map((f, idx) => {
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);

    return {
      id: idx + 1,
      image: urlData.publicUrl, // 👈 sin ?v=Date.now()
    };
  });

  return images;
}
