import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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
    const [showGiveaway, setShowGiveaway] = useState(false);
    const router = useRouter(); // ✅ For navigation
    return (
        <GradientScreen>
            <Header coins={15} />
            {/* Main List */}
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 40,
                    alignItems: "center", // Web me center karega
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ width: "100%", maxWidth: 600, paddingHorizontal: 20 }}>
                    {/* Top Card */}
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
                        <Text
                            style={{
                                marginTop: 8,
                                fontWeight: "900",
                                color: colors.textLight,
                            }}
                        >
                            Play demo
                        </Text>
                    </View>

                    {/* Support Section */}
                    <Text style={{ fontWeight: "900", marginBottom: 10 }}>SUPPORT</Text>
                    <Row icon="help-circle" label="How to Giveaway?" onPress={() => setShowGiveaway(true)} />
                    <Row icon="chatbubbles" label="Help" />
                    <Row icon="star" label="Rate Us On Google Play" />
                    <Row icon="share-social" label="Share App" />

                    {/* History */}
                    <Text style={{ fontWeight: "900", marginVertical: 10 }}>HISTORY</Text>
                    <Row
                        icon="time"
                        label="Giveaway History"
                        onPress={() => router.push("/History")} // ✅ navigate karega History.tsx pe
                    />

                    {/* Preferences */}
                    <Text style={{ fontWeight: "900", marginVertical: 10 }}>PREFERENCES</Text>
                    <Row icon="globe" label="Change Language" />

                    {/* Premium */}
                    <Text style={{ fontWeight: "900", marginVertical: 10 }}>PREMIUM</Text>
                    <Row icon="card" label="Get Coins" />

                    {/* Terms */}
                    <Text style={{ fontWeight: "900", marginVertical: 10 }}>TERMS AND AGREEMENT</Text>
                    <Row icon="document-text" label="Privacy Policy" />
                    <Row icon="document-lock" label="Terms & Condition" />
                </View>
            </ScrollView>

            {/* Giveaway Modal */}
            <Modal visible={showGiveaway} animationType="slide">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "#fddde6",
                        padding: 20,
                        paddingTop: 50,
                    }}
                >
                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={() => setShowGiveaway(false)}
                        style={{ position: "absolute", top: 40, right: 20 }}
                    >
                        <Ionicons name="close" size={28} />
                    </TouchableOpacity>

                    <Text style={{ fontWeight: "900", fontSize: 22, marginBottom: 20 }}>
                        How to Giveaway?
                    </Text>

                    {/* Play Demo */}
                    <View
                        style={{
                            backgroundColor: "white",
                            height: 120,
                            borderRadius: radius.xl,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 18,
                        }}
                    >
                        <Ionicons name="play-circle" size={56} color={colors.textLight} />
                        <Text style={{ marginTop: 8, fontWeight: "900" }}>Play demo</Text>
                    </View>

                    {/* Steps */}
                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 16,
                            borderRadius: radius.xl,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>First Step</Text>
                        <Text>Open Instagram and find post.</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 16,
                            borderRadius: radius.xl,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>Second Step</Text>
                        <Text>Click 3 buttons at the upper right side.</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 16,
                            borderRadius: radius.xl,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>Third Step</Text>
                        <Text>Copy link.</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 16,
                            borderRadius: radius.xl,
                        }}
                    >
                        <Text style={{ fontWeight: "900" }}>Fourth Step</Text>
                        <Text>Open this app again and paste the link.</Text>
                    </View>
                </View>
            </Modal>
        </GradientScreen>
    );
}
