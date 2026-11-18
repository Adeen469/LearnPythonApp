// API client for the Learn Python backend — the same Vercel deployment
// the website uses: https://learnpythonprogram.vercel.app
//
// The backend authenticates with an HttpOnly cookie (lp_session).
// React Native's fetch has no cookie jar, so this client captures the
// Set-Cookie header after sign-in and replays it as a Cookie header.
// The session value lives in SecureStore, never in AsyncStorage.
// Never log the session value.

import * as SecureStore from "expo-secure-store";
import { getCurrentStrings } from "./i18n";
import type { AiTutorResponse, Lesson, SessionUser } from "./types";

export const API_BASE = "https://learnpythonprogram.vercel.app";
export const SESSION_KEY = "lp_session";
/** Short-lived step-up cookie set when sign-in asks for 2FA (10 min). */
export const PENDING_2FA_KEY = "lp_2fa_pending";

export async function getSession(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
}

export async function setSession(token: string | null): Promise<void> {
  try {
    if (token) {
      await SecureStore.setItemAsync(SESSION_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    }
  } catch {
    // Storage unavailable — the session just won't persist.
  }
}

async function getPending2fa(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(PENDING_2FA_KEY);
  } catch {
    return null;
  }
}

async function setPending2fa(token: string | null): Promise<void> {
  try {
    if (token) {
      await SecureStore.setItemAsync(PENDING_2FA_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(PENDING_2FA_KEY);
    }
  } catch {
    // Storage unavailable.
  }
}

function captureCookieValue(setCookie: string, name: string): string | null {
  const match = new RegExp(`(?:^|,)\\s*${name}=([^;,]+)`).exec(setCookie);
  return match ? decodeURIComponent(match[1]) : null;
}

function captureSessionCookie(res: Response): void {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return;
  // lp_session=<value>; Path=/; HttpOnly; ... — take the first value.
  // An empty value (logout clearing the cookie) must not overwrite a
  // stored session; logout clears it explicitly instead.
  const session = captureCookieValue(setCookie, SESSION_KEY);
  if (session) void setSession(session);
  // The 2FA step-up cookie rides alongside needs2fa sign-ins. Without
  // it, send2faCode() and verify2fa() 401 ("Your sign-in step
  // expired."). Captured and replayed exactly like the session.
  const pending = captureCookieValue(setCookie, PENDING_2FA_KEY);
  if (pending) void setPending2fa(pending);
}

export interface ApiErrorShape {
  error?: unknown;
}

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const session = await getSession();
  const pending2fa = await getPending2fa();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };
  const cookies: string[] = [];
  if (session) cookies.push(`${SESSION_KEY}=${session}`);
  if (pending2fa) cookies.push(`${PENDING_2FA_KEY}=${pending2fa}`);
  if (cookies.length > 0) headers["Cookie"] = cookies.join("; ");
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  captureSessionCookie(res);
  return res;
}

export async function apiJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await apiFetch(path, init);
  const data: ApiErrorShape & Record<string, unknown> = await res
    .json()
    .catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string"
        ? data.error
        : getCurrentStrings().common.requestFailed(res.status);
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

