import { Box, Typography } from "@mui/material";

export default function Docs() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, mb: 10 }}>
      <Typography variant="h3" fontWeight={800} mb={3} align="center">
        AIDB Docs
      </Typography>
      <Typography>
        <b>CLI:</b> <pre>npx aidb db provision --project myapp</pre>
        <br />
        <b>REST API:</b>
        <pre>
          {`POST /api/db/provision
Authorization: Bearer &lt;token&gt;`}
        </pre>
        <b>
          SDK, API, and more coming soon... <br />
          <a href="https://github.com/ujjwalsittu/aidb" target="_blank">
            View on GitHub
          </a>
        </b>
      </Typography>
    </Box>
  );
}
