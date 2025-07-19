import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Branches from "./pages/Branches";
import PITR from "./pages/PITR";
import Billing from "./pages/Billing";
import Usage from "./pages/Usage";
import MainLayout from "./layout/MainLayout";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import { getToken } from "./lib/auth";

export default function App() {
  const isAuthed = !!getToken();
  return (
    <BrowserRouter>
      <Routes>
        {!isAuthed ? (
          <Route path="/*" element={<Login />} />
        ) : (
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/pitr" element={<PITR />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/team" element={<Team />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}
