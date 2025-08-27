import AsyncStorage from "@react-native-async-storage/async-storage";
import RecordScreen from 'react-native-record-screen';

import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as Application from "expo-application";
import { useRouter } from "expo-router";

import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image, Platform, ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import GradientScreen from "../components/GradientScreen";


export default function GiveawayRules() {
    const route = useRoute();
    const navigation = useNavigation();
    const { data }: any = route.params;

    const [winner, setWinner] = useState("1");
    const [altWinner, setAltWinner] = useState("0");
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const [participation, setParticipation] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [starting, setStarting] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [screenRecordEnabled, setScreenRecordEnabled] = useState(false);

    const router = useRouter();


    const handleScreenRecordToggle = async (value: boolean) => {
        try {
            if (value) {
                // Start recording
                const startRes = await RecordScreen.startRecording({ mic: true });
                // startRes shape can vary by platform/version; treat truthy as success
                // console.log("startRes:", startRes);
                setIsRecording(true);
                setScreenRecordEnabled(true);
                Alert.alert("Recording Started", "Screen recording has begun.");
            } else {
                // Stop recording
                const stopRes = await RecordScreen.stopRecording();
                // console.log("stopRes:", stopRes);

                // stopRes may be: { result: 'success', outputURL: 'file://...' } or similar
                const outputURL =
                    (stopRes && (stopRes.outputURL || (stopRes.result && stopRes.result.outputURL))) ||
                    (typeof stopRes === "string" ? stopRes : null);

                setIsRecording(false);
                setScreenRecordEnabled(false);

                Alert.alert(
                    "Recording Stopped",
                    outputURL ? `Saved to: ${outputURL}` : "Recording saved to gallery"
                );

                // optional: save the path
                if (outputURL) {
                    await AsyncStorage.setItem("lastRecordingPath", outputURL);
                }
            }
        } catch (err) {
            console.error("Screen recording error:", err);
            Alert.alert("Recording Error", "Check native setup & permissions.");
            setIsRecording(false);
            setScreenRecordEnabled(false);
        }
    };

    const startGiveawayHandler = async () => {
        try {
            setStarting(true);

            // if recording is active, stop it and save path before proceeding
            if (isRecording) {
                try {
                    const stopRes = await RecordScreen.stopRecording();
                    const outputURL =
                        (stopRes && (stopRes.outputURL || (stopRes.result && stopRes.result.outputURL))) ||
                        (typeof stopRes === "string" ? stopRes : null);
                    setIsRecording(false);
                    setScreenRecordEnabled(false);
                    if (outputURL) {
                        await AsyncStorage.setItem("lastRecordingPath", outputURL);
                        // console.log("Recording saved:", outputURL);
                    }
                } catch (e) {
                    console.warn("Failed to stop recording before starting giveaway:", e);
                }
            }

            // ✅ Safe device ID fetch with fallback
            let deviceId = "unknown-device";
            try {
                if (Platform.OS === "android" && Application.getAndroidId) {
                    deviceId = await Application.getAndroidId();
                } else if (Platform.OS === "ios" && Application.getIosIdForVendorAsync) {
                    deviceId = await Application.getIosIdForVendorAsync();
                }
            } catch (e) {
                console.warn("Device ID fetch failed:", e);
            }

            // ✅ API Call
            const res = await axios.post(
                "https://instagram.adinsignia.com/winner.php",
                {
                    postUrl: data.post_url,
                    maxComments: 30,
                    winnerCount: winner,
                    substitutesCount: altWinner,
                    singleUser: participation ? "1" : "0",
                    searchKeyword: keyword,
                    device_id: deviceId,
                }
            );

            // console.log("Winner API Response:", res.data);

            if (res.data?.success === "success") {
                try {
                    // --- WinnerData ko append karo ---
                    const storedWinner = await AsyncStorage.getItem("winnerData");
                    let parsedWinners = storedWinner ? JSON.parse(storedWinner) : [];

                    if (!Array.isArray(parsedWinners)) {
                        parsedWinners = [parsedWinners];
                    }

                    // ✅ Naya winner entry (post + result dono sath me)
                    const newWinnerEntry = {
                        id: Date.now(), // unique id
                        postUrl: data.post_url,
                        postData: data, // jo aap already pass kar rahe ho
                        winnerResponse: res.data, // API ka full response
                        createdAt: new Date().toISOString(),
                    };

                    // Latest sabse upar dikhane ke liye unshift
                    parsedWinners.unshift(newWinnerEntry);

                    // AsyncStorage me save karo
                    await AsyncStorage.setItem("winnerData", JSON.stringify(parsedWinners));
                    // console.log("📦 WinnerData updated:", newWinnerEntry);

                    // --- PostData ko bhi append karo ---
                    const storedPosts = await AsyncStorage.getItem("postData");
                    let parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];

                    if (!Array.isArray(parsedPosts)) {
                        parsedPosts = [parsedPosts];
                    }

                    // naya post entry
                    const newPostEntry = {
                        id: Date.now(),
                        ...data,
                    };

                    parsedPosts.unshift(newPostEntry);

                    await AsyncStorage.setItem("postData", JSON.stringify(parsedPosts));
                    // console.log("📦 PostData updated:", newPostEntry);

                    // --- Debug Logs ---
                    const storedWinnerData = await AsyncStorage.getItem("winnerData");
                    const storedPostData = await AsyncStorage.getItem("postData");

                    // console.log("📦 Stored WinnerData (parsed):", JSON.parse(storedWinnerData || "[]"));
                    // console.log("📦 Stored PostData (parsed):", JSON.parse(storedPostData || "[]"));

                    setStarting(false);

                    // ✅ Navigate to GiveawayStart
                    navigation.navigate("GiveawayStart", {
                        countdownTime: countdown,
                        winnersData: JSON.stringify(res.data),
                        postData: JSON.stringify(data),
                    });
                } catch (err) {
                    console.error("❌ Error saving winner/post data:", err);
                    setStarting(false);
                }
            } else {
                const errorMessage = res.data?.message || "Unexpected error from API";
                alert("Error: " + errorMessage);
                setStarting(false);
            }

        } catch (err) {
            console.error("API Error:", err);
            alert("Something went wrong! Check console for details.");
            setStarting(false);
        }
    };
    return (
        <GradientScreen>
            {/* Back Button */}
            <View style={styles.customHeader}>
                <TouchableOpacity
                    onPress={() => router.push("/")}
                    style={{ alignItems: "center" }}

                >
                    <Icon name="home" size={20} color="#333" />
                    <Text style={{ fontSize: 10 }}>Home</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Giveaway Rules</Text>

                {isRecording && (
                    <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>REC</Text>
                    </View>
                )}

            </View>

            <ScrollView
                style={{ flex: 1, padding: 16 }}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Thumbnail */}
                <View style={styles.imageWrapper}>
                    {loading && (
                        <View style={styles.placeholder}>
                            <ActivityIndicator size="large" color="#8B3A99" />
                        </View>
                    )}
                    <Image
                        source={{ uri: data.media[0].thumbnail }}
                        style={styles.image}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                    />
                    <View style={styles.overlay}>
                        <Text style={styles.username}>@{data.posted_by.username}</Text>
                        <Text style={styles.caption} numberOfLines={2}>
                            {data.caption}
                        </Text>
                    </View>
                </View>

                {/* Options */}
                <View style={{ marginTop: 20 }}>
                    {/* Screen Record */}
                    {/* <View style={styles.optionRow}>
                        <Text style={styles.optionLabel}>Screen Record</Text>
                        <Switch value={false} onValueChange={() => { }} />
                    </View> */}
                    <View style={styles.optionRow}>
                        <View style={styles.recordLabelContainer}>
                            <Text style={styles.optionLabel}>Screen Record</Text>
                            {isRecording && <Text style={styles.recordingStatus}>Recording...</Text>}
                        </View>

                        <Switch
                            value={screenRecordEnabled}
                            onValueChange={handleScreenRecordToggle}
                            trackColor={{ false: "#767577", true: "#8B3A99" }}
                            thumbColor={screenRecordEnabled ? "#f4f3f4" : "#f4f3f4"}
                        />
                    </View>

                    {/* Giveaway Title */}
                    <Text style={styles.label}>Giveaway Title</Text>
                    <TextInput
                        placeholder="Holiday Giveaway"
                        style={styles.input}
                    />

                    {/* Winners */}
                    <Text style={styles.label}>Winners</Text>
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={winner}
                            onValueChange={(itemValue) => setWinner(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    </View>

                    {/* Alternate Winners */}
                    <Text style={styles.label}>Alternate Winners</Text>
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={altWinner}
                            onValueChange={(itemValue) => setAltWinner(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    </View>

                    {/* Participation */}
                    <View style={styles.optionRow}>
                        <Text style={styles.optionLabel}>Participation</Text>
                        <Switch
                            value={participation}
                            onValueChange={(val) => setParticipation(val)}
                        />
                    </View>

                    {/* Keyword */}
                    <Text style={styles.label}>Keyword (Optional)</Text>
                    <TextInput
                        placeholder="Add keyword"
                        style={styles.input}
                        value={keyword}
                        onChangeText={setKeyword}
                    />

                    {/* Countdown */}
                    <Text style={styles.label}>Countdown</Text>
                    <View style={styles.counterBox}>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setCountdown(Math.max(1, countdown - 1))}
                        >
                            <Text style={styles.counterText}>-</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.counterInput}
                            keyboardType="numeric"
                            value={countdown.toString()}
                            onChangeText={(val) => {
                                const num = parseInt(val) || 0;
                                setCountdown(num);
                            }}
                        />
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setCountdown(countdown + 1)}
                        >
                            <Text style={styles.counterText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={startGiveawayHandler}
                    disabled={starting}
                >
                    <Text style={styles.buttonText}>
                        {starting ? `Starting in ${countdown}...` : "START GIVEAWAY"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </GradientScreen>
    );
}

const styles = StyleSheet.create({
    imageWrapper: {
        position: "relative",
        borderRadius: 5,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 300,
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF0000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginRight: 4,
    },
    recordingText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    recordLabelContainer: {
        flexDirection: 'column',
    },
    recordingStatus: {
        fontSize: 12,
        color: '#FF0000',
        fontWeight: '500',
        marginTop: 2,
    },
    placeholder: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0", // halka grey background
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#333",
        textAlign: "center",
    },
    customHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingTop: 15,
        marginLeft: 15,
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
    },
    username: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    caption: {
        color: "#ddd",
        fontSize: 14,
        marginTop: 2,
    },
    optionRow: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionLabel: {
        fontWeight: "600",
        fontSize: 15,
        color: "#333",
    },
    label: {
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 6,
        fontSize: 15,
        color: "#333",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
    },
    dropdownContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
    },
    picker: {
        height: 60,
        width: "100%",
    },
    button: {
        backgroundColor: "#8B3A99",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 30,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    counterBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 8,
        overflow: "hidden",
    },
    counterButton: {
        backgroundColor: "#eee",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    counterText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    counterInput: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        paddingVertical: 10,
    },

});
