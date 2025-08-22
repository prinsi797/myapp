import { Ionicons } from "@expo/vector-icons";
import { JSX } from "react";
import { Pressable, Text, View } from "react-native";
import GradientScreen from "../components/GradientScreen";
import Header from "../components/Header";
import { colors, radius } from "../utils/theme";

type RowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
};

function Row({ icon, label, onPress }: RowProps): JSX.Element {
    return (
        <Pressable
            onPress={onPress}
            style={{
                backgroundColor: colors.white,
                padding: 16,
                borderRadius: radius.xl,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Ionicons name={icon} size={20} />
                <Text style={{ fontWeight: "700" }}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} />
        </Pressable>
    );
}

export default function Support(): JSX.Element {
    return (
        <GradientScreen>
            <Header title="HOME" coins={15} />

            <View
                style={{
                    backgroundColor: colors.white,
                    height: 160,
                    borderRadius: radius.xl,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                }}
            >
                <Ionicons name="play-circle" size={56} color={colors.textLight} />
                <Text style={{ marginTop: 8, fontWeight: "900", color: colors.textLight }}>
                    Play demo
                </Text>
            </View>

            <Text style={{ fontWeight: "900", marginBottom: 10 }}>SUPPORT</Text>
            <Row icon="help-circle" label="How to Giveaway?" />
            <Row icon="chatbubbles" label="Help" />
            <Row icon="star" label="Rate Us On Google Play" />
            <Row icon="share-social" label="Share App" />

            <Text style={{ fontWeight: "900", marginVertical: 10 }}>HISTORY</Text>
            <Row icon="time" label="Giveaway History" />

            <Text style={{ fontWeight: "900", marginVertical: 10 }}>PREFERENCES</Text>
            <Row icon="globe" label="Change Language" />

            <Text style={{ fontWeight: "900", marginVertical: 10 }}>PREMIUM</Text>
            <Row icon="card" label="Get Coins" />
        </GradientScreen>
    );
}
