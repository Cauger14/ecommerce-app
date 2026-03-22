import { auth } from "~/server/better-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await auth.api.signOut({ headers: req.headers });
  return Response.redirect(new URL("/login", req.url));
}