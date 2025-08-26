import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function History() {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const router = useRouter();
    const deviceId = "YOUR_DEVICE_ID"; // ← Replace with actual device_id from your app logic

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const storedData = await AsyncStorage.getItem("giveawayData");
                console.log("history data", storedData);
                if (storedData) {
                    let parsed = JSON.parse(storedData);

                    // ✅ Ensure parsed is always an array
                    if (!Array.isArray(parsed)) {
                        parsed = [parsed];
                    }

                    // Filter giveaways for this device_id
                    const filtered = parsed.filter((item: any) => item.device_id === deviceId);

                    setHistoryData(filtered);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };
        fetchHistory();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => router.push({
                pathname: "/more-history",
                params: { giveawayId: item.id }
            })}
        >
            <Image
                source={{ uri: item.media?.[0]?.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.username}>@{item.posted_by?.username}</Text>
                <Text style={styles.caption} numberOfLines={2}>
                    {item.caption}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={styles.title}>Giveaway History</Text>
            <FlatList
                data={historyData}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    itemContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    thumbnail: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
    username: { fontWeight: "bold", fontSize: 16 },
    caption: { color: "#555" }
});
