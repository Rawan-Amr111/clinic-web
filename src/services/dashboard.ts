import type { Doctor } from "../domain/doctor";
import { supabase } from "../lib/connect";

export type DashboardStats = {
  todayAppointments: number;
  patientsWaiting: number;
  completedAppointments: number;
};

export const getTodayAppointmentCountsByDoctor = async (): Promise<Record<string, number>> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfDay);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from("appointments")
    .select("doctor_id")
    .gte("appointment_at", startOfDay.toISOString())
    .lt("appointment_at", startOfTomorrow.toISOString());

  if (error) throw error;

  return (data ?? []).reduce<Record<string, number>>((counts, appointment) => {
    counts[appointment.doctor_id] = (counts[appointment.doctor_id] ?? 0) + 1;
    return counts;
  }, {});
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfDay);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const queueDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const [appointmentsResult, completedResult, waitingResult] = await Promise.all([
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("appointment_at", startOfDay.toISOString())
      .lt("appointment_at", startOfTomorrow.toISOString()),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("appointment_at", startOfDay.toISOString())
      .lt("appointment_at", startOfTomorrow.toISOString())
      .eq("status", "Completed"),
    supabase
      .from("queue_entries")
      .select("id", { count: "exact", head: true })
      .eq("queue_date", queueDate)
      .eq("status", "Waiting"),
  ]);

  const error = appointmentsResult.error ?? completedResult.error ?? waitingResult.error;
  if (error) throw error;

  return {
    todayAppointments: appointmentsResult.count ?? 0,
    patientsWaiting: waitingResult.count ?? 0,
    completedAppointments: completedResult.count ?? 0,
  };
};

export const getDashboardDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .order("name")
    .limit(3);

  if (error) {
    throw error;
  }

  return (data ?? []) as Doctor[];
};
