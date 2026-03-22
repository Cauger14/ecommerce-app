import { auth } from ".";
import { headers } from "next/headers";
import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";

export const getSession = cache(async () => {
  noStore();
  return auth.api.getSession({ headers: await headers() });
});