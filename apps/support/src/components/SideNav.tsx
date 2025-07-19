import { Link, useLocation } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
const items = [
  { to: "/", label: "Dashboard" },
  { to: "/team-search", label: "Team Search" },
  { to: "/user-search", label: "User Search" },
  { to: "/db-search", label: "DB Search" },
  { to: "/tickets", label: "Tickets" },
  { to: "/audit", label: "Audit" },
  { to: "/usage", label: "Usage" },
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
