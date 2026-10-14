import type { LiveQueue, LiveQueueRow } from "../domain/liveQueue";
import type { AppointmentStatus } from "../domain/appointment";
import { supabase } from "../lib/connect";
type GetLiveQueueParams = {
  doctorId?: string;
  limit?: number;
};
export const getLiveQueue = async (
  params: GetLiveQueueParams = {},
): Promise<LiveQueue[]> => {
  const { doctorId, limit } = params;
  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  let query = supabase
    .from("queue_entries")
    .select(
      `
      id,
      queue_number,
      status,
      patients (
        full_name,
        patient_code
      ),
      doctors (
        id,
        name,
        specialty
      ),
      appointments (
        id,
        appointment_at
      )
    `,
    )
    .eq("queue_date", today)
    .not("status", "in", '("Completed","Cancelled")')
    .order("queue_number", { ascending: true });
  if (doctorId) {
    query = query.eq("doctor_id", doctorId);
  }

  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  if (error) {
    throw error;
  }

  const queueRows = (data ?? []) as unknown as LiveQueueRow[];

  const liveQueue = queueRows.map((entry) => {
    if (!entry.patients || !entry.doctors || !entry.appointments) {
      throw new Error(
        "Queue entry is missing patient, doctor, or appointment.",
      );
    }

    return {
      id: entry.id,
      queue_number: entry.queue_number,
      status: entry.status,
      appointment_at: entry.appointments.appointment_at,

      patient_name: entry.patients.full_name,
      patient_code: entry.patients.patient_code,

      doctor_id: entry.doctors.id,
      doctor_name: entry.doctors.name,
      specialty: entry.doctors.specialty,
    };
  });

  liveQueue.sort((first, second) => {
    const doctorComparison = first.doctor_name.localeCompare(
      second.doctor_name,
    );

    if (doctorComparison !== 0) {
      return doctorComparison;
    }

    return first.queue_number - second.queue_number;
  });

  return liveQueue;
};

export const updateLiveQueueStatus = async (
  queueEntryId: string,
  status: "In Consultation" | "Completed" | "Cancelled",
): Promise<void> => {
  const { data, error } = await supabase
    .from("queue_entries")
    .select("status, appointments(id,status)")
    .eq("id", queueEntryId)
    .single();

  if (error) throw error;

  const appointmentRelation = data?.appointments as unknown as
    | { id: string; status: AppointmentStatus }
    | { id: string; status: AppointmentStatus }[]
    | null;
  const appointment = Array.isArray(appointmentRelation)
    ? appointmentRelation[0]
    : appointmentRelation;
  if (!appointment) {
    throw new Error("Queue entry is missing its appointment.");
  }

  const appointmentStatus: AppointmentStatus =
    status === "In Consultation" ? "In Progress" : status;

  const { data: updatedAppointment, error: appointmentError } = await supabase
    .from("appointments")
    .update({ status: appointmentStatus })
    .eq("id", appointment.id)
    .select("id")
    .maybeSingle();

  if (appointmentError) throw appointmentError;
  if (!updatedAppointment) {
    throw new Error(
      "The appointment was not updated. Check the database update policy and appointment link.",
    );
  }

  const { data: updatedQueueEntry, error: queueError } = await supabase
    .from("queue_entries")
    .update({ status })
    .eq("id", queueEntryId)
    .select("id")
    .maybeSingle();

  if (queueError || !updatedQueueEntry) {
    await supabase
      .from("appointments")
      .update({ status: appointment.status })
      .eq("id", appointment.id);
    if (queueError) throw queueError;
    throw new Error(
      "The queue entry was not updated. Check the database update policy.",
    );
  }
};
