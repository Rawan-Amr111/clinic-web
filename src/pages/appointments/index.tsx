import React, { useState } from "react";
import type { Appointment } from "../../domain/appointment";
import AppointmentHeader from "./components/appointmentheader/AppointmentHeader";
import AppointmentList from "./components/appointmentlist/AppointmentList";
import AppointmentDetails from "./components/appointmentdetails/AppointmentDetails";
import classes from "./index.module.css";

const appointments: Appointment[] = [
  {
    id: 1,
    time: "09:00 AM",
    duration: "45 min",
    patient: "Eleanor Vance",
    initials: "EV",
    patientId: "PT-8821",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    status: "In Progress",
    phone: "(555) 123-4567",
    dob: "May 12, 1989",
  },
  {
    id: 2,
    time: "09:30 AM",
    duration: "30 min",
    patient: "Marcus Lloyd",
    initials: "ML",
    patientId: "PT-4492",
    doctor: "Dr. James Wilson",
    department: "General Practice",
    status: "Waiting",
    phone: "(555) 987-3421",
    dob: "Nov 08, 1992",
  },
];

const AppointmentsPage: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  return (
    <main
      className={`${classes.container} ${
        selectedAppointment ? classes.withDetails : ""
      }`}
    >
      <section className={classes.leftSide}>
        <AppointmentHeader />

        <AppointmentList
          appointments={appointments}
          selectedId={selectedAppointment?.id ?? null}
          onSelect={setSelectedAppointment}
        />
      </section>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </main>
  );
};

export default AppointmentsPage;