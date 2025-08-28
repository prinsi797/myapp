import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function History() {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const storedData = await AsyncStorage.getItem("winnerData");
                if (storedData) {
                    let parsed = JSON.parse(storedData);

                    if (!Array.isArray(parsed)) {
                        parsed = [parsed];
                    }

                    const formatted = parsed.map((entry: any) => ({
                        id: entry.id,
                        postData: entry.postData,
                        winnerResponse: entry.winnerResponse,
                    }));

                    setHistoryData(formatted);
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
            onPress={() =>
                router.push({
                    pathname: "/MoreHistory",
                    params: {
                        giveawayId: item.id.toString(),
                        data: JSON.stringify(item),
                    },
                })
            }
        >
            <Image
                source={{ uri: item.postData?.media?.[0]?.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.postData?.posted_by?.username}</Text>
                <Text style={styles.caption} numberOfLines={2}>
                    {item.postData?.caption}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 16 }}>
            {/* 🔹 Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.push("/support")}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Giveaway History</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* 🔹 List */}
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
            <View style={{}}>
                <FlatList
                    data={historyData}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                />
            </View>
            {/* </ScrollView> */}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 40,
    },
    backButton: {
        width: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    itemContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    thumbnail: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
    username: { fontWeight: "bold", fontSize: 16 },
    caption: { color: "#555" },
});
