import React, { useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  Check,
  Clock3,
  Save,
  Search,
  UserRoundPlus,
  X,
  Zap,
} from "lucide-react";
import classes from "./NewAppointmentModal.module.css";

type NewAppointmentModalProps = {
  onClose: () => void;
};

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  onClose,
}) => {
  const [visitType, setVisitType] = useState("General");
  const [addToQueue, setAddToQueue] = useState(true);

  const handleSubmit = () => {};

  return (
    <div className={classes.overlay} onMouseDown={onClose}>
      <form
        className={classes.modal}
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={classes.modalHeader}>
          <div className={classes.titleRow}>
            <div className={classes.headerIcon}>
              <CalendarPlus size={23} />
            </div>

            <div>
              <h2>New Appointment</h2>
              <p>
                Schedule an in-clinic consultation or add a patient directly to
                the live queue.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={classes.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </header>

        <main className={classes.content}>
          <div className={classes.sectionTop}>
            <h3>
              <UserRoundPlus size={15} />
              Patient Information
            </h3>

            <button type="button" className={classes.newPatient}>
              <span>+</span> New Patient
            </button>
          </div>

          <label className={classes.searchInput}>
            <Search size={17} />
            <input defaultValue="Eleanor Vance" aria-label="Search patient" />
          </label>

          <div className={classes.selectedPatient}>
            <span className={classes.patientAvatar}>EV</span>

            <div className={classes.patientInfo}>
              <div>
                <strong>Eleanor Vance</strong>
                <span className={classes.patientId}>ID: PT-8821</span>
              </div>

              <p>Female, 34 yrs • Insurance Active</p>
            </div>

            <button type="button" className={classes.removePatient}>
              <X size={17} />
            </button>
          </div>

          <div className={classes.fieldsGrid}>
            <label className={classes.field}>
              <span>Department</span>
              <select defaultValue="General Practice">
                <option>General Practice</option>
                <option>Cardiology</option>
                <option>Dermatology</option>
              </select>
            </label>

            <label className={classes.field}>
              <span>Attending Doctor</span>
              <select defaultValue="Dr. Smith">
                <option value="Dr. Smith">
                  Dr. Smith (General Practice • Available)
                </option>
                <option>Dr. Lee (General Practice • Available)</option>
              </select>
            </label>

            <label className={classes.field}>
              <span>Date</span>

              <div className={classes.inputWithIcon}>
                <CalendarDays size={17} />
                <input
                  type="date"
                  defaultValue="2023-10-24"
                  aria-label="Appointment date"
                />
              </div>
            </label>

            <label className={classes.field}>
              <span>Time Slot</span>

              <div className={classes.inputWithIcon}>
                <Clock3 size={17} />
                <input
                  type="time"
                  defaultValue="11:30"
                  aria-label="Appointment time"
                />
              </div>
            </label>
          </div>

          <div className={classes.visitType}>
            <span>Visit Type</span>

            <div className={classes.visitButtons}>
              {["General", "Follow-up", "Lab Review", "Urgent"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setVisitType(type)}
                  className={visitType === type ? classes.activeVisit : ""}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className={classes.queueBox}>
            <div className={classes.queueIcon}>
              <Zap size={17} fill="currentColor" />
            </div>

            <div className={classes.queueText}>
              <strong>Direct Queue Insertion</strong>
              <span>
                Add directly to today’s active waiting room list upon saving
              </span>
            </div>

            <span className={classes.queueNumber}>#05 Queue</span>

            <button
              type="button"
              className={`${classes.toggle} ${addToQueue ? classes.toggleOn : ""}`}
              onClick={() => setAddToQueue((value) => !value)}
              aria-label="Toggle direct queue insertion"
            >
              <span />
            </button>
          </div>

          <label className={classes.notes}>
            <span>Chief Complaint & Clinical Notes</span>
            <textarea defaultValue="Recurring mild migraines and seasonal allergy review requested." />
          </label>
        </main>

        <footer className={classes.footer}>
          <button type="button" className={classes.draftButton}>
            <Save size={14} />
            Save as draft
          </button>

          <div className={classes.footerActions}>
            <button
              type="button"
              className={classes.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className={classes.confirmButton}>
              <Check size={17} />
              Confirm Appointment
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default NewAppointmentModal;
