import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";

import AdminDashboard from "./pages/AdminDashboard";
import RegisterStudentPage from "./pages/RegisterStudentPage";
import IssueCertificatePage from "./pages/IssueCertificatePage";
import RecordsPage from "./pages/RecordsPage";

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
          path="/students/new"
          element={
            <AdminRoute>
              <AddStudentPage />
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
