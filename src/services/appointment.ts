import type {
  Appointment,
  AppointmentDisplayStatus,
  AppointmentRow,
  AppointmentStatus,
  CreateAppointmentInput,
  GetPatientVisitHistoryParams,
  PatientRecentVisit,
  PatientVisitHistoryItem,
  PatientVisitHistoryRow,
  RecentVisitRow,
} from "../domain/appointment";
import { supabase } from "../lib/connect";
import { updateLiveQueueStatus } from "./liveQueue";

type GetAppointmentsParams = {
  date: string | null;
  status: AppointmentStatus | "";
  includeClosed?: boolean;
  doctorId?: string | null;
};

export const getAppointments = async ({
  date,
  status,
  includeClosed = false,
  doctorId,
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
      reason,
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
  if (date) {
    query = query.lt("appointment_at", nextDate.toISOString());
  }

  if (status) {
    query = query.eq("status", status);
  } else if (!includeClosed) {
    query = query.not("status", "in", '("Completed","Cancelled")');
  }
  if (doctorId) {
    query = query.eq("doctor_id", doctorId);
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
      appointmentAt: appointment.appointment_at,
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
      reason: appointment.reason,
      displayStatus: getDisplayStatus(
        appointment.status,
        appointment.appointment_at,
      ),
      phone: patient.phone,
      dob: new Date(patient.date_of_birth).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
  });
};

export const createAppointment = async ({
  patient_id,
  doctor_id,
  appointment_at,
  duration_minutes,
  reason,
}: CreateAppointmentInput): Promise<string> => {
  const { data, error } = await supabase.rpc("create_appointment_with_queue", {
    p_patient_id: patient_id,
    p_doctor_id: doctor_id,
    p_appointment_at: appointment_at,
    p_duration_minutes: duration_minutes,
    p_reason: reason,
    p_add_to_queue: false,
  });

  if (error) {
    throw error;
  }

  return data as string;
};

export const updateAppointment = async (
  appointmentId: string,
  updates: { appointment_at?: string; reason?: string | null; status?: AppointmentStatus },
): Promise<void> => {
  if (updates.status === "Completed" || updates.status === "Cancelled") {
    const { data: queueEntry, error: queueLookupError } = await supabase
      .from("queue_entries")
      .select("id, appointments!inner(id)")
      .eq("appointments.id", appointmentId)
      .maybeSingle();

    if (queueLookupError) throw queueLookupError;

    if (queueEntry) {
      await updateLiveQueueStatus(queueEntry.id, updates.status);
      return;
    }
  }

  const { data, error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("The appointment could not be updated.");
};
export const getDisplayStatus = (
  status: AppointmentStatus,
  appointmentAt: string,
): AppointmentDisplayStatus => {
  const appointmentDate = new Date(appointmentAt);
  appointmentDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (status === "Waiting" && appointmentDate > today) {
    return "Upcoming";
  }

  return status;
};

export const getRecentVisits = async (
  patientId: string,
): Promise<PatientRecentVisit[]> => {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_at,
      reason,
      status,
      doctors (
        name,
        specialty
      )
    `,
    )
    .eq("patient_id", patientId)
    .eq("status", "Completed")
    .order("appointment_at", { ascending: false })
    .limit(3);

  if (error) {
    throw error;
  }

  const visits = (data ?? []) as unknown as RecentVisitRow[];

  return visits.map((visit) => {
    if (!visit.doctors) {
      throw new Error("Visit is missing its doctor.");
    }

    return {
      id: visit.id,
      appointment_at: visit.appointment_at,
      reason: visit.reason,
      status: visit.status,
      doctor_name: visit.doctors.name,
      specialty: visit.doctors.specialty,
    };
  });
};
export const getFullVisits = async (
  patientId: string,
): Promise<PatientRecentVisit[]> => {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_at,
      reason,
      status,
      doctors (
        name,
        specialty
      )
    `,
    )
    .eq("patient_id", patientId)
    .in("status", ["Completed", "Cancelled"])
    .order("appointment_at", { ascending: false });

  if (error) {
    throw error;
  }

  const visits = (data ?? []) as unknown as RecentVisitRow[];

  return visits.map((visit) => {
    if (!visit.doctors) {
      throw new Error("Visit is missing its doctor.");
    }

    return {
      id: visit.id,
      appointment_at: visit.appointment_at,
      reason: visit.reason,
      status: visit.status,
      doctor_name: visit.doctors.name,
      specialty: visit.doctors.specialty,
    };
  });
};

export const getPatientVisitHistory = async ({
  patientId,
  doctorId,
  status,
}: GetPatientVisitHistoryParams): Promise<PatientVisitHistoryItem[]> => {
  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_at,
      reason,
      status,
      doctor_id,
      doctors (
        name,
        specialty
      )
    `,
    )
    .eq("patient_id", patientId);

  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);

  if (doctorId) {
    query = query.eq("doctor_id", doctorId);
  }

  if (status === "Upcoming") {
    query = query
      .eq("status", "Waiting")
      .gte("appointment_at", tomorrow.toISOString());
  } else if (status === "Waiting") {
    query = query
      .eq("status", "Waiting")
      .lt("appointment_at", tomorrow.toISOString());
  } else if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query.order("appointment_at", {
    ascending: false,
  });

  if (error) {
    throw error;
  }

  const visits = (data ?? []) as unknown as PatientVisitHistoryRow[];

  return visits.map((visit) => {
    if (!visit.doctors) {
      throw new Error("Appointment is missing its doctor.");
    }

    return {
      id: visit.id,
      appointment_at: visit.appointment_at,
      reason: visit.reason,
      status: visit.status,
      displayStatus: getDisplayStatus(visit.status, visit.appointment_at),
      doctor_id: visit.doctor_id,
      doctor_name: visit.doctors.name,
      specialty: visit.doctors.specialty,
    };
  });
};