function postJson(path: string, body: Record<string, unknown>) {
  return apiJson(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Direct stream URL for a lesson video (Range/206, MEGA or Drive). */
export const videoUrl = (lessonId: string): string =>
  `${API_BASE}/api/video/${encodeURIComponent(lessonId)}`;

/** 100 lessons, public — no sign-in needed. */
export async function fetchLessons(): Promise<Lesson[]> {
  const data = await apiJson<{ lessons: Lesson[] }>("/api/lessons");
  return data.lessons;
}

/** Signed-in user from the session cookie, or throws 401. */
export async function fetchMe(): Promise<SessionUser> {
  const data = await apiJson<{ user: SessionUser }>("/api/auth/me");
  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } finally {
    await setSession(null);
  }
}

// ---------------------------------------------------------------------------
// Email auth — POST /api/auth/email/*
// ---------------------------------------------------------------------------

export async function sendOtp(
  email: string,
  purpose: "signup" | "signin"
): Promise<{ sent: boolean }> {
  return postJson("/api/auth/email/send-otp", { email, purpose }) as Promise<{
    sent: boolean;
  }>;
}

export async function verifyOtp(
  email: string,
  code: string,
  purpose: "signup" | "signin"
): Promise<{ user: SessionUser }> {
  return postJson("/api/auth/email/verify-otp", {
    email,
    code,
    purpose,
  }) as Promise<{ user: SessionUser }>;
}

export async function emailSignup(
  email: string,
  name: string,
  password: string
): Promise<{ sent: boolean; email: string }> {
  // The route creates the account UNVERIFIED and emails an OTP — it
  // returns { sent: true, email }, not a session. The caller routes
  // to the OTP screen (purpose "signup").
  return postJson("/api/auth/email/signup", {
    email,
    name,
    password,
  }) as Promise<{ sent: boolean; email: string }>;
}

export async function emailSignin(
  email: string,
  password: string
): Promise<{ user: SessionUser; needs2fa?: boolean; needsVerification?: boolean }> {
  return postJson("/api/auth/email/signin", { email, password }) as Promise<{
    user: SessionUser;
    needs2fa?: boolean;
    needsVerification?: boolean;
  }>;
}

export async function forgotPassword(
  email: string
): Promise<{ sent: boolean }> {
  return postJson("/api/auth/email/forgot", { email }) as Promise<{
    sent: boolean;
  }>;
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ user: SessionUser }> {
  return postJson("/api/auth/email/reset", { token, password }) as Promise<{
    user: SessionUser;
  }>;
}

// ---------------------------------------------------------------------------
// Two-factor auth — POST /api/auth/2fa/*
// ---------------------------------------------------------------------------

export async function send2faCode(): Promise<{ sent: boolean }> {
  return postJson("/api/auth/2fa/send-code", {}) as Promise<{
    sent: boolean;
  }>;
}

export async function verify2fa(
  code: string
): Promise<{ user: SessionUser }> {
  // The route requires a method. This screen is email-code based
  // (resend via send2faCode) — the backend accepts an emailed code
  // even for TOTP-enabled users, so method "email" is correct here.
  const user = (await postJson("/api/auth/2fa/verify", {
    code,
    method: "email",
  })) as Promise<{ user: SessionUser }>;
  // A successful verify consumes the step-up cookie — clear it so a
  // stale value is never replayed on later requests.
  await setPending2fa(null);
  return user;
}

// ---------------------------------------------------------------------------
// Google sign-in (native) — reuses the backend's app-mode flow:
//   1. Open GOOGLE_START_URL in the system browser (WebBrowser).
//   2. The backend returns through learnpython://auth?code=<code>.
//   3. Exchange the code here; the response sets the session cookie,
//      which this client captures like any other sign-in.
// The backend's app mode is triggered by ?app=1 (the system browser
// has no app user-agent marker, unlike the LPapp WebView).
// ---------------------------------------------------------------------------

export const GOOGLE_START_URL = `${API_BASE}/api/auth/google?app=1`;

export async function exchangeAppCode(code: string): Promise<SessionUser> {
  // format=json: the endpoint answers JSON (no redirect) so fetch can
  // see the Set-Cookie header — a redirect would swallow it.
  const data = await apiJson<{ user: SessionUser }>(
    `/api/auth/app-exchange?code=${encodeURIComponent(code)}&format=json`
  );
  return data.user;
}

// ---------------------------------------------------------------------------
// AI tutor — POST /api/ai (signed in). Modes: tutor | explain | debug
// | quiz. tutor + quiz are grounded in the lesson video's transcript
// and may return [mm:ss] citations.
// ---------------------------------------------------------------------------

export type AiMode = "tutor" | "explain" | "debug" | "quiz";

export async function askAi(args: {
  mode: AiMode;
  lessonId?: string;
  question?: string;
  code?: string;
}): Promise<AiTutorResponse> {
  return apiJson<AiTutorResponse>("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
}
