import { LockOutlined } from "@ant-design/icons";
import classes from "./SharedRecords.module.css";

function SharedRecords() {
  return (
    <section>
      <div className={classes.sectionHeader}>
        <div>
          <span className={classes.eyebrow}>AUTHORIZED RECORDS</span>
          <h2>Medical Records</h2>
          <p>Records the patient has allowed you to access.</p>
        </div>
        <span className={classes.lockNotice}>
          <LockOutlined /> Access requests aren&apos;t connected yet.
        </span>
      </div>
      <p className={classes.emptyState}>
        No medical records have been shared with this clinic.
      </p>
    </section>
  );
}

export default SharedRecords;
