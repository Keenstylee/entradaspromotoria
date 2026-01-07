import { supabase } from "./supabaseClient.js";

// ========= CONFIG =========
const BUCKET = "web-friendly";

// ========= AUTH PROXY (Cloudflare Worker) =========
const WORKER_URL = "https://frosty-math-d40e.keenscy10.workers.dev";
const PROXY_SECRET = "KeenFest2025!";

async function loginViaProxy(email, password) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": PROXY_SECRET,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error_description || data?.message || "Login failed");
  }
  return data;
}

console.log("✅ admin.js NUEVO cargado (proxy login)");

// ========= LOGIN / UI =========
const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");
const loginMsg = document.getElementById("login-msg");
const adminMsg = document.getElementById("admin-msg");

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");

const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");

const tbody = document.getElementById("events-tbody");

const evId = document.getElementById("ev-id");
const evTitle = document.getElementById("ev-title");
const evLocation = document.getElementById("ev-location");
const evDate = document.getElementById("ev-date");
const evPrice = document.getElementById("ev-price");
const evImage = document.getElementById("ev-image");
const evWhatsapp = document.getElementById("ev-whatsapp");
const evDescription = document.getElementById("ev-description");

const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");

// ========= CAPTURAS ELEMENTS =========
const screenFileEl = document.getElementById("screen-file");
const btnUploadScreen = document.getElementById("btn-upload-screen");
const uploadMsg = document.getElementById("upload-msg");

const btnRefreshScreens = document.getElementById("btn-refresh-screens");
const screensMsg = document.getElementById("screens-msg");
const screensTbody = document.getElementById("screens-tbody");

function setMsg(el, text) {
  if (!el) return;
  el.textContent = text || "";
}

// ========= UTIL DATE =========
function isoFromDatetimeLocal(val) {
  if (!val) return null;
  const d = new Date(val);
  return d.toISOString();
}

function datetimeLocalFromIso(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ✅ sacar fecha del nombre cap_YYYYMMDD_HHMMSS.png
function dateFromCapName(name) {
  const m = name.match(/cap_(\d{8})_(\d{6})/);
  if (!m) return "-";

  const ymd = m[1];
  const hms = m[2];

  const y = ymd.slice(0, 4);
  const mo = ymd.slice(4, 6);
  const d = ymd.slice(6, 8);

  const hh = hms.slice(0, 2);
  const mm = hms.slice(2, 4);
  const ss = hms.slice(4, 6);

  return `${d}/${mo}/${y} ${hh}:${mm}:${ss}`;
}

function clearForm() {
  evId.value = "";
  evTitle.value = "";
  evLocation.value = "";
  evDate.value = "";
  evPrice.value = "";
  evImage.value = "";
  evWhatsapp.value = "";
  evDescription.value = "";
  setMsg(adminMsg, "");
}

// ========= EVENTS CRUD =========
async function renderEventsTable() {
  tbody.innerHTML = "";

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    setMsg(adminMsg, `❌ Error cargando eventos: ${error.message}`);
    return;
  }

  data.forEach((ev) => {
    const tr = document.createElement("tr");
    tr.className = "border-t border-white/10";

    tr.innerHTML = `
      <td class="py-3 pr-3">${ev.title ?? ""}</td>
      <td class="py-3 pr-3 opacity-80">${
        ev.date ? new Date(ev.date).toLocaleString() : ""
      }</td>
      <td class="py-3 pr-3 opacity-80">${ev.location ?? ""}</td>
      <td class="py-3 flex gap-2">
        <button class="px-3 py-1 rounded bg-white/10 hover:bg-white/20" data-action="edit" data-id="${ev.id}">Editar</button>
        <button class="px-3 py-1 rounded bg-red-600 hover:bg-red-700" data-action="delete" data-id="${ev.id}">Borrar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function handleEdit(id) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    setMsg(adminMsg, `❌ Error al cargar evento: ${error.message}`);
    return;
  }

  evId.value = data.id;
  evTitle.value = data.title ?? "";
  evLocation.value = data.location ?? "";
  evDate.value = datetimeLocalFromIso(data.date);
  evPrice.value = data.price ?? "";
  evImage.value = data.image ?? "";
  evWhatsapp.value = data.whatsapp ?? "";
  evDescription.value = data.description ?? "";

  setMsg(adminMsg, "✏️ Editando evento...");
}

async function handleDelete(id) {
  if (!confirm("¿Seguro que deseas borrar este evento?")) return;

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    setMsg(adminMsg, `❌ No se pudo borrar: ${error.message}`);
    return;
  }

  setMsg(adminMsg, "🗑️ Evento borrado.");
  await renderEventsTable();
}

async function saveEvent() {
  const payload = {
    title: evTitle.value.trim(),
    location: evLocation.value.trim() || null,
    date: isoFromDatetimeLocal(evDate.value),
    description: evDescription.value.trim() || null,
    image: evImage.value.trim() || null,
    whatsapp: evWhatsapp.value.trim() || null,
  };

  if (evPrice.value !== "") payload.price = Number(evPrice.value);

  if (!payload.title) {
    setMsg(adminMsg, "⚠️ El título es obligatorio.");
    return;
  }

  if (evId.value) {
    const { error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", evId.value);

    if (error) {
      setMsg(adminMsg, `❌ Error actualizando: ${error.message}`);
      return;
    }

    setMsg(adminMsg, "✅ Evento actualizado.");
  } else {
    const { error } = await supabase.from("events").insert(payload);

    if (error) {
      setMsg(adminMsg, `❌ Error creando: ${error.message}`);
      return;
    }

    setMsg(adminMsg, "✅ Evento creado.");
  }

  clearForm();
  await renderEventsTable();
}

// ========= ✅ SUBIR CAPTURA =========
async function uploadScreen() {
  setMsg(uploadMsg, "⏳ Subiendo...");

  const file = screenFileEl?.files?.[0];
  if (!file) return setMsg(uploadMsg, "⚠️ Selecciona una imagen primero.");

  if (!file.type.startsWith("image/"))
    return setMsg(uploadMsg, "❌ Solo puedes subir imágenes.");

  const ext = file.name.split(".").pop().toLowerCase();

  const now = new Date();
  const stamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const fileName = `cap_${stamp}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return setMsg(uploadMsg, `❌ Error: ${error.message}`);

  setMsg(uploadMsg, `✅ Subida lista: ${fileName}`);
  screenFileEl.value = "";

  await renderScreensTable();
}

// ========= ✅ LISTAR CAPTURAS =========
async function renderScreensTable() {
  if (!screensTbody) return;

  setMsg(screensMsg, "⏳ Cargando capturas...");
  screensTbody.innerHTML = "";

  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    setMsg(screensMsg, `❌ Error: ${error.message}`);
    return;
  }

  const files = (data || [])
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
    .sort((a, b) => b.name.localeCompare(a.name)); // ✅ nuevas arriba por nombre

  if (files.length === 0) {
    setMsg(screensMsg, "⚠️ No hay capturas subidas todavía.");
    return;
  }

  setMsg(screensMsg, `✅ ${files.length} capturas encontradas`);

  files.forEach((file) => {
    const publicUrl =
      supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl +
      "?v=" +
      Date.now();

    const created = dateFromCapName(file.name);

    const tr = document.createElement("tr");
    tr.className = "border-t border-white/10";

    tr.innerHTML = `
      <td class="py-3 pr-3">
        <img src="${publicUrl}" class="w-20 h-14 object-cover rounded border border-white/10"/>
      </td>
      <td class="py-3 pr-3 opacity-90">${file.name}</td>
      <td class="py-3 pr-3 opacity-70">${created}</td>
      <td class="py-3 flex gap-2">
        <button class="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
          data-action="copy" data-url="${publicUrl}">
          Copiar link
        </button>

        <button class="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
          data-action="delete" data-name="${file.name}">
          Borrar
        </button>
      </td>
    `;

    screensTbody.appendChild(tr);
  });
}

// ========= ✅ ACCIONES CAPTURAS =========
async function deleteScreen(name) {
  if (!confirm("¿Seguro que deseas borrar esta captura?")) return;

  const { error } = await supabase.storage.from(BUCKET).remove([name]);

  if (error) {
    setMsg(screensMsg, `❌ Error borrando: ${error.message}`);
    return;
  }

  setMsg(screensMsg, "🗑️ Captura borrada.");
  await renderScreensTable();
}

async function copyToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    setMsg(screensMsg, "✅ Link copiado al portapapeles.");
  } catch {
    setMsg(screensMsg, "⚠️ No se pudo copiar (tu navegador lo bloqueó).");
  }
}

