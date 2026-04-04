import { http, HttpResponse } from "msw";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.dredecoplays.com.br";

export const handlers = [
  http.get(`${API}/api/categories`, () => {
    return HttpResponse.json({ data: [] });
  }),
  http.get(`${API}/api/tags`, () => {
    return HttpResponse.json({ data: [] });
  }),
];
