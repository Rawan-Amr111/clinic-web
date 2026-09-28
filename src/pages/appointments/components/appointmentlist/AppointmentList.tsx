import React from "react";
import { Clock3 } from "lucide-react";
import type { Appointment } from "../../../../domain/appointment";
import classes from "./AppointmentList.module.css";

type AppointmentListProps = {
  appointments: Appointment[];
  selectedId: string | null;
  onSelect: (appointment: Appointment) => void;
};

const getStatusClass = (status: Appointment["displayStatus"]) => {
  if (status === "Upcoming") return classes.upcoming;
  if (status === "In Progress") return classes.inProgress;
  if (status === "Completed") return classes.completed;
  if (status === "Cancelled") return classes.cancelled;

  return classes.waiting;
};

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  selectedId,
  onSelect,
}) => {
  console.log("Appointments rendered in page:", appointments);
  return (
    <section>
      <div className={classes.tableHeader}>
        <span>Time</span>
        <span>Patient</span>
        <span>Doctor / Dept</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      <div className={classes.list}>
        {appointments.map((appointment) => (
          <button
            type="button"
            key={appointment.id}
            onClick={() => onSelect(appointment)}
            className={`${classes.card} ${
              selectedId === appointment.id ? classes.selected : ""
            }`}
          >
            <div className={classes.time}>
              <strong>{appointment.time}</strong>
            </div>

            <div className={classes.patient}>
              <span className={classes.avatar}>{appointment.initials}</span>

              <div>
                <strong>{appointment.patient}</strong>
                <span>ID: {appointment.patientId}</span>
              </div>
            </div>

            <div className={classes.doctor}>
              <strong>{appointment.doctor}</strong>
              <span>{appointment.department}</span>
            </div>

            <span
              className={`${classes.status} ${getStatusClass(
                appointment.displayStatus,
              )}`}
            >
              {appointment.displayStatus}
            </span>

            <span className={classes.arrow}>›</span>

            <span className={classes.mobileTime}>
              <Clock3 size={14} />
              {appointment.time}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default AppointmentList;
