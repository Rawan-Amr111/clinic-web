import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import classes from "./PatientHeader.module.css";
import type { Patient } from "../../../../domain/patient";
import { calculateAge, formatMonthYear } from "../../../../services/patients";

function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <section className={classes.header}>
      <div className={classes.patientInfo}>
        <Avatar
          size={76}
          className={classes.avatar}
          src={patient.avatar_url || undefined}
        />

        <div className={classes.info}>
          <h1>{patient.full_name}</h1>

          <div className={classes.basicData}>
            <span className={classes.patientId}>
              ID: {patient.patient_code}
            </span>
            <span>
              DOB: {patient.date_of_birth} (
              {calculateAge(patient.date_of_birth)}y)
            </span>
          </div>

          <div className={classes.contactData}>
            <span>
              <PhoneOutlined />
              {patient.phone}
            </span>

            <span>
              <MailOutlined />
              {patient.email}
            </span>

            <span>
              <CalendarOutlined />
              Patient since {formatMonthYear(patient.created_at)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatientHeader;
