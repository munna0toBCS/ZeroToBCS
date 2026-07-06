import { supabase } from "./supabaseClient";

export const getSupabaseUserProfile = async (firebaseUid) => {
  if (!supabase) {
    throw new Error("Supabase client is not ready.");
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
};

export const createSupabaseUserProfile = async (user) => {
  if (!supabase) {
    throw new Error("Supabase client is not ready.");
  }

  const profile = {
    firebase_uid: user.uid,
    email: user.email,
    name: user.displayName || user.email?.split("@")[0] || "Cadet",
  };

  const { data, error } = await supabase
    .from("user_profiles")
    .insert(profile)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getOrCreateSupabaseUserProfile = async (user) => {
  const existingProfile = await getSupabaseUserProfile(user.uid);

  if (existingProfile) {
    return existingProfile;
  }

  return createSupabaseUserProfile(user);
};