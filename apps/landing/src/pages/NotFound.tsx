import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <Box sx={{ textAlign: "center", mt: 12 }}>
      <Typography variant="h2" fontWeight={900}>
        404
      </Typography>
      <Typography variant="h6" mb={2}>
        This page does not exist.
      </Typography>
      <Link to="/" style={{ color: "#00f176", fontWeight: "bold" }}>
        Go Home →
      </Link>
    </Box>
  );
}
