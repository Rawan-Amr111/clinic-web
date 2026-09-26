export type DoctorStatus = "Active" | "Inactive";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  status: DoctorStatus;
  image?: string;
  doctor_code: string;
};

export type GetDoctorsResponse = {
  doctors: Doctor[];
  total: number;
};
