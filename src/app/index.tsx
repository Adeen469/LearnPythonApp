// Root index — straight into the tabs. Lessons are public, so the
// app opens on Learn whether or not the user is signed in.
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)" />;
}
