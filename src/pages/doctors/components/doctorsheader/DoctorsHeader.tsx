import React from "react";
import { Plus } from "lucide-react";
import classes from "./DoctorsHeader.module.css";
type DoctorsHeaderProps = {
  onAddDoctor: () => void;
};
const DoctorsHeader: React.FC<DoctorsHeaderProps> = ({ onAddDoctor }) => {
  return (
    <header className={classes.header}>
      <div>
        <h1>Doctors Management</h1>
        <p>Manage staff profiles, availability, and schedules.</p>
      </div>

      <button type="button" className={classes.addButton} onClick={onAddDoctor}>
        <Plus size={18} />
        Add Doctor
      </button>
    </header>
  );
};

export default DoctorsHeader;
