import React, { useState } from "react";
import { Camera, Stethoscope, Upload, UserRound, X } from "lucide-react";
import classes from "./AddDoctorModal.module.css";
import { AutoComplete } from "antd";

export type NewDoctorData = {
  name: string;
  specialty: string;
  image?: string;
};

type AddDoctorModalProps = {
  specialties: string[];
  onClose: () => void;
  onSave: (doctor: NewDoctorData) => void;
  isSaving: boolean;
};
const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  specialties,
  onClose,
  onSave,
  isSaving,
}) => {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || !name.trim() || !specialty.trim()) return;
    onSave({
      name: name.trim(),
      specialty,
      image: imagePreview || undefined,
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
            <span className={classes.titleIcon}>
              <Stethoscope size={22} />
            </span>

            <div>
              <h2>Add New Doctor</h2>
              <p>Create a staff profile and assign their specialty.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={classes.closeButton}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <main className={classes.content}>
          <div className={classes.photoSection}>
            <div className={classes.photoPreview}>
              {imagePreview ? (
                <img src={imagePreview} alt="Doctor preview" />
              ) : (
                <UserRound size={38} />
              )}
            </div>

            <label className={classes.uploadButton}>
              <Upload size={17} />
              Upload Photo
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handlePhotoChange}
              />
            </label>

            <span>PNG, JPG, or WEBP — max 5MB</span>
          </div>

          <label className={classes.field}>
            <span>Doctor Name</span>

            <div className={classes.inputWrapper}>
              <UserRound size={18} />
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Dr. Ahmed Hassan"
              />
            </div>
          </label>

          <label className={classes.field}>
            <span>Specialization</span>

            <div className={classes.inputWrapper}>
              <Stethoscope size={18} />

              <AutoComplete
                options={specialties.map((specialtyName) => ({
                  value: specialtyName,
                }))}
                value={specialty}
                onChange={setSpecialty}
                placeholder="Select or enter specialization"
                showSearch={{
                  filterOption: (inputValue, option) =>
                    String(option?.value ?? "")
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
                }}
              />
            </div>
          </label>
        </main>

        <footer className={classes.footer}>
          <button type="button" className={classes.cancel} onClick={onClose}>
            Cancel
          </button>

          <button
            type="submit"
            className={classes.save}
            disabled={isSaving || !name.trim() || !specialty.trim()}
          >
            <Camera size={18} />
            {isSaving ? "Adding..." : "Add Doctor"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AddDoctorModal;
