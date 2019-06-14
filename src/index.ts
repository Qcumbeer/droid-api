import { application, logger } from "./app";

const port = process.env.PORT || 4000;
application.listen(port);

logger.info(`Server is listening on port ${port}`);
