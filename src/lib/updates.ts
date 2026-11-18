// In-app updates, driven by GitHub Releases of the LearnPythonApp repo.
//
// How it works (no backend involved — the app talks to GitHub's public
// API directly):
// 1. On launch (and from Settings), the app fetches the latest release
//    of Adeen469/LearnPythonApp.
// 2. If the release tag is a newer version than this build, the update
//    dialog shows with the release notes as the update details.
// 3. Mandatory: put `[mandatory]` in the release title or body. A
//    mandatory update cannot be dismissed — it blocks the app until
//    the new APK is installed.
// 4. "Update" downloads the release's .apk and opens the Android
//    installer. The user still taps "Install" in the system prompt;
//    Android asks to allow "Install unknown apps" for Learn Python
//    the first time (that needs REQUEST_INSTALL_PACKAGES in app.json).
//
// Shipping an update (for the maintainer): bump `version` in app.json,
// build the APK with EAS, create a GitHub Release with a tag like
// v1.1.0, attach the .apk, and write the changes in the release notes.
// The app compares the tag against its own version, so the tag must be
// higher than the version the user already has installed.
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { Directory, File, Paths } from "expo-file-system";
import { getContentUriAsync } from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";

export const UPDATE_REPO = "Adeen469/LearnPythonApp";
const RELEASES_LATEST_URL = `https://api.github.com/repos/${UPDATE_REPO}/releases/latest`;
const DISMISSED_KEY = "lp_update_dismissed";
const MANDATORY_MARKER = "[mandatory]";

export type UpdateInfo = {
  /** Release tag, e.g. "v1.1.0". */
  tag: string;
  /** Version without the leading "v", e.g. "1.1.0". */
  version: string;
  /** True when the release title or body contains [mandatory]. */
  mandatory: boolean;
  /** Release notes — shown as the update details. */
  notes: string;
  /** Direct download URL of the release's .apk asset. */
  apkUrl: string;
  sizeBytes: number;
};

export type UpdateCheckResult =
  | { status: "update"; info: UpdateInfo }
  | { status: "uptodate" }
  | { status: "unavailable" };

export function currentVersion(): string {
  return Constants.expoConfig?.version ?? "1.0.0";
}

/** Numeric dotted-version compare: "1.10.0" > "1.9.0". */
export function isNewerVersion(latest: string, current: string): boolean {
  const parse = (v: string) =>
    v
      .trim()
      .replace(/^v/i, "")
      .split(".")
      .map((n) => parseInt(n, 10) || 0);
  const a = parse(latest);
  const b = parse(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x !== y) return x > y;
  }
  return false;
}

type GithubRelease = {
  tag_name: string;
  name: string | null;
  body: string | null;
  assets: { name: string; browser_download_url: string; size: number }[];
};

/**
 * Check GitHub for a newer release. Android only — iOS cannot install
 * an APK. Never throws: offline, no releases yet, or a failed request
 * all come back as "unavailable" and the app just stays silent.
 */
export async function checkForUpdate(): Promise<UpdateCheckResult> {
  if (Platform.OS !== "android") return { status: "uptodate" };
  let res: Response;
  try {
    res = await fetch(RELEASES_LATEST_URL, {
      headers: { Accept: "application/vnd.github+json" },
    });
  } catch {
    return { status: "unavailable" };
  }
  if (!res.ok) return { status: "unavailable" };
  let release: GithubRelease;
  try {
    release = (await res.json()) as GithubRelease;
  } catch {
    return { status: "unavailable" };
  }
  const apk = release.assets?.find((a) =>
    a.name.toLowerCase().endsWith(".apk")
  );
  if (!apk) return { status: "unavailable" };
  const version = release.tag_name.trim().replace(/^v/i, "");
  if (!version || !isNewerVersion(version, currentVersion())) {
    return { status: "uptodate" };
  }
  const title = release.name ?? "";
  const body = release.body ?? "";
  return {
    status: "update",
    info: {
      tag: release.tag_name,
      version,
      mandatory: (title + "\n" + body).toLowerCase().includes(MANDATORY_MARKER),
      notes: body.trim(),
      apkUrl: apk.browser_download_url,
      sizeBytes: apk.size,
    },
  };
}

/** The release tag the user dismissed with "Later" (optional updates). */
export async function getDismissedTag(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(DISMISSED_KEY);
  } catch {
    return null;
  }
}

export async function dismissUpdate(tag: string): Promise<void> {
  try {
    await AsyncStorage.setItem(DISMISSED_KEY, tag);
  } catch {
    // Storage unavailable — the dialog will just show again next launch.
  }
}

/**
 * Download the release APK and open the Android installer.
 * `onProgress` gets 0..1 as the download proceeds.
 *
 * The installer needs a content:// URI (Android 7+ refuses file://),
 * and only the legacy file-system API exposes getContentUriAsync — the
 * new File/Directory API has no equivalent, so this one call uses the
 * legacy import. The download itself uses the new API.
 */
export async function downloadAndInstall(
  info: UpdateInfo,
  onProgress: (fraction: number) => void
): Promise<void> {
  const dir = new Directory(Paths.cache, "updates");
  if (!dir.exists) dir.create();
  const file = new File(dir, `learn-python-${info.tag}.apk`);
  if (file.exists) file.delete();
  const task = File.createDownloadTask(info.apkUrl, file, {
    onProgress: (p) => {
      if (p.totalBytes > 0) onProgress(p.bytesWritten / p.totalBytes);
    },
  });
  const downloaded = await task.downloadAsync();
  if (!downloaded) throw new Error("Download was interrupted.");
  const contentUri = await getContentUriAsync(downloaded.uri);
  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: contentUri,
    type: "application/vnd.android.package-archive",
    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
  });
}

/** Open the "Install unknown apps" settings screen for this app. */
export async function openUnknownSourcesSettings(): Promise<void> {
  await IntentLauncher.startActivityAsync(
    IntentLauncher.ActivityAction.MANAGE_UNKNOWN_APP_SOURCES,
    { data: "package:com.learnpython.app" }
  );
}
