import type { GetPatientsResponse, Patient } from "../domain/patient";
import { supabase } from "../lib/connect";

export const getPatients = async ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<GetPatientsResponse> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase.from("patients").select("*", { count: "exact" });

  if (search?.trim()) {
    query = query.ilike("patient_code", `%${search.trim()}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    patients: (data ?? []) as Patient[],
    total: count ?? 0,
  };
};

export const getPatientById = async (id: string): Promise<Patient> => {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data as Patient;
};

export function calculateAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const birthdayDidNotHappenYet =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (birthdayDidNotHappenYet) {
    age--;
  }

  return age;
}

export function formatMonthYear(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export const getPatientByCode = async (
  patientCode: string,
): Promise<Patient | null> => {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("patient_code", patientCode)
    .maybeSingle();

  if (error) throw error;

  return data as Patient | null;
};