import { JSX } from "react";
import { Text, View } from "react-native";
import { colors, radius, shadow } from "../utils/theme";

type Props = {
    title: string;
    coinsText: string;
    price: string;
    badge?: string;
};

export default function PackCard({
    title,
    coinsText,
    price,
    badge,
}: Props): JSX.Element {
    return (
        <View
            style={[
                {
                    backgroundColor: colors.white,
                    borderRadius: radius.xl,
                    padding: 16,
                    borderWidth: 1.5,
                    borderColor: colors.divider,
                },
                shadow.card,
            ]}
        >
            {badge ? (
                <View
                    style={{
                        alignSelf: "flex-end",
                        backgroundColor: colors.purple,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderTopRightRadius: radius.xl,
                        borderBottomLeftRadius: radius.xl,
                        marginTop: -16,
                        marginRight: -16,
                    }}
                >
                    <Text style={{ color: colors.white, fontWeight: "800", fontSize: 12 }}>
                        {badge}
                    </Text>
                </View>
            ) : null}

            <Text style={{ fontSize: 18, fontWeight: "700" }}>{title}</Text>
            <Text style={{ color: colors.purple, marginTop: 6, fontWeight: "700" }}>
                {coinsText}
            </Text>

            <Text style={{ fontSize: 22, fontWeight: "900", marginTop: 8 }}>
                ₹{price}
            </Text>
        </View>
    );
}
