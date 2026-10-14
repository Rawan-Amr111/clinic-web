import React from "react";
import { Clock3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "../../../../services/appointment";
import type { Appointment } from "../../../../domain/appointment";
import classes from "./TodaySchedule.module.css";

const TodaySchedule: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-CA");
  const { data: appointments = [], isLoading, isError } = useQuery<Appointment[]>({
    queryKey: ["appointments", today, "", false],
    queryFn: () => getAppointments({ date: today, status: "" }),
    staleTime: 60 * 1000,
  });
  const currentAppointment = appointments.find(
    (appointment) => appointment.status === "In Progress",
  );
  const nextAppointment = appointments.find(
    (appointment) => new Date(appointment.appointmentAt).getTime() >= Date.now(),
  );
  const highlightedId = currentAppointment?.id ?? nextAppointment?.id;

  return (
    <section className={classes.card}>
      <div className={classes.header}>
        <div className={classes.heading}>
          <Clock3 size={16} />
          <h2>Today's Schedule</h2>
        </div>
      </div>

      <div className={classes.timeline}>
        {isLoading ? (
          <p>Loading today&apos;s appointments...</p>
        ) : isError ? (
          <p>Could not load today&apos;s schedule.</p>
        ) : appointments.length === 0 ? (
          <p>No appointments scheduled for today.</p>
        ) : (
          appointments.slice(0, 5).map((appointment) => {
            const isHighlighted = appointment.id === highlightedId;
            const time = new Date(appointment.appointmentAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div className={classes.scheduleItem} key={appointment.id}>
                <time className={isHighlighted ? classes.activeTime : ""}>{time}</time>

                <span className={`${classes.dot} ${isHighlighted ? classes.activeDot : ""}`} />

                <div className={`${classes.event} ${isHighlighted ? classes.blueEvent : ""}`}>
                  <strong>{appointment.patient}</strong>
                  <span>
                    {appointment.doctor} · {appointment.department} · {appointment.displayStatus}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      {!isLoading && !isError && appointments.length > 5 && (
        <button type="button" className={classes.viewAll} onClick={() => navigate("/appointments")}>
          View all {appointments.length} appointments
        </button>
      )}
    </section>
  );
};

export default TodaySchedule;
