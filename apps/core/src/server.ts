import app from "./app";
import { logger } from "./utils/logger";
import { env } from "./utils/env";

const port = env.PORT;
app.listen(port, () => logger.info(`AIDB API listening on :${port}`));
