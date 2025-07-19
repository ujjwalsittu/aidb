import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeamSearch from "./pages/TeamSearch";
import UserSearch from "./pages/UserSearch";
import DBSearch from "./pages/DBSearch";
import Tickets from "./pages/Tickets";
import Audit from "./pages/Audit";
import Usage from "./pages/Usage";
import TeamDetails from "./pages/TeamDetails";
import UserDetails from "./pages/UserDetails";
import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/NotFound";
import { getToken } from "./lib/auth";

export default function App() {
  const authed = !!getToken();
  return (
    <BrowserRouter>
      <Routes>
        {!authed ? (
          <Route path="/*" element={<Login />} />
        ) : (
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/team-search" element={<TeamSearch />} />
            <Route path="/user-search" element={<UserSearch />} />
            <Route path="/db-search" element={<DBSearch />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/team/:id" element={<TeamDetails />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}
