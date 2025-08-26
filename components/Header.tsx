import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export default function Header({
    coins,
    showBack = false, // by default false
}: {
    coins?: number;
    showBack?: boolean;
}) {
    const navigation = useNavigation();

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
            }}
        >
            {/* Left side: Menu OR Back */}
            {showBack ? (
                <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => navigation.navigate("home")} // back → home
                >
                    <Ionicons name="arrow-back" size={28} color="#333" />
                    <Text style={{ fontSize: 10 }}>Back</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => navigation.navigate("support")}
                >
                    <Ionicons name="menu" size={28} color="#333" />
                    <Text style={{ fontSize: 10 }}>Menu</Text>
                </TouchableOpacity>
            )}
            {/* Right: Gift + Coins */}
            <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => navigation.navigate("Packages")}
            >
                <MaterialCommunityIcons
                    name="gift-outline"
                    size={22}
                    color="#333"
                />
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {coins ?? 0}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
