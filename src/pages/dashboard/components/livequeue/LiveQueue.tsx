import React from "react";
import { ClipboardList } from "lucide-react";
import classes from "./liveQueue.module.css";
import { getLiveQueue } from "../../../../services/liveQueue";
import { useQuery } from "@tanstack/react-query";
import type { LiveQueue } from "../../../../domain/liveQueue";
import { useNavigate } from "react-router-dom";

const LiveQueue: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: queue = [],
    isLoading,
    isError,
  } = useQuery<LiveQueue[]>({
    queryKey: ["live-queue"],
    queryFn: () => getLiveQueue({ limit: 5 }),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <p>Loading live queue...</p>;
  }

  if (isError) {
    return <p>Error loading live queue. Please try again later.</p>;
  }

  return (
    <section className={classes.card}>
      <div className={classes.header}>
        <div className={classes.heading}>
          <ClipboardList size={30} strokeWidth={2.3} />
          <h2>Live Queue</h2>
        </div>

        <button
          type="button"
          className={classes.viewAll}
          onClick={() => navigate("/live-queue")}
        >
          View All
        </button>
      </div>

      <div className={classes.queue}>
        {queue.map((patient) => {
          const appointmentTime = new Date(
            patient.appointment_at,
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div className={classes.queueItem} key={patient.id}>
              <span className={classes.number}>#{patient.queue_number}</span>

              <div className={classes.patientInfo}>
                <h3>{patient.patient_name}</h3>
                <p>
                  {patient.doctor_name} · {patient.specialty}
                </p>
              </div>

              <span
                className={`${classes.status} ${
                  patient.status === "In Consultation"
                    ? classes.inProgress
                    : patient.status === "Waiting"
                      ? classes.waiting
                      : classes.checkedIn
                }`}
              >
                {patient.status}
              </span>

              <div className={classes.time}>
                <strong>{appointmentTime}</strong>
                <span>{patient.patient_code}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LiveQueue;
