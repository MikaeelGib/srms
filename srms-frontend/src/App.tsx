import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes (admin only for now) */}
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
