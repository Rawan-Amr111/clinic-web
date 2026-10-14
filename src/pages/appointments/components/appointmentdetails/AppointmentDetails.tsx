import React, { useEffect, useState } from "react";
import { CalendarDays, Check, FileText, RotateCcw, X, XCircle } from "lucide-react";
import { message, Popconfirm } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Appointment, AppointmentStatus } from "../../../../domain/appointment";
import classes from "./AppointmentDetails.module.css";
import { calculateAge } from "../../../../services/patients";
import { updateAppointment } from "../../../../services/appointment";

type AppointmentDetailsProps = {
  appointment: Appointment;
  onClose: () => void;
  onAppointmentChange: (updates: Partial<Appointment>) => void;
};

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
  onAppointmentChange,
}) => {
  const queryClient = useQueryClient();
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [notes, setNotes] = useState(appointment.reason ?? "");
  const appointmentDate = new Date(appointment.appointmentAt);
  const [date, setDate] = useState(
    `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, "0")}-${String(appointmentDate.getDate()).padStart(2, "0")}`,
  );
  const [time, setTime] = useState(
    `${String(appointmentDate.getHours()).padStart(2, "0")}:${String(appointmentDate.getMinutes()).padStart(2, "0")}`,
  );
  useEffect(() => {
    const nextAppointmentDate = new Date(appointment.appointmentAt);
    setNotes(appointment.reason ?? "");
    setDate(
      `${nextAppointmentDate.getFullYear()}-${String(nextAppointmentDate.getMonth() + 1).padStart(2, "0")}-${String(nextAppointmentDate.getDate()).padStart(2, "0")}`,
    );
    setTime(
      `${String(nextAppointmentDate.getHours()).padStart(2, "0")}:${String(nextAppointmentDate.getMinutes()).padStart(2, "0")}`,
    );
  }, [appointment.id, appointment.appointmentAt, appointment.reason]);
  const mutation = useMutation({
    mutationFn: (updates: { appointment_at?: string; reason?: string | null; status?: AppointmentStatus }) =>
      updateAppointment(appointment.id, updates),
    onSuccess: (_result, updates) => {
      onAppointmentChange({
        ...(updates.appointment_at ? {
          appointmentAt: updates.appointment_at,
          time: new Date(updates.appointment_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        } : {}),
        ...(updates.reason !== undefined ? { reason: updates.reason } : {}),
        ...(updates.status ? { status: updates.status, displayStatus: updates.status } : {}),
      });
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["live-queue"] });
      void queryClient.invalidateQueries({ queryKey: ["patient-visits"] });
      void queryClient.invalidateQueries({ queryKey: ["recent-visits"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      void queryClient.invalidateQueries({ queryKey: ["doctor-appointment-counts"] });
      message.success(
        updates.status === "Cancelled"
          ? "Appointment cancelled."
          : updates.status === "Completed"
            ? "Appointment completed."
            : "Appointment updated.",
      );
      setEditingNotes(false);
      setEditingSchedule(false);
    },
    onError: (error: Error) => message.error(error.message || "Could not update appointment."),
  });

  const saveReschedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date || !time) return;
    mutation.mutate({ appointment_at: new Date(`${date}T${time}:00`).toISOString() });
  };

  return (
    <aside className={classes.panel}>
      <header className={classes.header}>
        <div>
          <CalendarDays size={20} />
          <h2>Appointment Details</h2>
        </div>

        <button type="button" onClick={onClose}>
          <X size={19} />
        </button>
      </header>

      <div className={classes.content}>
        <div className={classes.patientDetails}>
          <span className={classes.avatar}>{appointment.initials}</span>

          <div>
            <h3>{appointment.patient}</h3>
            <p>
              ID: {appointment.patientId} • {calculateAge(appointment.dob)}
            </p>
          </div>
        </div>

        <div className={classes.contact}>
          <div>
            <span>Phone</span>
            <strong>{appointment.phone}</strong>
          </div>

          <div>
            <span>DOB</span>
            <strong>{appointment.dob}</strong>
          </div>
        </div>

        <section className={classes.context}>
          <h3>Visit Context</h3>

          <article>
            <span>Reason for Visit</span>
            <p>{appointment.reason ?? "No visit reason provided."}</p>
          </article>

          <article className={classes.physician}>
            <span className={classes.doctorAvatar}>
              {appointment.doctor.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </span>

            <div>
              <small>Attending Physician</small>
              <strong>{appointment.doctor}</strong>
              <span>{appointment.department} Dept.</span>
            </div>
          </article>
        </section>

        <section className={classes.actions}>
          <h3>Actions</h3>

          <div>
            <button type="button" onClick={() => setEditingSchedule((open) => !open)}>
              <RotateCcw size={20} />
              Reschedule
            </button>

            <button type="button" onClick={() => setEditingNotes((open) => !open)}>
              <FileText size={20} />
              Add Notes
            </button>
          </div>
          {editingSchedule && (
            <form onSubmit={saveReschedule} className={classes.editForm}>
              <label>Date<input type="date" value={date} min={new Date().toLocaleDateString("en-CA")} onChange={(event) => setDate(event.target.value)} required /></label>
              <label>Time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
              <button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save schedule"}</button>
            </form>
          )}
          {editingNotes && (
            <form onSubmit={(event) => { event.preventDefault(); mutation.mutate({ reason: notes.trim() || null }); }} className={classes.editForm}>
              <label>Appointment notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} /></label>
              <button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save notes"}</button>
            </form>
          )}
        </section>
      </div>

      <footer className={classes.footer}>
        {appointment.status === "Completed" ? (
          <button type="button" disabled>
            <Check size={18} />
            Completed
          </button>
        ) : appointment.status === "Cancelled" ? (
          <span className={classes.cancelledMessage}>
            This appointment was cancelled.
          </span>
        ) : (
          <div className={classes.footerActions}>
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate({ status: "Completed" })}
            >
              <Check size={18} />
              Complete Appointment
            </button>
            <Popconfirm
              title="Cancel this appointment?"
              description="The appointment will be marked cancelled and removed from the live queue."
              okText="Cancel appointment"
              cancelText="Keep appointment"
              okButtonProps={{ danger: true, loading: mutation.isPending }}
              onConfirm={() => mutation.mutate({ status: "Cancelled" })}
            >
              <button
                type="button"
                className={classes.cancelButton}
                disabled={mutation.isPending}
              >
                <XCircle size={18} />
                Cancel Appointment
              </button>
            </Popconfirm>
          </div>
        )}
      </footer>
    </aside>
  );
};

export default AppointmentDetails;
