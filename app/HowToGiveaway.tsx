import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { JSX } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import GradientScreen from "../components/GradientScreen";
import { colors, radius } from "../utils/theme";

export default function HowToGiveaway(): JSX.Element {
    const navigation = useNavigation();

    return (
        <GradientScreen>
            <ScrollView
                contentContainerStyle={{
                    paddingVertical: 20,
                    alignItems: "center",
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Wrapper to limit width on web */}
                <View style={{ width: "100%", maxWidth: 600, paddingHorizontal: 20 }}>

                    {/* Header with Close Button */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ fontWeight: "900", fontSize: 22 }}>How to Giveaway?</Text>

                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name="close" size={28} color="#000" />
                        </Pressable>
                    </View>

                    {/* Demo Card */}
                    <View
                        style={{
                            backgroundColor: "rgba(255,255,255,0.6)",
                            borderRadius: radius.xl,
                            padding: 20,
                            alignItems: "center",
                            marginBottom: 20,
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

                    {/* Steps */}
                    <View
                        style={{
                            backgroundColor: colors.white,
                            padding: 16,
                            borderRadius: radius.xl,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontWeight: "800" }}>First Step</Text>
                        <Text>Open Instagram and find post.</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: colors.white,
                            padding: 16,
                            borderRadius: radius.xl,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontWeight: "800" }}>Second Step</Text>
                        <Text>Click 3 buttons at the upper right side.</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: colors.white,
                            padding: 16,
                            borderRadius: radius.xl,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontWeight: "800" }}>Third Step</Text>
                        <Text>Copy link.</Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: colors.white,
                            padding: 16,
                            borderRadius: radius.xl,
                        }}
                    >
                        <Text style={{ fontWeight: "800" }}>Fourth Step</Text>
                        <Text>Open this app again and paste the link.</Text>
                    </View>
                </View>
            </ScrollView>
        </GradientScreen>
    );
}
