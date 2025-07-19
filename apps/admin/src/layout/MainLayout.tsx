import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import TopBar from "../components/TopBar";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideNav />
      <Box sx={{ flexGrow: 1, bgcolor: "#fafbfd" }}>
        <TopBar />
        <Box sx={{ p: 3, pt: 11 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
