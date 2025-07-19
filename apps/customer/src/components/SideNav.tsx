import { Link, useLocation } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
const items = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Databases" },
  { to: "/branches", label: "Branches" },
  { to: "/pitr", label: "PITR" },
  { to: "/billing", label: "Billing" },
  { to: "/usage", label: "Usage" },
  { to: "/team", label: "Team" },
  { to: "/profile", label: "Profile" },
];
export default function SideNav() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{ width: 200, [`& .MuiDrawer-paper`]: { width: 200 } }}
    >
      <List>
        {items.map(({ to, label }) => (
          <ListItemButton
            component={Link}
            to={to}
            selected={location.pathname === to}
            key={label}
          >
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
