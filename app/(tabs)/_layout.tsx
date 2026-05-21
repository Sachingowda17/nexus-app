import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />

      <Tabs.Screen
        name="worker"
        options={{ title: "Worker" }}
      />

      <Tabs.Screen
        name="contractor"
        options={{ title: "Contractor" }}
      />

      <Tabs.Screen
        name="applications"
        options={{ title: "Applications" }}
      />

      <Tabs.Screen
        name="explore"
        options={{ title: "Explore" }}
      />

    </Tabs>
  );
}