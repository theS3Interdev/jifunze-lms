import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

/* export routes for Next App router */
export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
});
