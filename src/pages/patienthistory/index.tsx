import { useState } from "react";
import PatientHeader from "./components/patientheader/PatientHeader";
import RecentVisits from "./components/recentvisits/RecentVisits";
import SharedRecords from "./components/sharedrecords/SharedRecords";
import classes from "./index.module.css";
import { getPatientById } from "../../services/patients";
import type { Patient } from "../../domain/patient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

type ActiveTab = "visits" | "records";

function PatientHistory() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("visits");
  const { patientId } = useParams<{ patientId: string }>();

  const {
    data: patient,
    isLoading,
    isError,
  } = useQuery<Patient>({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId!),
    enabled: Boolean(patientId),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <p>Loading patient history...</p>;
  }
  if (isError || !patient) {
    return <p>Error loading patient history. Please try again later.</p>;
  }
  return (
    <main className={classes.page}>
      <div className={classes.accessAlert}>
        <span>ⓘ</span>
        <p>
          <strong>Admin Access Restricted.</strong>
          You are currently viewing only explicitly shared medical records for
          this patient.
        </p>
      </div>

      <PatientHeader patient={patient} />

      <section className={classes.contentSection}>
        <div className={classes.tabs}>
          <button
            type="button"
            className={activeTab === "visits" ? classes.activeTab : ""}
            onClick={() => setActiveTab("visits")}
          >
            Recent Visits
          </button>

          <button
            type="button"
            className={activeTab === "records" ? classes.activeTab : ""}
            onClick={() => setActiveTab("records")}
          >
            Medical Records
          </button>
        </div>

        <div className={classes.tabContent}>
          {activeTab === "visits" ? <RecentVisits /> : <SharedRecords />}
        </div>
      </section>
    </main>
  );
}

export default PatientHistory;
