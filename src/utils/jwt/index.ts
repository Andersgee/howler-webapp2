import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from "../auth/schema";
import { TokenSessionSchema, TokenStateSchema, type TokenUser, TokenUserSchema } from "./schema";
import { transformer } from "#src/db/transformer";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);

    if (typeof payload.user !== "string") {
      return null;
    }
    const user = TokenUserSchema.parse(transformer.deserialize(payload.user));

    return user;
  } catch (err) {
    return null;
  }
}

export async function getSessionFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const session = TokenSessionSchema.parse(payload);
    return session;
  } catch (err) {
    return null;
  }
}

/** for route.ts files. (make sure the route exports `dynamic = "force-dynamic"`). */
export async function getUserFromRequestCookie(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

export async function getSessionFromRequestCookie(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return getSessionFromToken(token);
}

/** for server component files (or in server actions) */
export async function getUserFromCookie() {
  const token = cookies().get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

/** for server component files (or in server actions) */
export async function getSessionFromCookie() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

export async function createTokenFromUser(user: TokenUser) {
  const payload = { user: transformer.serialize(user) };
  const jwt = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
  return jwt;
}

export async function createSessionToken() {
  const jwt = await new SignJWT({ csrf: crypto.randomUUID() }).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
  return jwt;
}

export async function createStateToken({ csrf, route }: { csrf: string; route: string }) {
  const jwt = await new SignJWT({ csrf, route }).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
  return jwt;
}

export async function verifyStateToken(token: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const state = TokenStateSchema.parse(payload);
    return state;
  } catch (error) {
    return null;
  }
}
