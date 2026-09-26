import React from "react";
import {
  CalendarDays,
  Check,
  FileText,
  RotateCcw,
  X,
} from "lucide-react";
import type { Appointment } from "../../../../domain/appointment";
import classes from "./AppointmentDetails.module.css";

type AppointmentDetailsProps = {
  appointment: Appointment;
  onClose: () => void;
};

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
}) => {
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
            <p>ID: {appointment.patientId} • Female, 34 yrs</p>
            <span className={classes.alert}>⚠ Penicillin Allergy</span>
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

        <div className={classes.statusCard}>
          <div>
            <span>Current Status</span>
            <strong className={classes.green}>In Progress</strong>
          </div>

          <div>
            <span>Duration</span>
            <strong>09:00 - 09:45 AM</strong>
          </div>

          <div className={classes.progress}>
            <span />
          </div>

          <small>20 mins remaining</small>
        </div>

        <section className={classes.context}>
          <h3>Visit Context</h3>

          <article>
            <span>Reason for Visit</span>
            <p>
              Follow-up for mild chest palpitations reported during last
              week's general checkup. Holter monitor results review.
            </p>
          </article>

          <article className={classes.physician}>
            <span className={classes.doctorAvatar}>SC</span>

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
            <button type="button">
              <RotateCcw size={20} />
              Reschedule
            </button>

            <button type="button">
              <FileText size={20} />
              Add Notes
            </button>
          </div>
        </section>
      </div>

      <footer className={classes.footer}>
        <button type="button">
          <Check size={18} />
          Complete Appointment
        </button>
      </footer>
    </aside>
  );
};

export default AppointmentDetails;