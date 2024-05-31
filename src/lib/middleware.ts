import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: [
    (event) => {
      //   console.log("onRequest GLOBAL", event.request);
    },
  ],
  onBeforeResponse: [
    (event) => {
    //   console.log("onBeforeResponse GLOBAL", event?.response?.statusText);
    },
  ],
});
