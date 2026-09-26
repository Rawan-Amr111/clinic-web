import React from "react";
import { CalendarDays } from "lucide-react";
import type { Doctor, DoctorStatus } from "../../../../domain/doctor";
import classes from "./DoctorsGrid.module.css";

type DoctorsGridProps = {
  doctors: Doctor[];
  isUpdatingStatus: boolean;
  onToggleStatus: (doctorId: string, currentStatus: DoctorStatus) => void;
};
const DoctorsGrid: React.FC<DoctorsGridProps> = ({
  doctors,
  isUpdatingStatus,
  onToggleStatus,
}) => {
  return (
    <section className={classes.grid}>
      {doctors.map((doctor) => {
        const initials = doctor.name
          .replace("Dr. ", "")
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2);

        return (
          <article
            key={doctor.id}
            className={`${classes.card} ${
              doctor.status === "Inactive" ? classes.onLeaveCard : ""
            }`}
          >
            <div className={classes.topRow}>
              {doctor.image ? (
                <img
                  className={classes.avatar}
                  src={doctor.image}
                  alt={doctor.name}
                />
              ) : (
                <span className={classes.initials}>{initials}</span>
              )}

              <button
                type="button"
                disabled={isUpdatingStatus}
                aria-label={`Toggle ${doctor.name} status`}
                className={`${classes.toggle} ${
                  doctor.status === "Active" ? classes.toggleOn : ""
                }`}
                onClick={() => onToggleStatus(doctor.id, doctor.status)}
              >
                <span />
              </button>
            </div>

            <div className={classes.info}>
              <h2>{doctor.name}</h2>
              <p>{doctor.specialty}</p>

              <span
                className={
                  doctor.status === "Active"
                    ? classes.activeBadge
                    : classes.leaveBadge
                }
              >
                {doctor.status}
              </span>
            </div>

            <div className={classes.appointments}>
              <CalendarDays size={15} />
              <span>Today's Appts</span>
              <strong>0</strong>
            </div>

            <button type="button" className={classes.scheduleButton}>
              <CalendarDays size={15} />
              View Schedule
            </button>
          </article>
        );
      })}
    </section>
  );
};

export default DoctorsGrid;
