import type { Doctor } from "../domain/doctor";
import { supabase } from "../lib/connect";

export const getDashboardDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .order("name")
    .limit(3);

  if (error) {
    throw error;
  }

  return (data ?? []) as Doctor[];
};