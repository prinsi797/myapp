import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="index"
        options={{ drawerLabel: "Home" }}
      />
      <Drawer.Screen
        name="support"
        options={{ drawerLabel: "Support" }}
      />
      <Drawer.Screen
        name="pickwinner"
        options={{ drawerLabel: "Pick Winner" }}
      />
    </Drawer>
  );
}
