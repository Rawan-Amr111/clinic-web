import {
  ExperimentOutlined,
  LockOutlined,
  MedicineBoxOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import classes from "./SharedRecords.module.css";

const records = [
  {
    id: "record-001",
    title: "Comprehensive Metabolic Panel",
    provider: "Lab Results · Quest Diagnostics",
    date: "Oct 25, 2023",
    action: "View PDF",
    icon: <ExperimentOutlined />,
  },
  {
    id: "record-002",
    title: "MRI - Lumbar Spine",
    provider: "Imaging · City Hospital",
    date: "Sep 14, 2023",
    action: "View Images",
    icon: <PictureOutlined />,
  },
  {
    id: "record-003",
    title: "Immunization Record",
    provider: "State Registry · State Dept of Health",
    date: "Jan 05, 2023",
    action: "View Record",
    icon: <MedicineBoxOutlined />,
  },
];

function SharedRecords() {
  return (
    <section>
      <div className={classes.sectionHeader}>
        <div>
          <span className={classes.eyebrow}>AUTHORIZED RECORDS</span>
          <h2>Medical Records</h2>
          <p>Records the patient has allowed you to access.</p>
        </div>

        <button type="button" className={classes.requestButton}>
          + Request Access
        </button>
      </div>

      <div className={classes.recordsGrid}>
        {records.map((record) => (
          <article key={record.id} className={classes.recordCard}>
            <div className={classes.cardTop}>
              <span className={classes.icon}>{record.icon}</span>
              <LockOutlined className={classes.lock} />
            </div>

            <h3>{record.title}</h3>
            <p>{record.provider}</p>

            <div className={classes.cardFooter}>
              <span>{record.date}</span>

              <button type="button">{record.action}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SharedRecords;