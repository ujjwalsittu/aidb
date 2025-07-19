import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { auditLogger } from "./middleware/audit";

// Import routers
import auth from "./api/auth";
import users from "./api/users";
import teams from "./api/teams";
import database from "./api/database";
import branch from "./api/branch";
import pitr from "./models/PITR";
import replica from "./models/Replica";
import storage from "./api/storage";
import billing from "./api/billing";
import observability from "./api/observability";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(auditLogger);
// API endpoints
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/teams", teams);
app.use("/api/db", database);
app.use("/api/branch", branch);
app.use("/api/pitr", pitr);
app.use("/api/replica", replica);
app.use("/api/storage", storage);
app.use("/api/billing", billing);
app.use("/api/observability", observability);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

export default app;
