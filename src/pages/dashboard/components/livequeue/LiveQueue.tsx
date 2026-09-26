import React from "react";
import { ClipboardList } from "lucide-react";
import classes from "./liveQueue.module.css";

const queue = [
  {
    number: "01",
    name: "Sarah Jenkins",
    details: "General Checkup • Dr. Smith",
    status: "In Progress",
    time: "10:30 AM",
    note: "-",
  },
  {
    number: "02",
    name: "Michael Chang",
    details: "Consultation • Dr. Lee",
    status: "Waiting",
    time: "10:45 AM",
    note: "5m wait",
  },
  {
    number: "03",
    name: "Emily Roberts",
    details: "Blood Test • Lab",
    status: "Waiting",
    time: "11:00 AM",
    note: "On time",
  },
  {
    number: "04",
    name: "David O'Connor",
    details: "Follow-up • Dr. Smith",
    status: "Checked In",
    time: "11:15 AM",
    note: "-",
  },
];

const LiveQueue: React.FC = () => {
  return (
    <section className={classes.card}>
      <div className={classes.header}>
        <div className={classes.heading}>
          <ClipboardList size={30} strokeWidth={2.3} />
          <h2>Live Queue</h2>
        </div>

        <button type="button" className={classes.viewAll}>
          View All
        </button>
      </div>

      <div className={classes.queue}>
        {queue.map((patient) => (
          <div className={classes.queueItem} key={patient.number}>
            <span className={classes.number}>{patient.number}</span>

            <div className={classes.patientInfo}>
              <h3>{patient.name}</h3>
              <p>{patient.details}</p>
            </div>

            <span
              className={`${classes.status} ${
                patient.status === "In Progress"
                  ? classes.inProgress
                  : patient.status === "Waiting"
                    ? classes.waiting
                    : classes.checkedIn
              }`}
            >
              {patient.status}
            </span>

            <div className={classes.time}>
              <strong>{patient.time}</strong>
              <span>{patient.note}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveQueue;
