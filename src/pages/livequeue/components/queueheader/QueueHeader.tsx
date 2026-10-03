import React from "react";
import classes from "./QueueHeader.module.css";
import type { Doctor } from "../../../../domain/doctor";

type QueueHeaderProps = {
  departments: string[];
  doctors: Doctor[];
  selectedDepartment: string;
  selectedDoctorId: string;
  isLoadingDoctors: boolean;
  onDepartmentChange: (department: string) => void;
  onDoctorChange: (doctorId: string) => void;
};

const QueueHeader: React.FC<QueueHeaderProps> = ({
  departments,
  doctors,
  selectedDepartment,
  selectedDoctorId,
  isLoadingDoctors,
  onDepartmentChange,
  onDoctorChange,
}) => {
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
            value={selectedDepartment}
            onChange={(event) => onDepartmentChange(event.target.value)}
            disabled={isLoadingDoctors}
          >
            <option value="">
              {isLoadingDoctors ? "Loading departments..." : "Select department"}
            </option>

            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className={classes.filter}>
          <span className={classes.srOnly}>Doctor</span>

          <select
            value={selectedDoctorId}
            onChange={(event) => onDoctorChange(event.target.value)}
            disabled={!selectedDepartment || isLoadingDoctors}
          >
            <option value="">
              {!selectedDepartment
                ? "Select department first"
                : isLoadingDoctors
                  ? "Loading doctors..."
                  : "Select doctor"}
            </option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} · {doctor.doctor_code}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};

export default QueueHeader;