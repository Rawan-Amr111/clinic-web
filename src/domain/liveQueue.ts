export type LiveQueue = {
  id: string;
  queue_number: number;
  status: "Waiting" | "In Consultation" | "On Hold";
  appointment_at: string;

  patient_name: string;
  patient_code: string;

  doctor_id: string;
  doctor_name: string;
  specialty: string;
};

export type LiveQueueRow = {
  id: string;
  queue_number: number;
  status: LiveQueue["status"];

  patients: {
    full_name: string;
    patient_code: string;
  } | null;

  doctors: {
    id: string;
    name: string;
    specialty: string;
  } | null;

  appointments: {
    appointment_at: string;
  } | null;
};
