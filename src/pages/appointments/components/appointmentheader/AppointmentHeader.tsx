import React from "react";
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import classes from "./AppointmentHeader.module.css";

const AppointmentHeader: React.FC = () => {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.titleContent}>
          <h1>Appointments</h1>
          <p>Manage today's schedule and upcoming visits.</p>
        </div>
      </header>

      <div className={classes.filters}>
        <button type="button">
          <CalendarDays size={17} />
          Today, Oct 24
          <ChevronDown size={15} />
        </button>

        <button type="button">
          All Status
          <ChevronDown size={15} />
        </button>

        <button type="button">Confirmed</button>
        <button type="button">Waiting</button>

        <button type="button">
          <Search size={17} />
          All
        </button>
      </div>
    </>
  );
};

export default AppointmentHeader;
