import { Box, Typography } from "@mui/material";
export default function LogosBar() {
  return (
    <Box sx={{ textAlign: "center", py: 3, bgcolor: "#f3f4f6" }}>
      <Typography variant="body1" color="text.secondary" mb={1}>
        Trusted by ambitious startups and enterprises worldwide
      </Typography>
      {/* Swap out with .svg logos or Cloud provider badges */}
      <Box sx={{ fontSize: 36, opacity: 0.7 }}>
        <span style={{ margin: "0 22px" }}>🚀</span>
        <span style={{ margin: "0 22px" }}>🌐</span>
        <span style={{ margin: "0 22px" }}>🤖</span>
        <span style={{ margin: "0 22px" }}>☁️</span>
      </Box>
    </Box>
  );
}
