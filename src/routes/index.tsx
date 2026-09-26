import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard";
import { ProtectedRoute } from "./protectedRoute";
import Layout from "../layout";
import LiveQueuePage from "../pages/livequeue";
import AppointmentsPage from "../pages/appointments";
import DoctorsPage from "../pages/doctors";
import AnalyticsPage from "../pages/analytics";
import FullVisitHistory from "../pages/fullvisithistory/FullVisitHistory";
import PatientHistory from "../pages/patienthistory";
import PatientsPage from "../pages/patients";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-queue" element={<LiveQueuePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:patientId" element={<PatientHistory />} />
          <Route
            path="/patients/:patientId/visits"
            element={<FullVisitHistory />}
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
