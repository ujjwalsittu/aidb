import { Box, Typography } from "@mui/material";
export default function NotFound() {
  return (
    <Box sx={{ textAlign: "center", mt: 12 }}>
      <Typography variant="h2" fontWeight={900}>
        404
      </Typography>
      <Typography variant="h6" mb={2}>
        Page not found.
      </Typography>
      <a href="/" style={{ color: "#00f176", fontWeight: "bold" }}>
        Dashboard
      </a>
    </Box>
  );
}
