import React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import classes from "./AppointmentHeader.module.css";
import type { AppointmentStatus } from "../../../../domain/appointment";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
type AppointmentHeaderProps = {
  status: AppointmentStatus | "";
  selectedDate: Dayjs | null;
  onStatusChange: (status: AppointmentStatus | "") => void;
  onDateChange: (date: Dayjs | null) => void;
};
const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  status,
  selectedDate,
  onStatusChange,
  onDateChange,
}) => {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.titleContent}>
          <h1>Appointments</h1>
          <p>Manage today's schedule and upcoming visits.</p>
        </div>
      </header>

      <div className={classes.filters}>
        <DatePicker
          value={selectedDate}
          onChange={onDateChange}
          minDate={dayjs().startOf("day")}
          format="ddd, MMM D"
          allowClear={true}
          suffixIcon={<CalendarDays size={17} />}
        />

        <button type="button">
          {status || "All Status"}
          <ChevronDown size={15} />
        </button>
        <button type="button" onClick={() => onStatusChange("")}>
          All Status
        </button>
        <button type="button" onClick={() => onStatusChange("In Progress")}>
          In Progress
        </button>
        <button type="button" onClick={() => onStatusChange("Waiting")}>
          Waiting
        </button>
      </div>
    </>
  );
};

export default AppointmentHeader;
