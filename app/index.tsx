import { Redirect } from "expo-router";

export default function Index() {
  // Redirecting to login to start the auth flow
  return <Redirect href="/login" />;
}
