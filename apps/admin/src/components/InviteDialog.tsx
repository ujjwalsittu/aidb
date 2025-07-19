import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { api } from "../lib/api";

export default function InviteDialog({ open, onClose, teamId }: any) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const sendInvite = async () => {
    await api.post("/teams/invite", { team_id: teamId, email, role });
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Invite User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To invite a user to this team, please enter their email address and
          assign a role.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label="Role"
            onChange={(e: SelectChangeEvent) =>
              setRole(e.target.value as string)
            }
          >
            <MenuItem value={"member"}>Member</MenuItem>
            <MenuItem value={"admin"}>Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={sendInvite}>Invite</Button>
      </DialogActions>
    </Dialog>
  );
}
