export type AppointmentStatus =
  | "Waiting"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type Appointment = {
  id: string;
  time: string;
  duration: string;
  patient: string;
  initials: string;
  patientId: string;
  doctor: string;
  department: string;
  status: AppointmentStatus;
  phone: string | null;
  dob: string;
};

export type AppointmentRow = {
  id: string;
  appointment_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  patients: {
    full_name: string;
    patient_code: string;
    phone: string | null;
    date_of_birth: string;
  };
  doctors: {
    name: string;
    specialty: string;
  };
};
