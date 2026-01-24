import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import VerifyCertificatePage from "./pages/VerifyCertificatePage";

import AdminDashboard from "./pages/AdminDashboard";
import RegisterStudentPage from "./pages/RegisterStudentPage";
import IssueCertificatePage from "./pages/IssueCertificatePage";
import RecordsPage from "./pages/RecordsPage";

import StudentDashboardPage from "./pages/StudentDashboardPage";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import StudentRoute from "./components/StudentRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyCertificatePage />} />

        {/* ================= STUDENT ================= */}
        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <StudentDashboardPage />
            </StudentRoute>
          }
        />

        {/* ================= ADMIN ================= */}
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
      </Routes>
    </>
  );
}