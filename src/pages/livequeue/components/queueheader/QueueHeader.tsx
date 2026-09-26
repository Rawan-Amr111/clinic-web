import React, { useState } from "react";
import classes from "./QueueHeader.module.css";

const QueueHeader: React.FC = () => {
  const [department, setDepartment] = useState("Cardiology");
  const [doctor, setDoctor] = useState("Dr. Smith (Room 1)");

  return (
    <header className={classes.header}>
      <div className={classes.titleContent}>
        <h1>Live Queue</h1>
        <p>Manage patient flow across departments.</p>
      </div>

      <div className={classes.filters}>
        <label className={classes.filter}>
          <span className={classes.srOnly}>Department</span>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <option>Cardiology</option>
            <option>General Practice</option>
            <option>Dermatology</option>
            <option>Neurology</option>
          </select>
        </label>

        <label className={classes.filter}>
          <span className={classes.srOnly}>Doctor</span>
          <select
            value={doctor}
            onChange={(event) => setDoctor(event.target.value)}
          >
            <option>Dr. Smith (Room 1)</option>
            <option>Dr. Lee (Room 2)</option>
            <option>Dr. Jones (Room 3)</option>
          </select>
        </label>
      </div>
    </header>
  );
};

export default QueueHeader;