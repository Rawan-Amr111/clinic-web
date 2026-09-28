import {
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import classes from "./RecentVisits.module.css";
import type { PatientRecentVisit } from "../../../../domain/appointment";
import { getRecentVisits } from "../../../../services/appointment";

type RecentVisitsProps = {
  patientId: string;
};

const RecentVisits: React.FC<RecentVisitsProps> = ({ patientId }) => {
  const navigate = useNavigate();

  const {
    data: visits = [],
    isLoading,
    isError,
  } = useQuery<PatientRecentVisit[]>({
    queryKey: ["recent-visits", patientId],
    queryFn: () => getRecentVisits(patientId),
    staleTime: 60 * 1000,
  });

  const handleViewFullHistory = () => {
    navigate(`/patients/${patientId}/visits`);
  };

  return (
    <section className={classes.section}>
      <div className={classes.sectionHeader}>
        <div>
          <span className={classes.eyebrow}>PATIENT ACTIVITY</span>
          <h2>Recent Visits</h2>
          <p>Review the patient's latest completed consultations.</p>
        </div>

        <button
          type="button"
          className={classes.historyButton}
          onClick={handleViewFullHistory}
        >
          View Full History
        </button>
      </div>

      <div className={classes.visitsList}>
        {isLoading && <p>Loading recent visits...</p>}

        {isError && <p>Could not load recent visits.</p>}

        {!isLoading && !isError && visits.length === 0 && (
          <p>No completed visits found for this patient.</p>
        )}

        {!isLoading &&
          !isError &&
          visits.map((visit, index) => {
            const visitDate = new Date(visit.appointment_at);

            const formattedDate = visitDate.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            });

            const formattedTime = visitDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const [month, dayWithComma, year] = formattedDate.split(" ");

            return (
              <article
                key={visit.id}
                className={`${classes.visitCard} ${
                  index === 0 ? classes.activeCard : ""
                }`}
              >
                <div className={classes.dateBox}>
                  <span>{month}</span>
                  <strong>{dayWithComma.replace(",", "")}</strong>
                  <small>{year}</small>
                </div>

                <div className={classes.visitInfo}>
                  <div className={classes.visitTop}>
                    <span className={classes.completed}>{visit.status}</span>

                    <span className={classes.time}>
                      <ClockCircleOutlined />
                      {formattedTime}
                    </span>
                  </div>

                  <h3>{visit.reason ?? "Consultation"}</h3>

                  <div className={classes.details}>
                    <span>
                      <MedicineBoxOutlined />
                      {visit.specialty} · {visit.doctor_name}
                    </span>

                    <span>
                      <CalendarOutlined />
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default RecentVisits;