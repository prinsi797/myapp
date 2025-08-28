import { Drawer } from "expo-router/drawer";
import { Text } from "react-native";

export default function Layout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="index"
        options={{ drawerLabel: () => <Text>Home</Text> }}
      />
      <Drawer.Screen
        name="support"
        options={{ drawerLabel: () => <Text>Support</Text> }}
      />
      <Drawer.Screen
        name="Winner"
        options={{ drawerLabel: () => <Text>Pick Winner</Text> }}
      />
    </Drawer>
  );
}
