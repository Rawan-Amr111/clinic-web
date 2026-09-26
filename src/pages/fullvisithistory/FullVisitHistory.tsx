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
import { useNavigate, useParams } from "react-router-dom";
import classes from "./FullVisitHistory.module.css";

type VisitStatus = "Completed" | "Cancelled" | "Upcoming";

type Visit = {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: VisitStatus;
};

const visits: Visit[] = [
  {
    id: "visit-001",
    title: "Annual Checkup",
    doctor: "Dr. Robert Chen",
    specialty: "General Medicine",
    date: "Oct 24, 2023",
    time: "10:30 AM",
    status: "Completed",
  },
  {
    id: "visit-002",
    title: "Dermatology Consult",
    doctor: "Dr. Amanda Torres",
    specialty: "Dermatology",
    date: "Mar 12, 2023",
    time: "01:00 PM",
    status: "Completed",
  },
  {
    id: "visit-003",
    title: "Follow-up Consultation",
    doctor: "Dr. Sarah Wilson",
    specialty: "General Medicine",
    date: "Jan 08, 2023",
    time: "11:15 AM",
    status: "Completed",
  },
  {
    id: "visit-004",
    title: "Cardiology Consultation",
    doctor: "Dr. Michael Brown",
    specialty: "Cardiology",
    date: "Dec 14, 2022",
    time: "09:00 AM",
    status: "Cancelled",
  },
  {
    id: "visit-005",
    title: "Routine Blood Test",
    doctor: "Dr. Robert Chen",
    specialty: "Laboratory",
    date: "Nov 05, 2022",
    time: "12:00 PM",
    status: "Completed",
  },
];

function FullVisitHistory() {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();

  const [search, setSearch] = useState("");
  const [doctor, setDoctor] = useState<string>();
  const [status, setStatus] = useState<VisitStatus>();

  const filteredVisits = useMemo(() => {
    const query = search.trim().toLowerCase();

    return visits.filter((visit) => {
      const matchesSearch =
        !query ||
        visit.title.toLowerCase().includes(query) ||
        visit.doctor.toLowerCase().includes(query) ||
        visit.specialty.toLowerCase().includes(query);

      const matchesDoctor = !doctor || visit.doctor === doctor;
      const matchesStatus = !status || visit.status === status;

      return matchesSearch && matchesDoctor && matchesStatus;
    });
  }, [doctor, search, status]);

  const resetFilters = () => {
    setSearch("");
    setDoctor(undefined);
    setStatus(undefined);
  };

  const getStatusClass = (visitStatus: VisitStatus) => {
    if (visitStatus === "Completed") return classes.completed;
    if (visitStatus === "Cancelled") return classes.cancelled;

    return classes.upcoming;
  };

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
          <p>All appointments and visit statuses for Sarah Jenkins.</p>
        </div>

        <div className={classes.totalVisits}>
          <strong>{visits.length}</strong>
          <span>Total Appointments</span>
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
            options={[
              { value: "Dr. Robert Chen", label: "Dr. Robert Chen" },
              { value: "Dr. Amanda Torres", label: "Dr. Amanda Torres" },
              { value: "Dr. Sarah Wilson", label: "Dr. Sarah Wilson" },
              { value: "Dr. Michael Brown", label: "Dr. Michael Brown" },
            ]}
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
              { value: "Upcoming", label: "Upcoming" },
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
        {filteredVisits.length ? (
          filteredVisits.map((visit) => {
            const [month, dayWithComma, year] = visit.date.split(" ");

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
                        visit.status,
                      )}`}
                    >
                      {visit.status}
                    </Tag>

                    <span className={classes.time}>
                      <ClockCircleOutlined />
                      {visit.time}
                    </span>
                  </div>

                  <h3>{visit.title}</h3>

                  <div className={classes.meta}>
                    <span>
                      <MedicineBoxOutlined />
                      {visit.specialty}
                    </span>

                    <span>
                      <UserOutlined />
                      {visit.doctor}
                    </span>

                    <span>
                      <CalendarOutlined />
                      {visit.date}
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className={classes.emptyState}>
            <Empty description="No appointments match your filters." />
            <Button type="primary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default FullVisitHistory;