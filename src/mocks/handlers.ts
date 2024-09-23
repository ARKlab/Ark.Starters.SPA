import { http, HttpResponse } from "msw";

// Let's keep a map of all existing posts in memory.
// At the beginning, this list is empty as we have no posts.
const allPosts = new Map();

export const handlers = [
  http.get("/posts", () => {
    // Construct a JSON response with the list of all posts
    // as the response body.
    return HttpResponse.json(Array.from(allPosts.values()));
  }),

  http.post("/posts", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newPost = await request.json();

    // Push the new post to the map of all posts.
    allPosts.set(allPosts.size, newPost);

    return HttpResponse.json(undefined, { status: 204 });
  }),

  http.delete("/posts/:id", ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params;

    // Let's attempt to grab the post by its ID.
    const deletedPost = allPosts.get(id);

    // Respond with a "404 Not Found" response if the given
    // post ID does not exist.
    if (!deletedPost) {
      return new HttpResponse(null, { status: 404 });
    }

    // Delete the post from the "allPosts" map.
    allPosts.delete(id);

    return HttpResponse.json(undefined, { status: 204 });
  }),
];
