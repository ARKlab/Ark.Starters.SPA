import { passthrough, http } from "msw";

export const url = "https://jsonplaceholder.typicode.com";

export const handlers = [
  http.all(url + "/*", () => {
    return passthrough(); // enough for spinning
  }),
];
