import { supabase } from "./supabaseClient.js";

const adminBtn = document.getElementById("admin-btn");

async function showAdminIfLogged() {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (session) adminBtn?.classList.remove("hidden");
}

showAdminIfLogged();

// (opcional) si cambias de sesión sin recargar
supabase.auth.onAuthStateChange(() => {
  showAdminIfLogged();
});
