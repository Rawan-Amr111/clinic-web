import {
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./RecentVisits.module.css";

type VisitStatus = "Completed" | "Cancelled" | "Upcoming";

type Visit = {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: VisitStatus;
  active?: boolean;
};

const visits: Visit[] = [
  {
    id: "visit-001",
    title: "Annual Checkup",
    doctor: "Dr. Robert Chen",
    specialty: "General Medicine",
    date: "Oct 24, 2023",
    time: "10:30 AM",
    status: "Completed",
    active: true,
  },
  {
    id: "visit-002",
    title: "Dermatology Consult",
    doctor: "Dr. Amanda Torres",
    specialty: "Dermatology",
    date: "Mar 12, 2023",
    time: "01:00 PM",
    status: "Completed",
  },
  {
    id: "visit-003",
    title: "Follow-up Consultation",
    doctor: "Dr. Sarah Wilson",
    specialty: "General Medicine",
    date: "Jan 08, 2023",
    time: "11:15 AM",
    status: "Completed",
  },
];

function RecentVisits() {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();

  const handleViewFullHistory = () => {
    if (!patientId) return;

    navigate(`/patients/${patientId}/visits`);
  };

  return (
    <section className={classes.section}>
      <div className={classes.sectionHeader}>
        <div>
          <span className={classes.eyebrow}>PATIENT ACTIVITY</span>
          <h2>Recent Visits</h2>
          <p>Review the patient's latest consultations and appointments.</p>
        </div>

        <button
          type="button"
          className={classes.historyButton}
          disabled={!patientId}
          onClick={handleViewFullHistory}
        >
          View Full History
        </button>
      </div>

      <div className={classes.visitsList}>
        {visits.map((visit) => {
          const [month, dayWithComma, year] = visit.date.split(" ");

          return (
            <article
              key={visit.id}
              className={`${classes.visitCard} ${
                visit.active ? classes.activeCard : ""
              }`}
            >
              <div className={classes.dateBox}>
                <span>{month}</span>
                <strong>{dayWithComma.replace(",", "")}</strong>
                <small>{year}</small>
              </div>

              <div className={classes.visitInfo}>
                <div className={classes.visitTop}>
                  <span className={classes[visit.status.toLowerCase()]}>
                    {visit.status}
                  </span>

                  <span className={classes.time}>
                    <ClockCircleOutlined />
                    {visit.time}
                  </span>
                </div>

                <h3>{visit.title}</h3>

                <div className={classes.details}>
                  <span>
                    <MedicineBoxOutlined />
                    {visit.specialty} · {visit.doctor}
                  </span>

                  <span>
                    <CalendarOutlined />
                    {visit.date}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RecentVisits;
