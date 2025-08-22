import { Ionicons } from "@expo/vector-icons";
import { JSX } from "react";
import { Pressable, Text, View } from "react-native";
import { colors, radius } from "../utils/theme";

type Props = {
    title?: string;
    coins?: number;
    onMenuPress?: () => void;
    onCoinsPress?: () => void;
};

export default function Header({
    title = "HOME",
    coins = 15,
    onMenuPress,
    onCoinsPress,
}: Props): JSX.Element {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Pressable
                onPress={onMenuPress}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.pill,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                accessibilityLabel="Menu"
            >
                <Ionicons name="menu" size={26} color={colors.textDark} />
            </Pressable>

            <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "800", letterSpacing: 1 }}>{title}</Text>
            </View>

            <Pressable
                onPress={onCoinsPress}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.chip,
                    paddingHorizontal: 12,
                    height: 36,
                    borderRadius: radius.pill,
                    gap: 6,
                }}
                accessibilityLabel="Coins"
            >
                <Ionicons name="star" size={18} color={colors.purple} />
                <Text style={{ fontWeight: "800" }}>{coins} COINS</Text>
            </Pressable>
        </View>
    );
}
