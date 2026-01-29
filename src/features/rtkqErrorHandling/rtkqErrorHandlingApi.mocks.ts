import { delay, http, HttpResponse } from "msw"

export const url = "https://rtkq.me"

export const handlers = [
  http.all(url + "/200", async () => {
    await delay(1000)
    return HttpResponse.json({ status: "200" })
  }),
  http.all(url + "/200WithWrongSchema", () => {
    return HttpResponse.json({ wrongKey: "200" })
  }),
  http.all(url + "/400", () => {
    return HttpResponse.json(
      {
        type: "https://httpstatuses.io/400",
        title: "Bad Request",
        detail: "'data' should not be null.",
        errors: {
          "data.nested.property": [
            {
              attemptedValue: null,
              customState: null,
              errorCode: null,
              errorMessage: "Should not be null.",
              formattedMessagePlaceholderValues: {
                PropertyName: "property",
                PropertyPath: "data.nested.property",
                PropertyValue: null,
              },
            },
          ],
        },
        status: 400,
      },
      { status: 400, headers: { "Content-Type": "application/problem+json" } },
    )
  }),
  http.all(url + "/429", () => {
    return new HttpResponse(null, {
      status: 429,
      headers: { "Retry-After": "1" },
    })
  }),
  http.all(url + "/500", () => {
    return HttpResponse.json(
      {
        type: "https://example.com/probs/out-of-credit",
        title: "You do not have enough credit.",
        detail: "Your current balance is 30, but that costs 50.",
        instance: "/account/12345/msgs/abc",
        balance: 30,
        accounts: ["/account/12345", "/account/67890"],
      },
      { status: 500, headers: { "Content-Type": "application/problem+json" } },
    )
  }),
  http.all(url + "/Error", () => {
    return HttpResponse.error()
  }),
  http.all(url + "/Timeout", async () => {
    await delay("infinite")
  }),
  http.get(url + "/DownloadSuccess", async () => {
    await delay(5000)
    const e = new TextEncoder()
    const uint8 = e.encode("Pippo")
    return HttpResponse.arrayBuffer(uint8.buffer, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": "attachment; filename=puppa.txt",
        "Access-Control-Expose-Headers": "Content-Disposition, Content-Encoding, ETag",
      },
    })
  }),
  http.get(url + "/DownloadFailure", () => {
    return HttpResponse.json(
      {
        type: "https://example.com/probs/out-of-credit",
        title: "You do not have enough credit.",
        detail: "Your current balance is 30, but that costs 50.",
        instance: "/account/12345/msgs/abc",
        balance: 30,
        accounts: ["/account/12345", "/account/67890"],
      },
      { status: 500, headers: { "Content-Type": "application/problem+json" } },
    )
  }),
]
