import React from "react";
import { Clock3 } from "lucide-react";
import classes from "./TodaySchedule.module.css";

const schedule = [
  {
    time: "09:00 AM",
    title: "Morning Briefing",
    subtitle: "All Staff",
    color: "neutral",
  },
  {
    time: "10:30 AM",
    title: "Peak Patient Flow",
    subtitle: "Expected 15 patients",
    color: "blue",
  },
  {
    time: "12:00 PM",
    title: "Lunch Break Shift 1",
    subtitle: "",
    color: "neutral",
  },
  {
    time: "02:00 PM",
    title: "Specialist",
    subtitle: "",
    color: "neutral",
  },
];

const TodaySchedule: React.FC = () => {
  return (
    <section className={classes.card}>
      <div className={classes.header}>
        <div className={classes.heading}>
          <Clock3 size={16} />
          <h2>Today's Schedule</h2>
        </div>
      </div>

      <div className={classes.timeline}>
        {schedule.map((item) => (
          <div className={classes.scheduleItem} key={item.time}>
            <time>{item.time}</time>

            <span
              className={`${classes.dot} ${
                item.color === "blue" ? classes.activeDot : ""
              }`}
            />

            <div
              className={`${classes.event} ${
                item.color === "blue" ? classes.blueEvent : ""
              }`}
            >
              <strong>{item.title}</strong>
              {item.subtitle && <span>{item.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodaySchedule;