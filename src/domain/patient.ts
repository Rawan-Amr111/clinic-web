export type Patient = {
  id: string;
  full_name: string;
  patient_code: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string;
  gender: "Female" | "Male";
  status: "Active" | "Inactive";
  avatar_url: string | null;
  created_at: string;
};

 export type GetPatientsResponse = {
  patients: Patient[];
  total: number;
};
