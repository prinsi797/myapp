import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Giveaway from "./app/Giveaway";
import Index from "./app/Index"; // ✅ apna index.tsx import karo

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="Index"   // ✅ yaha Index ko default screen banao
            >
                <Stack.Screen name="Index" component={Index} />
                <Stack.Screen name="Giveaway" component={Giveaway} />
                {/* <Stack.Screen name="GiveawayRules" component={GiveawayRules} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
