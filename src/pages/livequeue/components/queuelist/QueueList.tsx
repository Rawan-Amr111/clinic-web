import React from "react";
import { Clock3, Hourglass } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import classes from "./QueueList.module.css";
import type { LiveQueue } from "../../../../domain/liveQueue";
import { getLiveQueue } from "../../../../services/liveQueue";

type QueueListProps = {
  doctorId?: string;
};

const QueueList: React.FC<QueueListProps> = ({ doctorId }) => {
  const {
    data: queue = [],
    isLoading,
    isError,
  } = useQuery<LiveQueue[]>({
    queryKey: ["live-queue", doctorId || "all"],
    queryFn: () => getLiveQueue({ doctorId }),
    staleTime: 60 * 1000,
  });

  const nextPatient = doctorId
    ? queue.find((patient) => patient.status === "Waiting")
    : undefined;

  if (isLoading) {
    return <p>Loading queue...</p>;
  }

  if (isError) {
    return <p>Error loading queue. Please try again later.</p>;
  }

  if (queue.length === 0) {
    return <p>No patients are currently in this doctor&apos;s queue.</p>;
  }

  return (
    <section className={classes.list}>
      {queue.map((patient, index) => {
        const previousPatient = queue[index - 1];

        const isNewDoctor =
          index === 0 || previousPatient.doctor_id !== patient.doctor_id;
        const isCurrent = patient.status === "In Consultation";
        const isNext = doctorId ? patient.id === nextPatient?.id : false;
        const isHold = patient.status === "On Hold";

        const appointmentTime = new Date(
          patient.appointment_at,
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <React.Fragment key={patient.id}>
            {isNewDoctor && (
              <div className={classes.doctorQueueHeader}>
                <div>
                  <strong>{patient.doctor_name}</strong>
                  <span>{patient.specialty}</span>
                </div>

                <span>Live Queue</span>
              </div>
            )}
            <article
              className={`${classes.patientCard} ${
                isCurrent ? classes.current : ""
              } ${isHold ? classes.hold : ""}`}
            >
              <div
                className={`${classes.queueNumber} ${
                  isCurrent ? classes.currentNumber : ""
                }`}
              >
                {isCurrent && <span>NOW</span>}
                {isNext && !isCurrent && <span>NEXT</span>}

                <strong>#{patient.queue_number}</strong>
              </div>

              <div className={classes.patientInfo}>
                <h2>{patient.patient_name}</h2>

                <div className={classes.meta}>
                  <span>
                    <Clock3 size={14} />
                    {appointmentTime}
                  </span>

                  {isCurrent && (
                    <>
                      <i />
                      <span>In Consultation</span>
                    </>
                  )}

                  {isNext && !isCurrent && (
                    <span className={classes.waitTime}>
                      <Hourglass size={14} />
                      Next in queue
                    </span>
                  )}

                  {!isCurrent && !isNext && (
                    <span className={classes.status}>{patient.status}</span>
                  )}
                </div>
              </div>

              {isCurrent && (
                <button className={classes.completeButton} type="button">
                  Complete
                </button>
              )}
            </article>
          </React.Fragment>
        );
      })}
    </section>
  );
};

export default QueueList;
