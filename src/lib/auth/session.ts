import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "ff_session";

export type SessionUser = {
  email: string;
  name: string;
  role: string;
};

export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session) as SessionUser;
  } catch {
    return null;
  }
}
