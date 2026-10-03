import React, { useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  Check,
  Clock3,
  Search,
  UserRoundPlus,
  X,
  Zap,
} from "lucide-react";
import { Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classes from "./NewAppointmentModal.module.css";
import type { Patient } from "../../../../domain/patient";
import { createPatient, getPatientByCode } from "../../../../services/patients";
import { getActiveDoctors } from "../../../../services/doctors";
import type { Doctor } from "../../../../domain/doctor";
import NewPatientModal from "./patientModal/NewPatientModal";
import { createAppointment } from "../../../../services/appointment";

type NewAppointmentModalProps = {
  onClose: () => void;
};

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  onClose,
}) => {
  const [reason, setReason] = useState("General");
  const [addToQueue, setAddToQueue] = useState(true);

  const [patientCodeInput, setPatientCodeInput] = useState("");
  const [searchedPatientCode, setSearchedPatientCode] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [department, setDepartment] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-CA");

  const [appointmentDate, setAppointmentDate] = useState(today);
  const [appointmentTime, setAppointmentTime] = useState("");
  const durationMinutes = 30;
  const queryClient = useQueryClient();

  const createPatientMutation = useMutation({
    mutationFn: createPatient,

    onSuccess: (newPatient) => {
      setSelectedPatient(newPatient);
      setPatientCodeInput(newPatient.patient_code);
      setSearchedPatientCode("");
      setIsNewPatientModalOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
  });
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["live-queue"],
      });

      onClose();
    },
  });
  const { data: doctors = [], isLoading: isLoadingDoctors } = useQuery<
    Doctor[]
  >({
    queryKey: ["active-doctors"],
    queryFn: getActiveDoctors,
  });

  const departments = [...new Set(doctors.map((doctor) => doctor.specialty))];

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialty === department,
  );
  const { data: foundPatient, isFetching: isSearchingPatient } = useQuery({
    queryKey: ["patient-by-code", searchedPatientCode],
    queryFn: () => getPatientByCode(searchedPatientCode),
    enabled: Boolean(searchedPatientCode),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPatient || !doctorId || !appointmentDate || !appointmentTime) {
      return;
    }

    const appointmentAt = new Date(
      `${appointmentDate}T${appointmentTime}:00`,
    ).toISOString();

    createAppointmentMutation.mutate({
      patient_id: selectedPatient.id,
      doctor_id: doctorId,
      appointment_at: appointmentAt,
      duration_minutes: durationMinutes,
      reason,
      addToQueue,
    });
  };

  return (
    <>
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
                  Schedule an in-clinic consultation or add a patient directly
                  to the live queue.
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

              <button
                type="button"
                className={classes.newPatient}
                onClick={() => setIsNewPatientModalOpen(true)}
              >
                <span>+</span> New Patient
              </button>
            </div>

            <label className={classes.searchInput}>
              <Search size={17} />

              <Input
                value={patientCodeInput}
                onChange={(event) => setPatientCodeInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();

                    setSelectedPatient(null);
                    setSearchedPatientCode(
                      patientCodeInput.trim().toUpperCase(),
                    );
                  }
                }}
                placeholder="Search by patient code, e.g. PT-84729"
                aria-label="Search patient by code"
              />
            </label>

            {isSearchingPatient && <p>Searching for patient...</p>}

            {searchedPatientCode && !isSearchingPatient && !foundPatient && (
              <p>No patient found with this code.</p>
            )}

            {foundPatient && !selectedPatient && (
              <div className={classes.selectedPatient}>
                <span className={classes.patientAvatar}>
                  {foundPatient.full_name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>

                <div className={classes.patientInfo}>
                  <div>
                    <strong>{foundPatient.full_name}</strong>
                    <span className={classes.patientId}>
                      ID: {foundPatient.patient_code}
                    </span>
                  </div>

                  <p>
                    {foundPatient.gender} ·{" "}
                    {foundPatient.phone ?? "No phone number"}
                  </p>
                </div>

                <button
                  type="button"
                  className={classes.removePatient}
                  onClick={() => setSelectedPatient(foundPatient)}
                  aria-label="Select patient"
                >
                  <Check size={17} />
                </button>
              </div>
            )}

            {selectedPatient && (
              <div className={classes.selectedPatient}>
                <span className={classes.patientAvatar}>
                  {selectedPatient.full_name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>

                <div className={classes.patientInfo}>
                  <div>
                    <strong>{selectedPatient.full_name}</strong>
                    <span className={classes.patientId}>
                      ID: {selectedPatient.patient_code}
                    </span>
                  </div>

                  <p>
                    {selectedPatient.gender} ·{" "}
                    {selectedPatient.phone ?? "No phone number"}
                  </p>
                </div>

                <button
                  type="button"
                  className={classes.removePatient}
                  onClick={() => {
                    setSelectedPatient(null);
                    setPatientCodeInput("");
                    setSearchedPatientCode("");
                  }}
                  aria-label="Remove selected patient"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            <div className={classes.fieldsGrid}>
              <label className={classes.field}>
                <span>Department</span>

                <select
                  value={department}
                  onChange={(event) => {
                    setDepartment(event.target.value);
                    setDoctorId("");
                  }}
                >
                  <option value="">Select department</option>

                  {departments.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </label>

              <label className={classes.field}>
                <span>Attending Doctor</span>

                <select
                  value={doctorId}
                  onChange={(event) => setDoctorId(event.target.value)}
                  disabled={!department || isLoadingDoctors}
                >
                  <option value="">
                    {isLoadingDoctors ? "Loading doctors..." : "Select doctor"}
                  </option>

                  {filteredDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
              </label>

              <label className={classes.field}>
                <span>Date</span>

                <div className={classes.inputWithIcon}>
                  <CalendarDays size={17} />
                  <input
                    type="date"
                    value={appointmentDate}
                    min={today}
                    onChange={(event) => setAppointmentDate(event.target.value)}
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
                    value={appointmentTime}
                    onChange={(event) => setAppointmentTime(event.target.value)}
                    aria-label="Appointment time"
                  />
                </div>
              </label>
            </div>

            <div className={classes.visitType}>
              <span>Reason for Visit</span>

              <div className={classes.visitButtons}>
                {["General", "Follow-up", "Lab Review", "Urgent"].map(
                  (type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setReason(type)}
                      className={reason === type ? classes.activeVisit : ""}
                    >
                      {type}
                    </button>
                  ),
                )}
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
                className={`${classes.toggle} ${
                  addToQueue ? classes.toggleOn : ""
                }`}
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
            <div className={classes.footerActions}>
              <button
                type="button"
                className={classes.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={classes.confirmButton}
                disabled={
                  !selectedPatient ||
                  !doctorId ||
                  !appointmentDate ||
                  !appointmentTime ||
                  createAppointmentMutation.isPending
                }
              >
                <Check size={17} />
                {createAppointmentMutation.isPending
                  ? "Creating..."
                  : "Confirm Appointment"}
              </button>
            </div>
          </footer>
        </form>
      </div>
      {isNewPatientModalOpen && (
        <NewPatientModal
          onClose={() => setIsNewPatientModalOpen(false)}
          onSave={(patient) => createPatientMutation.mutate(patient)}
          isSaving={createPatientMutation.isPending}
        />
      )}
    </>
  );
};

export default NewAppointmentModal;
