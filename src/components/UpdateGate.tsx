// Update gate — checks for a newer app release once, when the app
// starts, and shows the update dialog when one exists. Optional
// updates the user already dismissed for this tag stay hidden;
// mandatory updates always show. Silent on every failure — a failed
// check never interrupts the app.
import { useEffect, useState } from "react";
import UpdateDialog from "./UpdateDialog";
import {
  checkForUpdate,
  getDismissedTag,
  type UpdateInfo,
} from "../lib/updates";

export default function UpdateGate() {
  const [info, setInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    let alive = true;
    checkForUpdate().then(async (result) => {
      if (!alive || result.status !== "update") return;
      if (!result.info.mandatory) {
        const dismissed = await getDismissedTag();
        if (!alive) return;
        if (dismissed === result.info.tag) return;
      }
      if (alive) setInfo(result.info);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!info) return null;
  return <UpdateDialog info={info} onClose={() => setInfo(null)} />;
}
