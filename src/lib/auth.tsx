// Session state for the app.
//
// Loads the stored session on start and verifies it with /api/auth/me.
// Sign-in itself happens in the auth screens (they call the api.ts
// functions, which capture the session cookie); after any sign-in the
// screen calls refresh() here so the whole app sees the user.

import {
  createContext,
  use,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchMe, logout as apiLogout } from "./api";
import type { SessionUser } from "./types";

interface AuthContextValue {
  user: SessionUser | null;
  /** True while the stored session is being verified on start. */
  loading: boolean;
  /** Re-check /api/auth/me and update the user (call after sign-in). */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // The session check is a promise held in state, read with React
  // 19's `use` — the tree suspends until the check resolves, so
  // there is no effect that sets state (the lint rule for that
  // pattern is strict, and the Suspense fallback is the loading
  // state). refresh() swaps in a fresh check; sign-out resolves to
  // null. The check never rejects: a failed check means signed out.
  const [sessionPromise, setSessionPromise] = useState<
    Promise<SessionUser | null>
  >(() => checkSession());
  const user = use(sessionPromise);

  const refresh = useCallback(async () => {
    setSessionPromise(checkSession());
  }, []);

  const signOut = useCallback(async () => {
    await apiLogout();
    setSessionPromise(Promise.resolve(null));
  }, []);

  const value = useMemo(
    () => ({ user, loading: false, refresh, signOut }),
    [user, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// One session check. Never rejects — a failed check means signed out.
function checkSession(): Promise<SessionUser | null> {
  return fetchMe().catch(() => null);
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