// ========= AUTH UI =========
async function showUIForSession() {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (session) {
    loginSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    setMsg(loginMsg, "");

    await renderEventsTable();
    await renderScreensTable();
  } else {
    adminSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  }
}

// ========= EVENT LISTENERS =========
btnLogin.addEventListener("click", async () => {
  setMsg(loginMsg, "Entrando...");
  btnLogin.disabled = true;

  try {
    const email = emailEl.value.trim();
    const password = passEl.value;

    // ✅ Login por Cloudflare Worker (funciona en cualquier red)
    const sessionData = await loginViaProxy(email, password);

    // ✅ Setear sesión en supabase-js para que DB/Storage funcionen normal
    await supabase.auth.setSession({
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
    });

    setMsg(loginMsg, "✅ Sesión iniciada.");
    await showUIForSession();
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    setMsg(loginMsg, "❌ " + (e.message || "Error"));
  } finally {
    btnLogin.disabled = false;
  }
});

btnLogout.addEventListener("click", async () => {
  await supabase.auth.signOut();
  clearForm();
  await showUIForSession();
});

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "edit") await handleEdit(id);
  if (action === "delete") await handleDelete(id);
});

btnSave.addEventListener("click", saveEvent);
btnCancel.addEventListener("click", clearForm);

// ========= CAPTURAS LISTENERS =========
if (btnUploadScreen) btnUploadScreen.addEventListener("click", uploadScreen);
if (btnRefreshScreens)
  btnRefreshScreens.addEventListener("click", renderScreensTable);

// Delegación para botones de capturas
if (screensTbody) {
  screensTbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;

    if (action === "delete") {
      const name = btn.dataset.name;
      await deleteScreen(name);
    }

    if (action === "copy") {
      const url = btn.dataset.url;
      await copyToClipboard(url);
    }
  });
}

// ========= INIT =========
showUIForSession();
supabase.auth.onAuthStateChange(() => showUIForSession());
