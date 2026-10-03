import type { LiveQueue, LiveQueueRow } from "../domain/liveQueue";
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
