import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import GradientScreen from "../components/GradientScreen";

export default function Package() {
    const [packs, setPacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<number | null>(null);
    const { width } = useWindowDimensions();
    const router = useRouter();

    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const response = await fetch("https://insta.adinsignia.com/api/getcoupon");
                const json = await response.json();
                if (json.success === "success") {
                    setPacks(json.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPacks();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#8B3A99" />
            </View>
        );
    }

    return (
        <GradientScreen>
            <View style={styles.container}>
                {/* Container Wrapper for Web */}
                <View
                    style={[
                        styles.responsiveContainer,
                        Platform.OS === "web" && { width: "100%", maxWidth: 900, alignSelf: "center", overflowX: "hidden" }
                    ]}
                >
                    {/* Custom Header */}
                    <View style={styles.customHeader}>
                        <TouchableOpacity
                            onPress={() => router.push("/")}
                            style={{ alignItems: "center" }}
                        >
                            <Icon name="home" size={20} color="#333" />
                            <Text style={{ fontSize: 10 }}>Home</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false} // ✅ app me vertical scroll line hide
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.header}>
                            <Text style={styles.mainTitle}>Pick Your Winners</Text>
                            <Text style={styles.subtitle}>
                                Fair, random & instant results everytime.
                            </Text>
                            <Text style={styles.giveawayText}>GIVEAWAY : 6 COIN</Text>
                        </View>

                        <Text style={styles.title}>Get Coin Packs</Text>

                        <FlatList
                            data={packs}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => setSelected(item.id)}
                                    style={[
                                        styles.card,
                                        selected === item.id && styles.selectedCard,
                                    ]}
                                >
                                    {item.label_popular && (
                                        <View
                                            style={[
                                                styles.popularBadge,
                                                { backgroundColor: item.label_color || "#8B3A99" },
                                            ]}
                                        >
                                            <Text style={styles.popularText}>
                                                {item.label_popular.toUpperCase()}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.cardContent}>
                                        <Image
                                            source={{ uri: item.pkg_image_url }}
                                            style={styles.image}
                                        />
                                        <View style={styles.info}>
                                            <Text style={styles.packTitle}>{item.title}</Text>
                                            <Text style={styles.coinGiveaway}>
                                                {item.coins} COINS - {item.giveaway} GIVEAWAY
                                            </Text>
                                        </View>
                                        <Text style={styles.price}>₹{item.total_price}.00</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        {/* Fixed Bottom Button */}
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Purchase Package</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </GradientScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    responsiveContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    customHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingTop: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
        padding: 20,
        borderRadius: 15,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        color: "#666",
        marginBottom: 15,
    },
    giveawayText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        backgroundColor: "#ffffffc5",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10,
        alignSelf: "center",
        overflow: "hidden",
        marginTop: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#8B3A99",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        position: "relative",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#eee",
    },
    selectedCard: {
        borderColor: "#8B3A99",
        borderWidth: 2,
    },
    popularBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomLeftRadius: 10,
        zIndex: 1,
    },
    popularText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    image: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    packTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    coinGiveaway: {
        fontSize: 10,
        color: "#8B3A99",
        fontWeight: "500",
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#333",
    },
    button: {
        backgroundColor: "#8B3A99",
        padding: 16,
        borderRadius: 12,
        margin: 16,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
});
