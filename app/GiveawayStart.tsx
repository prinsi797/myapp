import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GiveawayStart() {
    const router = useRouter();
    const { countdownTime, postData, winnersData, comments } = useLocalSearchParams();
    const [count, setCount] = useState(Number(countdownTime) || 5);

    useEffect(() => {
        try {
            const parsedWinners = JSON.parse(winnersData);
            console.log("🎯 WinnersData (parsed):", parsedWinners);
        } catch (err) {
            console.log("⚠️ WinnersData parse error:", err, winnersData);
        }
    }, [winnersData]);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            router.replace({
                pathname: "/Winner",
                params: {
                    winnersData, // Already stringified from previous screen
                    postData,
                    comments,
                    giveawayCompleted: false
                }
            });
        }
    }, [count]);

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/Gift.gif")}
                style={styles.gif}
                contentFit="contain"
            />
            <Text style={styles.text}>Giveaway Starts In</Text>
            <Text style={styles.count}>{count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    gif: { width: 250, height: 250 },
    text: { fontSize: 18, marginTop: 10, color: '#8b3a99' },
    count: { fontSize: 40, fontWeight: "bold", marginTop: 5, color: '#8b3a99' }
});
