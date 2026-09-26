import React from "react";
import { BriefcaseMedical, Plus } from "lucide-react";
import classes from "./DoctorStatus.module.css";

const doctors = [
  {
    name: "Dr. Smith",
    state: "Available",
    color: "green",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Dr. Lee",
    state: "In Consult",
    color: "red",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Dr. Jones",
    state: "Off Duty",
    color: "gray",
    initials: "AJ",
  },
];

const DoctorStatus: React.FC = () => {
  return (
    <section className={classes.card}>
      <div className={classes.header}>
        <div className={classes.heading}>
          <BriefcaseMedical size={30} strokeWidth={2.3} />
          <h2>Doctor Status</h2>
        </div>
      </div>

      <div className={classes.grid}>
        {doctors.map((doctor) => (
          <article className={classes.doctor} key={doctor.name}>
            <div className={classes.avatarWrapper}>
              {doctor.image ? (
                <img
                  className={classes.avatarImage}
                  src={doctor.image}
                  alt={doctor.name}
                />
              ) : (
                <span className={classes.avatarInitials}>
                  {doctor.initials}
                </span>
              )}

              <span
                className={`${classes.statusDot} ${classes[doctor.color]}`}
              />
            </div>

            <strong>{doctor.name}</strong>

            <span className={`${classes.badge} ${classes[doctor.color]}`}>
              {doctor.state}
            </span>
          </article>
        ))}

        <button type="button" className={classes.viewAll}>
          <Plus size={30} strokeWidth={2} />
          <span>View All</span>
        </button>
      </div>
    </section>
  );
};

export default DoctorStatus;
