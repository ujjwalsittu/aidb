import { Box, Typography, Grid } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StorageIcon from "@mui/icons-material/Storage";
import TimelineIcon from "@mui/icons-material/Timeline";
import SecurityIcon from "@mui/icons-material/Security";
import RocketIcon from "@mui/icons-material/Rocket";
import BoltIcon from "@mui/icons-material/Bolt";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import GppGoodIcon from "@mui/icons-material/GppGood";

const features = [
  {
    icon: <RocketIcon color="success" />,
    title: "1-Click Branching",
    desc: "Branch, fork or clone any DB—instantly, with full copy-on-write isolation.",
  },
  {
    icon: <TimelineIcon color="info" />,
    title: "Point-in-Time Recovery",
    desc: "Restore, time-travel or query at any LSN or timestamp in seconds.",
  },
  {
    icon: <CloudQueueIcon color="primary" />,
    title: "Multi-Cloud Native",
    desc: "Deploy on AWS, Azure, GCP, or any S3-compatible storage.",
  },
  {
    icon: <BoltIcon color="warning" />,
    title: "Serverless Autoscale",
    desc: "Autoscale to zero on no load—ultra low cost, zero cold starts.",
  },
  {
    icon: <SecurityIcon />,
    title: "SOC2, GDPR, HIPAA",
    desc: "Enterprise-grade compliance, RBAC, PrivateLink & data residency controls.",
  },
  {
    icon: <StorageIcon />,
    title: "pgvector & AI Ready",
    desc: "Built-in vector search & native support for AI/LLM apps.",
  },
  {
    icon: <StarIcon />,
    title: "Open Source",
    desc: "Apache 2.0, fully self-hostable, with a robust CLI/SDK.",
  },
  {
    icon: <GppGoodIcon color="success" />,
    title: "Enterprise Grade",
    desc: "Built for enterprises with advanced security, compliance, and data management features.",
  },
];

export default function FeaturesGrid() {
  return (
    <Box sx={{ py: 8, px: 3, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" textAlign="center" fontWeight={800} mb={4}>
        Why AIDB?
      </Typography>
      <Grid container spacing={3}>
        {features.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f.title}>
            <Box
              sx={{
                bgcolor: "#f9fafd",
                p: 3,
                borderRadius: 3,
                boxShadow: "0 1px 4px #0002",
                textAlign: "center",
                height: "100%",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>{f.icon}</div>
              <Typography variant="h6" fontWeight={800}>
                {f.title}
              </Typography>
              <Typography>{f.desc}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
