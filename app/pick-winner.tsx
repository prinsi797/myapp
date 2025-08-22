import { FlatList, Image, StyleSheet, Text, View } from "react-native";
const packs = [
    {
        id: "1",
        title: "Famous Pack",
        price: "₹500.00",
        coins: "16 COINS",
        giveaways: "4 GIVEAWAY",
        image: "https://insta.adinsignia.com/coupons/1754891515_689984fbeed49.png",
        isPopular: true,
    },
    {
        id: "2",
        title: "Starter Pack",
        price: "₹500.00",
        coins: "10 COINS",
        giveaways: "2 GIVEAWAY",
        image: "https://insta.adinsignia.com/coupons/1754891532_6899850c0e198.png",
        isPopular: false,
    },
    {
        id: "3",
        title: "Pro Pack",
        price: "₹19.99",
        coins: "1200 Coins",
        giveaways: "12 Giveaways",
        image: "https://insta.adinsignia.com/coupons/1754891543_689985179102c.png",
        isPopular: false,
    },
    {
        id: "4",
        title: "Mega Pack",
        price: "₹29.99",
        coins: "2000 Coins",
        giveaways: "20 Giveaways",
        image: "https://insta.adinsignia.com/coupons/1754891556_68998524a2907.png",
        isPopular: false,
    },
];

export default function PickWinner() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.mainTitle}>Pick Your Winners</Text>
                <Text style={styles.subtitle}>Fair, random & instant results everytime.</Text>
                <Text style={styles.giveawayText}>GIVEAWAY : 6 COIN</Text>
            </View>

            <Text style={styles.title}>Get Coin Packs</Text>

            <FlatList
                data={packs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.card,
                        item.isPopular && styles.popularCard
                    ]}>
                        {item.isPopular && (
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularText}>Most Popular</Text>
                            </View>
                        )}

                        <View style={styles.cardContent}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.info}>
                                <Text style={styles.packTitle}>{item.title}</Text>
                                <Text style={styles.coinGiveaway}>
                                    {item.coins} - {item.giveaways}
                                </Text>
                            </View>
                            <Text style={styles.price}>{item.price}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundImage: "linear-gradient(157.37deg, rgb(255, 228, 236), rgb(231, 215, 255))",
        padding: 16,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
        // backgroundColor: "#e8d5f2",
        padding: 20,
        borderRadius: 15,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 15,
    },
    giveawayText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    title: {
        fontSize: 24,
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
    },
    popularCard: {
        borderWidth: 2,
        borderColor: "#8B3A99",
    },
    popularBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#8B3A99",
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    coinGiveaway: {
        fontSize: 14,
        color: "#8B3A99",
        fontWeight: "600",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
});