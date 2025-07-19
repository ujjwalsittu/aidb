import { Box, Typography, Card, CardContent } from "@mui/material";

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "Always free for hobby projects. 1 DB, PITR 7d, 5GB",
    cta: "Sign up",
    highlight: false,
  },
  {
    name: "Pro",
    price: 19,
    desc: "Unlimited DBs/branches • PITR 30d • Vector search • 100GB multi-cloud",
    cta: "Start 14d Free",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 99,
    desc: "SLA, PrivateLink, VPC, SOC2, custom regions & support.",
    cta: "Contact us",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 7, mb: 8 }}>
      <Typography variant="h3" align="center" fontWeight={900} mb={8}>
        Pricing
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {plans.map((plan) => (
          <Card
            key={plan.name}
            sx={{
              minWidth: 270,
              py: 4,
              px: 3,
              boxShadow: plan.highlight ? 8 : 4,
              border: plan.highlight
                ? "2px solid #00f176"
                : "1px solid #ececec",
              bgcolor: plan.highlight ? "#f5fff7" : "#fff",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight={700}
                color={plan.highlight ? "success.main" : "primary"}
              >
                {plan.name}
              </Typography>
              <Typography variant="h4" fontWeight={900} my={2}>
                {plan.price ? `$${plan.price}/mo` : "Free"}
              </Typography>
              <Typography>{plan.desc}</Typography>
              <Box mt={2}>
                <a
                  href="/signup"
                  style={{
                    textDecoration: "none",
                    fontWeight: 800,
                    color: "#00f176",
                  }}
                >
                  {plan.cta} →
                </a>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
