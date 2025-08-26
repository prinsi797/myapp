import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Giveaway from "./app/Giveaway";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Giveaway" component={Giveaway} />
                {/* <Stack.Screen name="GiveawayRules" component={GiveawayRules} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
