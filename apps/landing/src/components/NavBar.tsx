import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#fff", color: "#191f31", boxShadow: 0 }}
    >
      <Toolbar sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#191f31",
              fontWeight: 800,
            }}
          >
            <img
              src="/logo.svg"
              alt="AIDB"
              style={{ height: 36, verticalAlign: "middle", marginRight: 8 }}
            />
            AIDB
          </Link>
        </Typography>
        <Box>
          <Button component={Link} to="/pricing" color="inherit">
            Pricing
          </Button>
          <Button component={Link} to="/docs" color="inherit">
            Docs
          </Button>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            sx={{
              ml: 1,
              bgcolor: "#00f176",
              color: "#191f31",
              fontWeight: 700,
            }}
          >
            Start Free
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
