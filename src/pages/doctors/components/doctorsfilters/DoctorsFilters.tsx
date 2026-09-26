import React from "react";
import { Search } from "lucide-react";
import classes from "./DoctorsFilters.module.css";
import { Input, Select } from "antd";
type DoctorsFiltersProps = {
  search: string;
  specialty: string;
  status: string;
  specialties: string[];
  onSearchChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};
const DoctorsFilters: React.FC<DoctorsFiltersProps> = ({
  search,
  specialty,
  status,
  onSearchChange,
  onSpecialtyChange,
  onStatusChange,
  specialties,
}) => {
  return (
    <section className={classes.filters}>
      <label className={classes.searchField}>
        <span>Search Name</span>

        <div>
          <Search size={17} />
          <Input
            size="large"
            allowClear
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by doctor name or code..."
            className={classes.searchInput}
          />
        </div>
      </label>

      <label className={classes.field}>
        <span>Specialty</span>

        <Select
          size="large"
          allowClear
          showSearch
          value={specialty || undefined}
          onChange={(value) => onSpecialtyChange(value ?? "")}
          placeholder="All Specialties"
          options={specialties.map((specialtyName) => ({
            value: specialtyName,
            label: specialtyName,
          }))}
        />
      </label>

      <label className={classes.field}>
        <span>Status</span>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>
    </section>
  );
};

export default DoctorsFilters;
