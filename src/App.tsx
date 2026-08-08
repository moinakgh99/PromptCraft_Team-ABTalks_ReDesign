import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "@/components/Nav";
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeInitializer from "@/components/ThemeInitializer";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DayChallenge from "@/pages/DayChallenge";
import Recruiter from "@/pages/Recruiter";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute required="student"><Dashboard /></ProtectedRoute>} />
        <Route path="/day/:day" element={<ProtectedRoute required="student"><DayChallenge /></ProtectedRoute>} />
        <Route path="/recruiter" element={<ProtectedRoute required="recruiter"><Recruiter /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute required="admin"><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
