import { Link, useLocation } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";

const userRole = localStorage.getItem("aidb_role"); // Set on login
const items = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects/DB" },
  { to: "/branches", label: "Branches" },
  { to: "/teams", label: "Teams", adminOnly: true },
  { to: "/users", label: "Users", adminOnly: true },
  { to: "/billing", label: "Billing" },
  { to: "/pitr", label: "PITR" },
  { to: "/audit", label: "Audit" },
  { to: "/usage", label: "Usage" },
]

export default function SideNav() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        [`& .MuiDrawer-paper`]: { width: 220, boxSizing: "border-box" },
      }}
    >
      <List>
        {items.filter(item =>
          (item.adminOnly ? userRole === "admin" : true)
        ).map(({ to, label }) => (
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
