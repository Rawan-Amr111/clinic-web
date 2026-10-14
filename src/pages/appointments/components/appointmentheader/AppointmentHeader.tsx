import React from "react";
import { CalendarDays } from "lucide-react";
import classes from "./AppointmentHeader.module.css";
import type { AppointmentStatus } from "../../../../domain/appointment";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
type AppointmentHeaderProps = {
  status: AppointmentStatus | "";
  selectedDate: Dayjs | null;
  onStatusChange: (status: AppointmentStatus | "") => void;
  onDateChange: (date: Dayjs | null) => void;
  doctorName?: string | null;
  onClearDoctorFilter: () => void;
};
const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  status,
  selectedDate,
  onStatusChange,
  onDateChange,
  doctorName,
  onClearDoctorFilter,
}) => {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.titleContent}>
          <h1>Appointments</h1>
          <p>
            {doctorName
              ? `Schedule for ${doctorName}`
              : "Manage today's schedule and upcoming visits."}
          </p>
        </div>
      </header>

      <div className={classes.filters}>
        {doctorName && (
          <button type="button" onClick={onClearDoctorFilter}>
            Clear doctor filter
          </button>
        )}
        <DatePicker
          value={selectedDate}
          onChange={onDateChange}
          minDate={dayjs().startOf("day")}
          format="ddd, MMM D"
          allowClear={true}
          suffixIcon={<CalendarDays size={17} />}
        />

        <button className={status === "" ? classes.activeFilter : ""} type="button" onClick={() => onStatusChange("")}>
          All Status
        </button>
        <button className={status === "In Progress" ? classes.activeFilter : ""} type="button" onClick={() => onStatusChange("In Progress")}>
          In Progress
        </button>
        <button className={status === "Waiting" ? classes.activeFilter : ""} type="button" onClick={() => onStatusChange("Waiting")}>
          Waiting
        </button>
        <button className={status === "Completed" ? classes.activeFilter : ""} type="button" onClick={() => onStatusChange("Completed")}>
          Completed
        </button>
        <button className={status === "Cancelled" ? classes.activeFilter : ""} type="button" onClick={() => onStatusChange("Cancelled")}>
          Cancelled
        </button>
      </div>
    </>
  );
};

export default AppointmentHeader;
