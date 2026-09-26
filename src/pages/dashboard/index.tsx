import React, { useState } from "react";
import {
  Calendar,
  UserRound,
  CheckCircle2,
  Timer,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import classes from "./index.module.css";
import type { StatItem } from "../../domain/statCard";
import StatCard from "./components/statcard/StatCard";
import LiveQueue from "./components/livequeue/LiveQueue";
import TodaySchedule from "./components/todaysschedule/TodaySchedule";
import DoctorStatus from "./components/doctorstatus/DoctorStatus";
import NewAppointmentModal from "./components/newappointment/NewAppointmentModal";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const navigate = useNavigate();
  const today: Date = new Date();

  const formattedDate: string = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const statsData: StatItem[] = [
    {
      id: 1,
      title: "Today's Appointments",
      value: "142",
      icon: Calendar,
      iconBgColor: "#dbeafe",
      iconColor: "#2563eb",
    },
    {
      id: 2,
      title: "Patients Waiting",
      value: "18",
      icon: UserRound,
      iconBgColor: "#ffe4e6",
      iconColor: "#e11d48",
    },
    {
      id: 3,
      title: "Completed Appointments",
      value: "87",
      icon: CheckCircle2,
      iconBgColor: "#00875a",
      iconColor: "#ffffff",
    },
    {
      id: 4,
      title: "Avg. Waiting Time",
      value: "14",
      unit: "min",
      icon: Timer,
      iconBgColor: "#e2e8f0",
      iconColor: "#334155",
    },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <h1 className={classes.title}>Dashboard Overview</h1>
          <p className={classes.date}>{formattedDate}</p>
        </div>

        <div className={classes.actions}>
          <button
            className={`${classes.btn} ${classes.btnSecondary}`}
            onClick={() => navigate("/live-queue")}
          >
            <SlidersHorizontal size={18} />
            Manage Queue
          </button>

          <button
            className={`${classes.btn} ${classes.btnPrimary}`}
            onClick={() => setIsAppointmentModalOpen(true)}
          >
            <Plus size={18} />
            Add Appointment
          </button>
        </div>
      </div>
      <div className={classes.statsContainer}>
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            unit={stat.unit}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
      <div className={classes.dashboardContent}>
        <div className={classes.leftColumn}>
          <LiveQueue />
        </div>

        <div className={classes.rightColumn}>
          <DoctorStatus />
          <TodaySchedule />
        </div>
      </div>
      {isAppointmentModalOpen && (
        <NewAppointmentModal onClose={() => setIsAppointmentModalOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
