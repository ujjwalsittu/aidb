import Hero from "../components/Hero";
import FeaturesGrid from "../components/FeaturesGrid";
import LogosBar from "../components/LogosBar";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Hero />
      <LogosBar />
      <FeaturesGrid />
      <Box sx={{ textAlign: "center", my: 10 }}>
        <img
          src="/dashboard-screenshot.png"
          alt="AIDB Dashboard"
          style={{
            maxWidth: 980,
            width: "90%",
            borderRadius: 12,
            boxShadow: "0 1px 5px #0003",
          }}
        />
      </Box>
    </Box>
  );
}
