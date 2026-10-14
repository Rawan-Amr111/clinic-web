import React, { useState } from "react";
import type { Appointment, AppointmentStatus } from "../../domain/appointment";
import AppointmentHeader from "./components/appointmentheader/AppointmentHeader";
import AppointmentList from "./components/appointmentlist/AppointmentList";
import AppointmentDetails from "./components/appointmentdetails/AppointmentDetails";
import classes from "./index.module.css";
import { getAppointments } from "../../services/appointment";
import { useQuery } from "@tanstack/react-query";
import { type Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";

const AppointmentsPage: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const doctorName = searchParams.get("doctorName");

  const dateFilter = selectedDate?.format("YYYY-MM-DD") ?? null;
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments", dateFilter, status, true, doctorId],
    queryFn: () =>
      getAppointments({
        date: dateFilter,
        status,
        includeClosed: true,
        doctorId,
      }),
    staleTime: 60 * 1000,
  });
  if (isLoading) {
    return <p>Loading appointments...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }
  return (
    <main
      className={`${classes.container} ${
        selectedAppointment ? classes.withDetails : ""
      }`}
    >
      <section className={classes.leftSide}>
        <AppointmentHeader
          status={status}
          selectedDate={selectedDate}
          onStatusChange={setStatus}
          onDateChange={setSelectedDate}
          doctorName={doctorName}
          onClearDoctorFilter={() => {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete("doctorId");
            nextParams.delete("doctorName");
            setSearchParams(nextParams);
          }}
        />

        <AppointmentList
          appointments={appointments}
          selectedId={selectedAppointment?.id ?? null}
          onSelect={setSelectedAppointment}
        />
      </section>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onAppointmentChange={(updates) =>
            setSelectedAppointment((current) => current ? { ...current, ...updates } : current)
          }
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </main>
  );
};

export default AppointmentsPage;
