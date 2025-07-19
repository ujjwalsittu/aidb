import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getToken } from "./lib/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Branches from "./pages/Branches";
import Teams from "./pages/Teams";
import Users from "./pages/User";
import Billing from "./pages/Billing";
import PITR from "./pages/PITR";
import Audit from "./pages/Audit";
import Usage from "./pages/Usage";
import MainLayout from "./layout/MainLayout";

export default function App() {
  const isAuthed = !!getToken();
  return (
    <Router>
      <Routes>
        {!isAuthed ? (
          <Route path="/*" element={<Login />} />
        ) : (
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/pitr" element={<PITR />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
