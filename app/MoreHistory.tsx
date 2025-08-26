import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function MoreHistory() {
    const { giveawayId } = useLocalSearchParams();
    const [giveaway, setGiveaway] = useState<any>(null);

    useEffect(() => {
        const fetchGiveaway = async () => {
            try {
                const storedData = await AsyncStorage.getItem("giveawayData");
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    const found = parsed.find((item: any) => item.id == giveawayId);
                    setGiveaway(found);
                }
            } catch (error) {
                console.error("Error fetching giveaway:", error);
            }
        };
        fetchGiveaway();
    }, [giveawayId]);

    if (!giveaway) return <Text>Loading...</Text>;

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Image
                source={{ uri: giveaway.media?.[0]?.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <Text style={styles.username}>@{giveaway.posted_by?.username}</Text>
            <Text style={styles.caption}>{giveaway.caption}</Text>

            <Text style={styles.winnersTitle}>Winners:</Text>
            <FlatList
                data={giveaway.winners}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => (
                    <Text style={styles.winnerItem}>• {item.username}</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    thumbnail: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
    username: { fontWeight: "bold", fontSize: 18 },
    caption: { fontSize: 14, color: "#555", marginBottom: 12 },
    winnersTitle: { marginTop: 20, fontWeight: "bold", fontSize: 16 },
    winnerItem: { fontSize: 14, color: "#333", marginTop: 4 }
});
