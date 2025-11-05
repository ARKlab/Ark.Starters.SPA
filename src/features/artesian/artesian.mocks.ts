import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("https://k4view-artesian-useradmin-test.azurewebsites.net/api/CreateGroup", ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const group = url.searchParams.get("group");

    // Validate auth code
    if (code !== "TZg718DHw0dwgUF07hJFAp655h2hJZsPJHCcuGw1TIDfEj0spDwDAA==") {
      return HttpResponse.json({ error: "Invalid authorization code" }, { status: 401 });
    }

    if (!group) {
      return HttpResponse.json({ error: "Group parameter is required" }, { status: 400 });
    }

    console.log(`CreateGroup called with group: ${group}`);

    return HttpResponse.json({
      success: true,
      message: `Group '${group}' created successfully`,
      groupId: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post("https://k4view-artesian-useradmin-test.azurewebsites.net/api/UpdateGroup", async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (code !== "wamllBk/R5/yhF3fCO6UfUblWDzx1XzVT5BEltNQ/c0pTusZT5F1wQ==") {
      return HttpResponse.json({ error: "Invalid authorization code" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (!body.name || !body.id) {
      return HttpResponse.json({ error: "Name and id are required" }, { status: 400 });
    }

    console.log(`UpdateGroup called with:`, body);

    return HttpResponse.json({
      success: true,
      message: `Group '${body.name as string}' updated successfully`,
      groupId: body.id,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post("https://k4view-artesian-useradmin-test.azurewebsites.net/api/ACLPathUpdater", async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (code !== "53wRM2frI1nP5YgV5aCefsjUBsiHMLWIZ4FUU88xv8T3szS2MCRvEw==") {
      return HttpResponse.json({ error: "Invalid authorization code" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (!body.groupId || !body.components) {
      return HttpResponse.json({ error: "GroupId and components are required" }, { status: 400 });
    }

    console.log(`ACLPathUpdater called with:`, body);

    return HttpResponse.json({
      success: true,
      message: `ACL paths updated for group '${body.groupId as string}'`,
      componentsProcessed: Array.isArray(body.components) ? body.components.length : 0,
      timestamp: new Date().toISOString(),
    });
  }),
];
