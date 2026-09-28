import React from "react";
import { BriefcaseMedical, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import classes from "./DoctorStatus.module.css";
import type { Doctor } from "../../../../domain/doctor";
import { getDashboardDoctors } from "../../../../services/dashboard";

const DoctorStatus: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery<Doctor[]>({
    queryKey: ["dashboard-doctors"],
    queryFn: getDashboardDoctors,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <section className={classes.card}>Loading doctors...</section>;
  }

  if (isError) {
    return <section className={classes.card}>Could not load doctors.</section>;
  }

  return (
    <section className={classes.card}>
      <div className={classes.header}>
        <div className={classes.heading}>
          <BriefcaseMedical size={30} strokeWidth={2.3} />
          <h2>Doctor Status</h2>
        </div>
      </div>

      <div className={classes.grid}>
        {doctors.map((doctor) => {
          const initials = doctor.name
            .replace("Dr. ", "")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2);

          const color = doctor.status === "Active" ? "green" : "gray";

          return (
            <article className={classes.doctor} key={doctor.id}>
              <div className={classes.avatarWrapper}>
                {doctor.image ? (
                  <img
                    className={classes.avatarImage}
                    src={doctor.image}
                    alt={doctor.name}
                  />
                ) : (
                  <span className={classes.avatarInitials}>{initials}</span>
                )}

                <span className={`${classes.statusDot} ${classes[color]}`} />
              </div>

              <strong>{doctor.name}</strong>

              <span className={`${classes.badge} ${classes[color]}`}>
                {doctor.status}
              </span>
            </article>
          );
        })}

        <button
          type="button"
          className={classes.viewAll}
          onClick={() => navigate("/doctors")}
        >
          <Plus size={30} strokeWidth={2} />
          <span>View All</span>
        </button>
      </div>
    </section>
  );
};

export default DoctorStatus;
