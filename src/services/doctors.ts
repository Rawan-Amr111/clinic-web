import type {
  Doctor,
  DoctorStatus,
  GetDoctorsResponse,
} from "../domain/doctor";
import { supabase } from "../lib/connect";

export const getDoctors = async ({
  page,
  pageSize,
  search,
  specialty,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  specialty?: string;
  status?: string;
}): Promise<GetDoctorsResponse> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase.from("doctors").select("*", { count: "exact" });

  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  if (specialty) {
    query = query.eq("specialty", specialty);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);
  if (error) {
    throw error;
  }

  return {
    doctors: (data ?? []) as Doctor[],
    total: count ?? 0,
  };
};

export const getSpecialties = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("doctors")
    .select("specialty")
    .order("specialty");

  if (error) {
    throw error;
  }

  return [...new Set(data.map((doctor) => doctor.specialty))];
};

export const updateDoctorStatus = async (
  doctorId: string,
  status: DoctorStatus,
): Promise<Doctor> => {
  const { data, error } = await supabase
    .from("doctors")
    .update({ status })
    .eq("id", doctorId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Doctor;
};

type AddDoctorParams = {
  name: string;
  specialty: string;
  image?: File;
};

export const addDoctor = async ({
  name,
  specialty,
  image,
}: AddDoctorParams): Promise<Doctor> => {
  const imageUrl = image ? await uploadDoctorAvatar(image) : null;
  const { data, error } = await supabase
    .from("doctors")
    .insert({
      name: name.trim(),
      specialty: specialty.trim(),
      status: "Active",
      image: imageUrl,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Doctor;
};

export const uploadDoctorAvatar = async (file: File): Promise<string> => {
  const extension = file.name.split(".").pop() || "jpg";

  const filePath = `avatars/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("doctor-avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Avatar upload error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("doctor-avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const getActiveDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("status", "Active")
    .order("name");

  if (error) throw error;

  return (data ?? []) as Doctor[];
};
