export type AppointmentStatus =
  | "Waiting"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type AppointmentDisplayStatus = AppointmentStatus | "Upcoming";
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
  displayStatus: AppointmentDisplayStatus;
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

export type RecentVisitRow = {
  id: string;
  appointment_at: string;
  reason: string | null;
  status: AppointmentStatus;
  doctors: {
    name: string;
    specialty: string;
  } | null;
};

export type CreateAppointmentInput = {
  patient_id: string;
  doctor_id: string;
  appointment_at: string;
  duration_minutes: number;
  addToQueue: boolean;
  reason: string;
};

export type PatientRecentVisit = {
  id: string;
  appointment_at: string;
  reason: string | null;
  status: AppointmentStatus;
  doctor_name: string;
  specialty: string;
};

export type PatientVisitHistoryItem = {
  id: string;
  appointment_at: string;
  reason: string | null;
  status: AppointmentStatus;
  displayStatus: AppointmentDisplayStatus;
  doctor_id: string;
  doctor_name: string;
  specialty: string;
};

export type PatientVisitHistoryRow = {
  id: string;
  appointment_at: string;
  reason: string | null;
  status: AppointmentStatus;
  doctor_id: string;
  doctors: {
    name: string;
    specialty: string;
  } | null;
};

export type GetPatientVisitHistoryParams = {
  patientId: string;
  doctorId?: string;
  status?: AppointmentDisplayStatus | "";
};
