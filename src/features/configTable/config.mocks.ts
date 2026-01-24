import { delay, http, HttpResponse } from "msw";
import { z } from "zod";

import type { Employee } from "./employee";

export const url = "https://config.api";

const data = [
  { name: "Mario", surName: "Rossi", employed: true },
  { name: "Luigi", surName: "Bianchi", employed: false },
  { name: "Giuseppe", surName: "Verdi", employed: true },
  { name: "Francesco", surName: "Neri", employed: false },
  { name: "Antonio", surName: "Bruno", employed: true },
  { name: "Giovanni", surName: "Russo", employed: false },
  { name: "Andrea", surName: "Romano", employed: true },
  { name: "Michele", surName: "Ricci", employed: false },
  { name: "Alessandro", surName: "Marino", employed: true },
  { name: "Roberto", surName: "Greco", employed: false },
  { name: "Riccardo", surName: "Gallo", employed: true },
  { name: "Marco", surName: "Costa", employed: false },
  { name: "Nicola", surName: "Giordano", employed: true },
  { name: "Davide", surName: "Mancini", employed: false },
  { name: "Alberto", surName: "Rizzo", employed: true },
  { name: "Daniele", surName: "Lombardi", employed: false },
  { name: "Salvatore", surName: "Moretti", employed: true },
  { name: "Vincenzo", surName: "Fontana", employed: false },
  { name: "Federico", surName: "Russo", employed: true },
  { name: "Gianluca", surName: "Ferrari", employed: false },
] as Employee[];

const postSchema = z.object({
  throwError: z.boolean().optional(),
  employees: z.array(z.custom<Employee>()),
});

export const handlers = [
  http.all(url + "/*", async () => {
    return delay(2000); // enough for spinning
  }),

  http.get(url + "/", () => {
    return HttpResponse.json(data);
  }),

  http.post(url + "/", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const body = await request.json();
    const payload = postSchema.parse(body);

    if (payload.throwError) return HttpResponse.json({ message: "Bad Request" }, { status: 400 });

    return HttpResponse.json(undefined, { status: 204 });
  }),
];
