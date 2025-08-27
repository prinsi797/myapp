import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MoreHistory() {
    const { data } = useLocalSearchParams();
    const [winnerData, setWinnerData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (data) {
            try {
                const parsed = JSON.parse(data);
                setWinnerData(parsed);
            } catch (err) {
                console.error("❌ Error parsing passed data:", err);
            }
        }
    }, [data]);

    if (!winnerData) {
        return (
            <View style={styles.container}>
                <Text>Loading winner details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 🔹 Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/History")}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Giveaway Details</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* 🔹 Post Info */}
            <View style={styles.postCard}>
                {/* Left Thumbnail */}
                <Image
                    source={{ uri: winnerData.postData?.media?.[0]?.thumbnail }}
                    style={styles.postThumbnail}
                />

                {/* Right Side Content */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.caption} numberOfLines={3}>
                        {winnerData.postData?.caption}
                    </Text>

                    {/* Comments Row */}
                    <View style={styles.commentRow}>
                        <Ionicons name="chatbubble-outline" size={18} color="#444" />
                        <Text style={styles.commentCount}>
                            {winnerData.postData?.comments_count ?? 0} comments
                        </Text>
                    </View>
                </View>
            </View>

            {/* 🔹 Winners */}
            <View style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                paddingLeft: 10,
                marginBottom: 16,
                elevation: 2, // Android shadow
                shadowColor: "#000", // iOS shadow
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
            }}>
                <Text style={styles.sectionTitle}>🎉 Winners</Text>
                {(winnerData?.winnerResponse?.winners ?? []).length > 0 ? (
                    winnerData.winnerResponse.winners.map((item, index) => (
                        <View key={`winner-${index}`} style={styles.winnerItem}>
                            <Image
                                source={{ uri: item.user?.profile_pic_url }}
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={styles.username}>@{item.user?.username}</Text>
                                <Text style={{ fontSize: 12, color: "#666" }}>{item.text}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>No winners found</Text>
                )}
            </View>

            {/* 🔹 Substitutes */}
            <View style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                paddingLeft: 10,
                marginBottom: 16,
                elevation: 2, // Android shadow
                shadowColor: "#000", // iOS shadow
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
            }}>
                {winnerData.winnerResponse?.substitutes?.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>✨ Substitutes</Text>
                        {winnerData.winnerResponse.substitutes.map((item, index) => (
                            <View key={`sub-${index}`} style={styles.winnerItem}>
                                <Image
                                    source={{ uri: item.user?.profile_pic_url }}
                                    style={styles.avatar}
                                />
                                <Text style={styles.username}>@{item.user?.username}</Text>
                            </View>
                        ))}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, marginTop: 40 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    postCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        elevation: 2, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    postThumbnail: {
        width: 80,
        height: 80,
        borderRadius: 6,
        backgroundColor: "#eee",
    },
    caption: {
        fontSize: 14,
        color: "#333",
        marginBottom: 20,
    },
    commentRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    commentCount: {
        fontSize: 13,
        color: "#555",
        marginLeft: 6,
    },

    title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    postImage: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
    winnerItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    username: { fontSize: 15, fontWeight: "500" },
});
