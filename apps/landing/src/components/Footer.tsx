import { Box, Typography } from "@mui/material";
export default function Footer() {
  return (
    <Box
      sx={{
        py: 4,
        bgcolor: "#191f31",
        color: "#fff",
        textAlign: "center",
        mt: 8,
      }}
    >
      <Typography variant="body2" color="inherit">
        © {new Date().getFullYear()} AIDB • Open source (Apache 2.0)
      </Typography>
      <Box mt={1}>
        <a href="mailto:support@aidb.io" style={{ color: "inherit" }}>
          Contact: support@aidb.io
        </a>
      </Box>
      <Box mt={2} sx={{ opacity: 0.7 }}>
        <a
          href="/privacy"
          style={{ color: "#fff", textDecoration: "underline", margin: 4 }}
        >
          Privacy
        </a>{" "}
        |
        <a
          href="/security"
          style={{ color: "#fff", textDecoration: "underline", margin: 4 }}
        >
          Security
        </a>
      </Box>
    </Box>
  );
}
