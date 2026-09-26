import {
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Input, Pagination, Tag } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./index.module.css";
import type { GetPatientsResponse } from "../../domain/patient";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { calculateAge, getPatients } from "../../services/patients";
import { useDebounce } from "../../hooks/useDebounce";

function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const {
    data: { patients = [], total = 0 } = {},
    isLoading,
    isError,
    isFetching,
  } = useQuery<GetPatientsResponse>({
    queryKey: ["patients", page, pageSize, debouncedSearch],
    queryFn: () => getPatients({ page, pageSize, search: debouncedSearch }),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p>Loading patients...</p>;
  }
  if (isError) {
    return <p>Error loading patients. Please try again later.</p>;
  }
  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <div>
          <h1>Patients</h1>
          <p>View and manage patient profiles and medical history.</p>
        </div>

        <div className={classes.totalPatients}>
          <strong>{total}</strong>
          <span>Total Patients</span>
        </div>
      </header>

      <section className={classes.toolbar}>
        <Input
          size="large"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          prefix={<SearchOutlined />}
          placeholder="Search by patient code..."
          className={classes.searchInput}
        />
        {isFetching && <span>Searching...</span>}
      </section>

      <div className={classes.results}>
        <h2>
          {total} Patient{total !== 1 ? "s" : ""}
        </h2>
      </div>

      <section className={classes.patientsGrid}>
        {patients.map((patient) => (
          <button
            key={patient.id}
            type="button"
            className={classes.patientCard}
            onClick={() => navigate(`/patients/${patient.id}`)}
          >
            <div className={classes.cardHeader}>
              <Avatar size={62} src={patient.avatar_url} />

              <Tag
                className={
                  patient.status === "Active"
                    ? classes.activeStatus
                    : classes.inactiveStatus
                }
              >
                {patient.status}
              </Tag>
            </div>

            <div className={classes.patientName}>
              <h3>{patient.full_name}</h3>
              <span>{patient.patient_code}</span>
            </div>

            <div className={classes.patientData}>
              <span>
                <UserOutlined />
                {calculateAge(patient.date_of_birth)} · {patient.gender}
              </span>

              <span>
                <PhoneOutlined />
                {patient.phone}
              </span>

              <span>
                <MailOutlined />
                {patient.email}
              </span>
            </div>

            <div className={classes.cardFooter}>
              <span>View Patient Profile</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </section>
      <div className={classes.pagination}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          onChange={(nextPage) => setPage(nextPage)}
        />
      </div>
    </main>
  );
}

export default PatientsPage;
