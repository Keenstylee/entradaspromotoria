import { supabase } from "./supabaseClient.js";
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

function setMsg(el, text) {
  el.textContent = text || "";
}

function isoFromDatetimeLocal(val) {
  if (!val) return null;
  const d = new Date(val);
  return d.toISOString();
}

function datetimeLocalFromIso(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
      <td class="py-3 pr-3 opacity-80">${ev.date ? new Date(ev.date).toLocaleString() : ""}</td>
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

async function showUIForSession() {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (session) {
    loginSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    setMsg(loginMsg, "");
    await renderEventsTable();
  } else {
    adminSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  }
}

btnLogin.addEventListener("click", async () => {
  setMsg(loginMsg, "Entrando...");

  const { error } = await supabase.auth.signInWithPassword({
    email: emailEl.value.trim(),
    password: passEl.value,
  });

  if (error) {
    setMsg(loginMsg, `❌ ${error.message}`);
    return;
  }

  setMsg(loginMsg, "✅ Sesión iniciada.");
  await showUIForSession();
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

showUIForSession();

supabase.auth.onAuthStateChange(() => {
  showUIForSession();
});
