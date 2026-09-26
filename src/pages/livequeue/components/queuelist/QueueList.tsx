import React from "react";
import { Clock3, Hourglass } from "lucide-react";
import classes from "./QueueList.module.css";

const patients = [
  {
    id: "14",
    label: "NOW",
    name: "Sarah Jenkins",
    time: "10:15 AM",
    status: "In Consultation",
    type: "current",
  },
  {
    id: "15",
    label: "NEXT",
    name: "Michael Chang",
    time: "10:30 AM",
    status: "5m wait",
    type: "next",
  },
  {
    id: "16",
    name: "Emily Blunt",
    time: "10:45 AM",
    status: "WAITING",
    type: "waiting",
  },
  {
    id: "17",
    name: "David Rodriguez",
    time: "11:00 AM",
    status: "WAITING",
    type: "waiting",
  },
  {
    id: "12",
    name: "Robert King",
    time: "09:45 AM",
    status: "ON HOLD",
    type: "hold",
  },
];

const QueueList: React.FC = () => {
  return (
    <section className={classes.list}>
      {patients.map((patient) => {
        const isCurrent = patient.type === "current";
        const isNext = patient.type === "next";
        const isHold = patient.type === "hold";

        return (
          <article
            className={`${classes.patientCard} ${
              isCurrent ? classes.current : ""
            } ${isHold ? classes.hold : ""}`}
            key={patient.id}
          >
            <div
              className={`${classes.queueNumber} ${
                isCurrent ? classes.currentNumber : ""
              }`}
            >
              {patient.label && <span>{patient.label}</span>}
              <strong>#{patient.id}</strong>
            </div>

            <div className={classes.patientInfo}>
              <h2>{patient.name}</h2>

              <div className={classes.meta}>
                <span>
                  <Clock3 size={14} />
                  {patient.time}
                </span>

                {isCurrent && (
                  <>
                    <i />
                    <span>In Consultation</span>
                  </>
                )}

                {isNext && (
                  <span className={classes.waitTime}>
                    <Hourglass size={14} />
                    {patient.status}
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
        );
      })}
    </section>
  );
};

export default QueueList;