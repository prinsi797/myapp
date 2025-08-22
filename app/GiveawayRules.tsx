import { useMemo, useState } from "react";
import {
    Dimensions,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import GradientScreen from "../components/GradientScreen";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import { colors, radius } from "../utils/theme";

const { width: screenWidth } = Dimensions.get("window");

/** ---------- Reusable Select (no external package) ---------- */

type Option = { label: string; value: number | string };

function Select({
    value,
    onChange,
    options,
    placeholder = "Select",
    style,
}: {
    value: number | string;
    onChange: (v: any) => void;
    options: Option[];
    placeholder?: string;
    style?: any;
}) {
    const [open, setOpen] = useState(false);
    const selected = useMemo(
        () => options.find((o) => o.value === value)?.label ?? "",
        [options, value]
    );

    return (
        <>
            <Pressable
                onPress={() => setOpen(true)}
                style={[
                    {
                        backgroundColor: "#f7f7f7",
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: "#e5e5e5",
                        height: 48,
                        paddingHorizontal: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    },
                    style,
                ]}
            >
                <Text style={{ color: selected ? "#111" : "#888", fontSize: 14 }}>
                    {selected || placeholder}
                </Text>
                <Text style={{ fontSize: 16, opacity: 0.6 }}>▼</Text>
            </Pressable>

            <Modal
                visible={open}
                animationType="fade"
                transparent
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    onPress={() => setOpen(false)}
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        justifyContent: "center",
                        padding: 24,
                    }}
                >
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: radius.xl,
                            padding: 14,
                            maxWidth: 420,
                            width: "100%",
                            alignSelf: "center",
                        }}
                    >
                        <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>
                            Choose value
                        </Text>
                        {options.map((opt) => {
                            const active = opt.value === value;
                            return (
                                <TouchableOpacity
                                    key={String(opt.value)}
                                    onPress={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        borderRadius: radius.lg,
                                        backgroundColor: active ? "#f1eefc" : "transparent",
                                        marginBottom: 4,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: active ? colors.purple || "#7c3aed" : "#222",
                                            fontWeight: active ? "700" : "500",
                                        }}
                                    >
                                        {opt.label}
                                    </Text>
                                    {active ? <Text style={{ fontWeight: "900" }}>✓</Text> : null}
                                </TouchableOpacity>
                            );
                        })}

                        <PrimaryButton
                            title="Close"
                            onPress={() => setOpen(false)}
                            style={{ marginTop: 8, height: 44 }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

/** --------------------- Screen --------------------- */

export default function GiveawayRules() {
    const [screenRecord, setScreenRecord] = useState(false);
    const [participation, setParticipation] = useState(false);
    const [winners, setWinners] = useState<number>(1);      // default 1
    const [altWinners, setAltWinners] = useState<number>(1); // default 1
    const [keyword, setKeyword] = useState("");
    const [countdown, setCountdown] = useState(3);

    const isWeb = Platform.OS === "web";
    const containerMaxWidth = isWeb ? Math.min(screenWidth * 0.9, 500) : "100%";

    const startGiveaway = () => {
        alert(
            `Giveaway started!\nScreenRecord: ${screenRecord}\nWinners: ${winners}\nAlternate: ${altWinners}\nParticipation: ${participation}\nKeyword: ${keyword}\nCountdown: ${countdown}`
        );
    };

    const numOptions: Option[] = Array.from({ length: 10 }, (_, i) => ({
        label: `${i + 1}`,
        value: i + 1,
    }));

    return (
        <GradientScreen>
            <Header title="Giveaway Rules" coins={15} />

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: Platform.OS === "web" ? 20 : 16,
                    paddingTop: 20,
                    paddingBottom: 24, // enough bottom space
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.card,
                        {
                            maxWidth: containerMaxWidth,
                            alignSelf: "center",
                            width: "100%",
                        },
                    ]}
                >
                    {/* Top preview (placeholder) */}
                    <View style={styles.previewBox}>
                        <Text style={styles.previewTitle}>kaamini_chaube05</Text>
                        <Text style={styles.previewSubtitle}>
                            Happy Krishna Janmashtmi ❤️🙏
                        </Text>
                    </View>

                    {/* Screen Record */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Screen Record</Text>
                        <Switch value={screenRecord} onValueChange={setScreenRecord} />
                    </View>

                    {/* Giveaway Title */}
                    <Text style={styles.label}>Giveaway Title</Text>
                    <TextInput
                        placeholder="Holiday Giveaway"
                        style={[styles.input, { color: "#777" }]}
                        editable={false}
                    />

                    {/* Winners | Alternate Winners (Dropdowns) */}
                    <Text style={styles.label}>Winners | Alternate Winners</Text>
                    <View style={[styles.row, { gap: 10 }]}>
                        <Select
                            value={winners}
                            onChange={setWinners}
                            options={numOptions}
                            style={{ flex: 1 }}
                            placeholder="Winners"
                        />
                        <Select
                            value={altWinners}
                            onChange={setAltWinners}
                            options={numOptions}
                            style={{ flex: 1 }}
                            placeholder="Alternate"
                        />
                    </View>

                    {/* Participation */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Participation</Text>
                        <Switch value={participation} onValueChange={setParticipation} />
                    </View>

                    {/* Keyword */}
                    <Text style={styles.label}>
                        Keyword <Text style={{ color: "#999" }}>(Optional)</Text>
                    </Text>
                    <TextInput
                        placeholder="Add keyword"
                        value={keyword}
                        onChangeText={setKeyword}
                        style={styles.input}
                    />

                    {/* Countdown */}
                    <Text style={styles.label}>Countdown</Text>
                    <View style={[styles.row, { justifyContent: "flex-start" }]}>
                        <PrimaryButton
                            title="−"
                            onPress={() => setCountdown(Math.max(1, countdown - 1))}
                            style={styles.smallBtn}
                        />
                        <Text style={styles.counterValue}>{countdown} sec</Text>
                        <PrimaryButton
                            title="+"
                            onPress={() => setCountdown(countdown + 1)}
                            style={styles.smallBtn}
                        />
                    </View>

                    {/* Start button AT THE END (scroll to see on small screens) */}
                    <PrimaryButton
                        title="START GIVEAWAY"
                        onPress={startGiveaway}
                        style={styles.startButton}
                    />
                </View>
            </ScrollView>
        </GradientScreen>
    );
}

const styles = {
    card: {
        backgroundColor: colors.white,
        borderRadius: radius.xl,
        padding: Platform.OS === "web" ? 24 : 16,
        marginBottom: 22,
        boxShadow: Platform.OS === "web" ? "0 4px 20px rgba(0,0,0,0.1)" : undefined,
        elevation: Platform.OS === "web" ? 0 : 4,
    },
    previewBox: {
        backgroundColor: "#f5f5f5",
        borderRadius: radius.md,
        padding: 12,
        marginBottom: 16,
    },
    previewTitle: { fontWeight: "700", fontSize: 16, color: "#333" },
    previewSubtitle: { fontSize: 14, color: "#666" },

    label: { fontWeight: "700", marginBottom: 6, fontSize: 14, color: "#222" },
    input: {
        backgroundColor: "#f7f7f7",
        borderRadius: radius.lg,
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e5e5e5",
    },
    row: {
        flexDirection: "row" as const,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    smallBtn: { height: 40, minWidth: 44 },
    counterValue: {
        fontWeight: "700",
        fontSize: 14,
        marginHorizontal: 12,
        minWidth: 70,
        textAlign: "center" as const,
    },
    startButton: { marginTop: 20, height: 52 },
};
