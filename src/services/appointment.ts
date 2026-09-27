import type {
  Appointment,
  AppointmentRow,
  AppointmentStatus,
} from "../domain/appointment";
import { supabase } from "../lib/connect";

type GetAppointmentsParams = {
  date: string | null;
  status: AppointmentStatus | "";
};

export const getAppointments = async ({
  date,
  status,
}: GetAppointmentsParams): Promise<Appointment[]> => {
  const startDate = date ? new Date(`${date}T00:00:00`) : new Date();

  startDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + 1);

  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_at,
      duration_minutes,
      status,
      patients (
        full_name,
        patient_code,
        phone,
        date_of_birth
      ),
      doctors (
        name,
        specialty
      )
    `,
    )
    .gte("appointment_at", startDate.toISOString());

  /*
    بدون تاريخ محدد:
    من اليوم وما بعده.

    مع تاريخ محدد:
    مواعيد اليوم المحدد فقط.
  */
  if (date) {
    query = query.lt("appointment_at", nextDate.toISOString());
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query.order("appointment_at", {
    ascending: true,
  });

  if (error) {
    throw error;
  }

  const appointments = (data ?? []) as unknown as AppointmentRow[];

  return appointments.map((appointment) => {
    const patient = appointment.patients;
    const doctor = appointment.doctors;

    if (!patient || !doctor) {
      throw new Error("Appointment is missing its patient or doctor.");
    }

    return {
      id: appointment.id,
      time: new Date(appointment.appointment_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: `${appointment.duration_minutes} min`,
      patient: patient.full_name,
      initials: patient.full_name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2),
      patientId: patient.patient_code,
      doctor: doctor.name,
      department: doctor.specialty,
      status: appointment.status,
      phone: patient.phone,
      dob: new Date(patient.date_of_birth).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
  });
};
