import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentsPage from "./pages/StudentsPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";

import AdminDashboard from "./pages/AdminDashboard";
import RegisterStudentPage from "./pages/RegisterStudentPage";
import IssueCertificatePage from "./pages/IssueCertificatePage";
import RecordsPage from "./pages/RecordsPage";

import VerifyCertificatePage from "./pages/VerifyCertificatePage";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyCertificatePage />} />

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/register"
          element={
            <AdminRoute>
              <RegisterStudentPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/issue"
          element={
            <AdminRoute>
              <IssueCertificatePage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/records"
          element={
            <AdminRoute>
              <RecordsPage />
            </AdminRoute>
          }
        />

        {/* ================= LEGACY STUDENT ROUTES (ADMIN) ================= */}
        <Route
          path="/students"
          element={
            <AdminRoute>
              <StudentsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/students/:studentId"
          element={
            <AdminRoute>
              <StudentDetailsPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}
