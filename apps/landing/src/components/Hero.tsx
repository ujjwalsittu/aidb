import { Box, Typography, Button, Stack } from "@mui/material";
import CodeBlock from "./CodeBlock";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <Box
      sx={{
        pt: 8,
        pb: 5,
        textAlign: "center",
        bgcolor: "#191f31",
        color: "white",
      }}
    >
      <Typography variant="h2" fontWeight={900} gutterBottom>
        The World’s Most Flexible{" "}
        <span style={{ color: "#00f176" }}>Serverless Postgres</span>
      </Typography>
      <Typography variant="h5" fontWeight={400} mb={4}>
        Branch, scale, and time-travel your production database in seconds.
        <br />
        Multi-cloud. AI-ready. Open source. Blazingly fast—
        <span style={{ color: "#00f176" }}>AIDB</span> redefines DBaaS for the
        edge era.
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" mb={5}>
        <Button
          component={Link}
          to="/signup"
          sx={{ fontWeight: "bold" }}
          size="large"
          variant="contained"
          color="success"
        >
          Start For Free
        </Button>
        <Button
          component={Link}
          to="/docs"
          size="large"
          variant="outlined"
          color="inherit"
        >
          Docs
        </Button>
      </Stack>
      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          bg: "#151826",
          borderRadius: 3,
          mt: 2,
        }}
      >
        <CodeBlock
          code={`npx aidb db provision --project myapp\nnpx aidb branch create --from staging\nnpx aidb pitr restore --timestamp "2024-05-01T13:00Z"\n# Deploy on any cloud in seconds`}
        />
      </Box>
    </Box>
  );
}
