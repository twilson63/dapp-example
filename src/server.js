import { serve } from "std/http/server.ts";
import { graphql } from "./api.js";

/**
 * @param {Request} reg
 * @returns {Response}
 */
serve((req) => {
  const routes = {
    "/": serveStatic("./app/public/index.html", "text/html"),
    "/social.svg": serveStatic("./app/public/social.svg", "image/svg+xml"),
    "/tailwind.css": serveStatic("./app/public/tailwind.css", "text/css"),
    "/build/bundle.css": serveStatic(
      "./app/public/build/bundle.css",
      "text/css",
    ),
    "/build/bundle.js": serveStatic(
      "./app/public/build/bundle.js",
      "text/javascript",
    ),
    "/graphql": graphql,
  };

  // get path from req object
  const { pathname } = new URL(req.url);

  // log request
  console.log(`${req.method} ${pathname}`);

  // simple match to handle the request
  return routes[pathname] ? routes[pathname](req) : routes["/"](req);
});

/**
 * @param {string} file
 * @param {string} type
 * @returns {Response}
 */
function serveStatic(file, type) {
  return async () =>
    new Response(
      await Deno.readFile(file),
      {
        headers: { "content-type": type },
      },
    );
}
