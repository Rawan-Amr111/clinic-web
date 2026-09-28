import React, { useState } from "react";
import { UserRoundPlus, X } from "lucide-react";
import classes from "./NewPatientModal.module.css";
import type { CreatePatientInput } from "../../../../../domain/patient";

type NewPatientModalProps = {
  onClose: () => void;
  onSave: (patient: CreatePatientInput) => void;
  isSaving: boolean;
};

const NewPatientModal: React.FC<NewPatientModalProps> = ({
  onClose,
  onSave,
  isSaving,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Female" | "Male">("Female");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    onSave({
      full_name: fullName,
      phone,
      email,
      date_of_birth: dateOfBirth,
      gender,
    });
  };

  return (
    <div className={classes.overlay} onMouseDown={onClose}>
      <form
        className={classes.modal}
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={classes.header}>
          <div className={classes.title}>
            <span className={classes.icon}>
              <UserRoundPlus size={21} />
            </span>

            <div>
              <h2>Add New Patient</h2>
              <p>
                Create a patient profile, then select them for this appointment.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={classes.closeButton}
            onClick={onClose}
            aria-label="Close new patient modal"
          >
            <X size={19} />
          </button>
        </header>

        <main className={classes.content}>
          <label className={classes.field}>
            <span>Full Name</span>
            <input
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Example: Sara Ahmed"
            />
          </label>

          <div className={classes.fieldsGrid}>
            <label className={classes.field}>
              <span>Phone Number</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="01012345678"
              />
            </label>

            <label className={classes.field}>
              <span>Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="patient@email.com"
              />
            </label>

            <label className={classes.field}>
              <span>Date of Birth</span>
              <input
                required
                type="date"
                value={dateOfBirth}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </label>

            <label className={classes.field}>
              <span>Gender</span>
              <select
                value={gender}
                onChange={(event) =>
                  setGender(event.target.value as "Female" | "Male")
                }
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </label>
          </div>
        </main>

        <footer className={classes.footer}>
          <button
            type="button"
            className={classes.cancelButton}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={classes.saveButton}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Patient"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default NewPatientModal;
