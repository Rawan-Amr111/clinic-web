export type AppointmentStatus = "In Progress" | "Waiting";

export type Appointment = {
  id: number;
  time: string;
  duration: string;
  patient: string;
  initials: string;
  patientId: string;
  doctor: string;
  department: string;
  status: AppointmentStatus;
  phone: string;
  dob: string;
};