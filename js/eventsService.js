import { events as localEvents } from "./data/events.js";
import { supabase } from "./supabaseClient.js";  // ✅ IMPORTANTE

function normalizeEvent(e) {
  return {
    ...e,

    // Si viene de Supabase en snake_case
    whatsappGroupUrl: e.whatsapp_group_url ?? e.whatsappGroupUrl ?? null,

    tickets: e.tickets ?? [],
    badges: e.badges ?? [],
    youtube: e.youtube ?? null,
  };
}

export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;

    const mapped = (data || []).map(normalizeEvent);

    // ✅ Si supabase no tiene nada, usar eventos locales
    return mapped.length ? mapped : localEvents.map(normalizeEvent);
  } catch (err) {
    console.warn("⚠️ Supabase falló (getEvents) → usando locales", err);
    return localEvents.map(normalizeEvent);
  }
}

export async function getEventById(id) {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return normalizeEvent(data);
  } catch (err) {
    console.warn("⚠️ Supabase falló (getEventById) → buscando local", err);

    // ✅ Buscar en eventos locales
    const found = localEvents.find((e) => Number(e.id) === Number(id));
    return found ? normalizeEvent(found) : null;
  }
}
