import { useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Empty, Input, Select, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import type { PatientRecentVisit } from "../../domain/appointment";
import { getFullVisits } from "../../services/appointment";
import { getPatientById } from "../../services/patients";
import classes from "./FullVisitHistory.module.css";

type VisitStatus = "Completed" | "Cancelled";

function FullVisitHistory() {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [search, setSearch] = useState("");
  const [doctor, setDoctor] = useState<string>();
  const [status, setStatus] = useState<VisitStatus>();

  const {
    data: visits = [],
    isLoading,
    isError,
  } = useQuery<PatientRecentVisit[]>({
    queryKey: ["patient-visits", patientId],
    queryFn: () => getFullVisits(patientId!),
    enabled: Boolean(patientId),
    staleTime: 60 * 1000,
  });
  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId!),
    enabled: Boolean(patientId),
    staleTime: 60 * 1000,
  });

  const doctors = useMemo(
    () => [...new Set(visits.map((visit) => visit.doctor_name))],
    [visits],
  );
  const filteredVisits = useMemo(() => {
    const query = search.trim().toLowerCase();

    return visits.filter((visit) => {
      const matchesSearch =
        !query ||
        (visit.reason ?? "Consultation").toLowerCase().includes(query) ||
        visit.doctor_name.toLowerCase().includes(query) ||
        visit.specialty.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (!doctor || visit.doctor_name === doctor) &&
        (!status || visit.status === status)
      );
    });
  }, [doctor, search, status, visits]);

  const resetFilters = () => {
    setSearch("");
    setDoctor(undefined);
    setStatus(undefined);
  };

  const getStatusClass = (visitStatus: VisitStatus) =>
    visitStatus === "Completed" ? classes.completed : classes.cancelled;

  return (
    <main className={classes.page}>
      <button
        type="button"
        className={classes.backButton}
        onClick={() => navigate(`/patients/${patientId}`)}
      >
        <ArrowLeftOutlined />
        Back to Patient Profile
      </button>

      <header className={classes.pageHeader}>
        <div>
          <span className={classes.eyebrow}>PATIENT ACTIVITY</span>
          <h1>Full Visit History</h1>
          <p>Completed and cancelled appointments for {patient?.full_name ?? "this patient"}.</p>
        </div>

        <div className={classes.totalVisits}>
          <strong>{visits.length}</strong>
          <span>Total Visits</span>
        </div>
      </header>

      <section className={classes.filtersCard}>
        <Input
          size="large"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          prefix={<SearchOutlined />}
          placeholder="Search appointment, doctor, or specialty..."
          className={classes.searchInput}
        />

        <div className={classes.filters}>
          <Select
            allowClear
            value={doctor}
            onChange={setDoctor}
            placeholder="All Doctors"
            className={classes.select}
            options={doctors.map((name) => ({ value: name, label: name }))}
          />
          <Select<VisitStatus>
            allowClear
            value={status}
            onChange={setStatus}
            placeholder="All Statuses"
            className={classes.select}
            options={[
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      </section>

      <div className={classes.resultsHeader}>
        <h2>
          {filteredVisits.length} Appointment
          {filteredVisits.length !== 1 ? "s" : ""}
        </h2>
        <span>Newest first</span>
      </div>

      <section className={classes.visitsList}>
        {isLoading ? (
          <p>Loading visit history...</p>
        ) : isError ? (
          <p>Could not load visit history. Please try again.</p>
        ) : filteredVisits.length ? (
          filteredVisits.map((visit) => {
            const visitDate = new Date(visit.appointment_at);
            const date = visitDate.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            });
            const [month, dayWithComma, year] = date.split(" ");
            const time = visitDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article className={classes.visitCard} key={visit.id}>
                <div className={classes.dateBox}>
                  <span>{month}</span>
                  <strong>{dayWithComma.replace(",", "")}</strong>
                  <small>{year}</small>
                </div>
                <div className={classes.visitInfo}>
                  <div className={classes.cardTop}>
                    <Tag
                      className={`${classes.status} ${getStatusClass(
                        visit.status === "Completed" ? "Completed" : "Cancelled",
                      )}`}
                    >
                      {visit.status}
                    </Tag>
                    <span className={classes.time}>
                      <ClockCircleOutlined />
                      {time}
                    </span>
                  </div>
                  <h3>{visit.reason ?? "Consultation"}</h3>
                  <div className={classes.meta}>
                    <span><MedicineBoxOutlined />{visit.specialty}</span>
                    <span><UserOutlined />{visit.doctor_name}</span>
                    <span><CalendarOutlined />{date}</span>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className={classes.emptyState}>
            <Empty description="No completed or cancelled appointments match your filters." />
            <Button type="primary" onClick={resetFilters}>Reset Filters</Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default FullVisitHistory;
