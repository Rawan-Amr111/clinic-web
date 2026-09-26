import React from "react";
import { Clock3 } from "lucide-react";
import type { Appointment } from "../../../../domain/appointment";
import classes from "./AppointmentList.module.css";

type AppointmentListProps = {
  appointments: Appointment[];
  selectedId: number | null;
  onSelect: (appointment: Appointment) => void;
};

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  selectedId,
  onSelect,
}) => {
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
              className={`${classes.status} ${
                appointment.status === "In Progress"
                  ? classes.inProgress
                  : classes.waiting
              }`}
            >
              {appointment.status}
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