import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import GradientScreen from "../components/GradientScreen";

// ✅ Safe text helper
const safeText = (value: any) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (value === null || value === undefined) return "";
    return String(value);
};


export default function PickWinner() {
    const navigation = useNavigation(); // 🔹 Navigation hook
    const [allComments, setAllComments] = useState<any[]>([]);
    const [winners, setWinners] = useState<any[]>([]);
    const [substitutes, setSubstitutes] = useState<any[]>([]);
    const [postData, setPostData] = useState<any>(null);
    const [isScrolling, setIsScrolling] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<FlatList>(null);

    const openProfile = async (profileUrl: string, username: string) => {
        try {
            if (profileUrl) {
                let cleanUrl = profileUrl.trim();
                if (!cleanUrl.startsWith('http')) {
                    cleanUrl = `https://www.instagram.com/${username}`;
                }

                const supported = await Linking.canOpenURL(cleanUrl);

                if (supported) {
                    await Linking.openURL(cleanUrl);
                } else {
                    const fallbackUrl = `https://www.instagram.com/${username}`;
                    await Linking.openURL(fallbackUrl);
                }
            } else {
                const directUrl = `https://www.instagram.com/${username}`;
                await Linking.openURL(directUrl);
            }
        } catch (error) {
            Alert.alert(
                "Profile Open Error",
                `Could not open @${username}'s profile. Error: ${error}`
            );
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedWinner = await AsyncStorage.getItem("winnerData");

                if (storedWinner) {
                    const parsedWinner = JSON.parse(storedWinner);
                    const winnerList = Array.isArray(parsedWinner) ? parsedWinner : [parsedWinner];
                    const lastWinnerEntry = winnerList[0];

                    console.log("📦 Local LAST winner data loaded:", lastWinnerEntry);

                    setWinners(lastWinnerEntry?.winnerResponse?.winners || []);
                    setSubstitutes(lastWinnerEntry?.winnerResponse?.substitutes || []);

                    setPostData(lastWinnerEntry?.postData || null);

                    const commenters =
                        lastWinnerEntry?.postData?.comments?.map((c: any) => ({
                            username: c.user?.username,
                            profile_pic: c.user?.profile_pic_url,
                            profile_url: c.user?.profile_url,
                            is_verified: c.user?.is_verified,
                        })) || [];

                    setAllComments(commenters);
                } else {
                    console.log("⚠ No winner data found in local storage");
                }
            } catch (err) {
                console.log("❌ Error loading local data:", err);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (!allComments.length || !isScrolling) return;

        const interval = setInterval(() => {
            scrollRef.current?.scrollToIndex({
                index: currentIndex % allComments.length,
                animated: true,
            });
            setCurrentIndex((prev) => prev + 1);
        }, 50);

        // ⏳ Stop scrolling after 5 sec
        const timer = setTimeout(() => {
            clearInterval(interval);
            setIsScrolling(false);
        }, 200);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [allComments, currentIndex, isScrolling]);

    if (!allComments.length) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#8B3A99" />
                <Text>Loading commenters...</Text>
            </View>
        );
    }

    return (
        <GradientScreen>
            <ScrollView
                contentContainerStyle={{
                    paddingVertical: 20,
                    alignItems: "center",
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1, padding: 16 }}>
                    {isScrolling && (
                        <FlatList
                            ref={scrollRef}
                            data={allComments}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.profileWrapper}
                                    onPress={() => {
                                        console.log("👆 Commenter clicked:", item.username);
                                        openProfile(item.profile_url, item.username);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Image source={{ uri: item.profile_pic }} style={styles.avatar} />

                                    <Text style={styles.username}>
                                        {safeText(item.username)}
                                    </Text>

                                </TouchableOpacity>
                            )}
                        />
                    )}

                    {/* Thumbnail + Caption section */}
                    {!isScrolling && postData && (
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginBottom: 30
                        }}>
                            🎉 Giveaway Completed
                        </Text>
                    )}

                    {!isScrolling && postData && (
                        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 20 }}>
                            <Image
                                source={{ uri: postData?.media?.[0]?.thumbnail }}
                                style={styles.postImage}
                                resizeMode="cover"
                            />
                            <View style={{ justifyContent: "center" }}> {/* Center vertically */}
                                <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
                                    @{postData?.posted_by?.username}
                                </Text>

                                <Text style={{ color: "#555" }} numberOfLines={3} ellipsizeMode="tail">
                                    {safeText(postData?.caption)}
                                </Text>

                            </View>
                        </View>
                    )}

                    {/* 🔹 Winners List */}
                    {!isScrolling && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.winnerTitle}>🎉 Winners</Text>
                            {winners.map((w, idx) => {
                                const handleWinnerPress = () => {
                                    console.log("🎯 WINNER PRESSED:", w.user?.username);
                                    console.log("🔗 Profile URL:", w.user?.profile_url);

                                    const username = w.user?.username || '';
                                    const text = w.text || '';
                                    const profileUrl = w.user?.profile_url || `https://www.instagram.com/${username}`;

                                    console.log("🚀 Opening URL:", profileUrl);

                                    Linking.openURL(profileUrl).catch(err => {
                                        console.log("❌ Error:", err);
                                        // Fallback
                                        const fallbackUrl = `https://instagram.com/${username}`;
                                        Linking.openURL(fallbackUrl).catch(() => {
                                            Alert.alert("Error", `Cannot open @${username} profile`);
                                        });
                                    });
                                };
                                const rank = `${idx + 1}${idx === 0 ? "st" : idx === 1 ? "nd" : idx === 2 ? "rd" : "th"}`;

                                return (
                                    <View key={idx} style={styles.winnerContainer}>
                                        <View style={styles.winnerRow}>
                                            {/* Rank badge */}
                                            <View style={styles.rankBadge}>
                                                <Text style={styles.rankText}>{rank}</Text>
                                            </View>

                                            <TouchableOpacity
                                                onPress={handleWinnerPress}
                                                style={styles.avatarContainer}
                                            >
                                                <Image
                                                    source={{ uri: w.user?.profile_pic_url }}
                                                    style={styles.winnerAvatar}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={handleWinnerPress}
                                                style={styles.winnerInfo}
                                            >

                                                <Text style={styles.winnerName}>
                                                    {safeText(w.user?.username)} {w.user?.is_verified ? "✅" : ""}
                                                </Text>
                                                <Text style={styles.winnerText} numberOfLines={2} ellipsizeMode="tail">
                                                    {safeText(w.text)}
                                                </Text>

                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* Alternate Winners */}
                    {!isScrolling && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.winnerTitle}>🎉 Alternate Winners</Text>
                            {substitutes.map((w, idx) => {
                                const handleWinnerPress = () => {
                                    console.log("🎯 substitutes WINNER PRESSED:", w.user?.username);
                                    console.log("🔗 Profile URL:", w.user?.profile_url);

                                    const username = w.user?.username || '';
                                    const profileUrl = w.user?.profile_url || `https://www.instagram.com/${username}`;

                                    console.log("🚀 Opening URL:", profileUrl);

                                    Linking.openURL(profileUrl).catch(err => {
                                        console.log("❌ Error:", err);
                                        // Fallback
                                        const fallbackUrl = `https://instagram.com/${username}`;
                                        Linking.openURL(fallbackUrl).catch(() => {
                                            Alert.alert("Error", `Cannot open @${username} profile`);
                                        });
                                    });
                                };

                                const rankNumber = winners.length + idx + 1;
                                const rank =
                                    `${rankNumber}${rankNumber === 1 ? "st" : rankNumber === 2 ? "nd" : rankNumber === 3 ? "rd" : "th"}`;

                                return (
                                    <View key={idx} style={styles.winnerContainer}>
                                        <View style={styles.winnerRow}>
                                            {/* Rank badge */}
                                            <View style={styles.rankBadge}>
                                                <Text style={styles.rankText}>{rank}</Text>
                                            </View>

                                            <TouchableOpacity
                                                onPress={handleWinnerPress}
                                                style={styles.avatarContainer}
                                            >
                                                <Image
                                                    source={{ uri: w.user?.profile_pic_url }}
                                                    style={styles.winnerAvatar}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={handleWinnerPress}
                                                style={styles.winnerInfo}
                                            >
                                                <Text style={styles.winnerName}>
                                                    {safeText(w.user?.username)} {w.user?.is_verified ? "✅" : ""}
                                                </Text>

                                                <Text style={styles.winnerText} numberOfLines={2} ellipsizeMode="tail">
                                                    {safeText(w.text)}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* End Giveaway Button */}
                    {!isScrolling && (
                        <TouchableOpacity
                            style={styles.endButton}
                            onPress={() => {
                                navigation.navigate("index");
                            }}
                        >
                            <Text style={styles.endButtonText}>End Giveaway</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </GradientScreen>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    profileWrapper: {
        alignItems: "center",
        marginHorizontal: 8,
        padding: 5,
        borderRadius: 10,
    },
    endButton: {
        backgroundColor: "#8B3A99",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    endButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    avatar: { width: 60, height: 60, borderRadius: 30 },
    username: {
        marginTop: 5,
        fontSize: 12,
        maxWidth: 70,
        textAlign: "center",
        color: "#333",
    },
    winnerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#333",
    },
    winnerContainer: {
        marginBottom: 12,
        marginHorizontal: 20,
        backgroundColor: "white",
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
    },
    winnerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 15,
        borderRadius: 15,
        minHeight: 70,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        position: "relative",
    },
    avatarContainer: {
        marginRight: 15,
    },
    rankBadge: {
        position: "absolute",
        top: -10,
        right: 10,
        backgroundColor: "#8B3A99",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        zIndex: 1,
    },
    rankText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    winnerAvatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 2,
        borderColor: "#fff",
    },
    winnerInfo: {
        flex: 1,
    },
    winnerName: {
        fontSize: 16,
        color: "#333",
        fontWeight: "600",
        marginBottom: 2,
    },
    winnerText: {
        fontSize: 12,
        color: "#c2a9a9ff",
        fontWeight: "600",
        marginBottom: 2,
    },
    clickHint: {
        fontSize: 12,
        color: "#666",
        fontStyle: "italic",
    },
    postDetails: { alignItems: "center", marginTop: 20 },
    postImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
    postUser: { marginTop: 10, fontWeight: "bold", fontSize: 16 },
    postCaption: { marginTop: 5, textAlign: "center", color: "#555" },
});
