import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import classes from "./index.module.css";
import type { Doctor } from "../../domain/doctor";
import { getActiveDoctors } from "../../services/doctors";
import QueueHeader from "./components/queueheader/QueueHeader";
import QueueList from "./components/queuelist/QueueList";
import SwapRequests from "./components/swaprequests/SwapRequests";

const LiveQueuePage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const { data: doctors = [], isLoading: isLoadingDoctors } = useQuery<
    Doctor[]
  >({
    queryKey: ["active-doctors"],
    queryFn: getActiveDoctors,
    staleTime: 60 * 1000,
  });

  const departments = [...new Set(doctors.map((doctor) => doctor.specialty))];

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialty === selectedDepartment,
  );

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setSelectedDoctorId("");
  };

  return (
    <main className={classes.container}>
      <QueueHeader
        departments={departments}
        doctors={filteredDoctors}
        selectedDepartment={selectedDepartment}
        selectedDoctorId={selectedDoctorId}
        isLoadingDoctors={isLoadingDoctors}
        onDepartmentChange={handleDepartmentChange}
        onDoctorChange={setSelectedDoctorId}
      />

      <div className={classes.pageContent}>
        <section className={classes.queueSection}>
          <QueueList doctorId={selectedDoctorId || undefined} />
        </section>

        <aside className={classes.sideContent}>
          <SwapRequests />
        </aside>
      </div>
    </main>
  );
};

export default LiveQueuePage;
