import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Clipboard from 'expo-clipboard';

import * as Application from "expo-application";

import { JSX, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import GradientScreen from "../components/GradientScreen";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../utils/theme";

const { width: screenWidth } = Dimensions.get("window");
const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  pill: 999,
};

export default function Giveaway(): JSX.Element {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

  const registerUser = async (): Promise<boolean> => {
    try {
      const storedResponse = await AsyncStorage.getItem("register_response");

      if (storedResponse) {
        const parsedData = JSON.parse(storedResponse);

        setToken(parsedData.data.bearer_token);
        setCoins(Number(parsedData.data.coin_count));
        return true;
      }

      let deviceId: string | null = null;
      if (Platform.OS === "android") {
        deviceId = await Application.getAndroidId();
      } else if (Platform.OS === "ios") {
        deviceId = await Application.getIosIdForVendorAsync();
      } else {
        deviceId = "web-device";
      }

      const res = await axios.post("https://insta.adinsignia.com/api/register", {
        device_id: deviceId || "unknown_device",
      });

      if (res.data.success === "success") {
        const fullResponse = res.data;

        setToken(fullResponse.data.bearer_token);
        setCoins(fullResponse.data.coin_count);

        await AsyncStorage.setItem("register_response", JSON.stringify(fullResponse));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("❌ Register API failed:", err);
      return false;
    }
  };

  const startGiveaway = async () => {
    try {
      setLoading(true);

      const registered = await registerUser();
      if (!registered) {
        setLoading(false);
        alert("Register failed!");
        return;
      }

      const res = await axios.post(
        "https://instagram.adinsignia.com/new-instagram.php",
        {
          postUrl: link,
          maxComments: 100,
        }
      );

      setLoading(false);

      if (res.data.success === "success") {
        const comments = res.data?.data?.comments || [];
        const postData = res.data?.data?.post || {};

        try {
          const storedData = await AsyncStorage.getItem("giveawayData");
          let parsed = storedData ? JSON.parse(storedData) : [];

          if (!Array.isArray(parsed)) {
            parsed = [parsed];
          }

          const newGiveaway = {
            id: Date.now(),
            postUrl: link,
            comments,
            postData,
            token,
            fullResponse: res.data,
          };
          parsed.unshift(newGiveaway);

          await AsyncStorage.setItem("giveawayData", JSON.stringify(parsed));
        } catch (storageErr) {
          console.log("❌ Error saving data:", storageErr);
        }

        navigation.navigate("GiveawayRules", {
          data: { ...res.data, post_url: link },
          comments,
          token,
        });
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  const isWeb = Platform.OS === "web";
  const containerMaxWidth = isWeb ? Math.min(screenWidth * 0.9, 500) : "100%";

  return (
    <GradientScreen>
      <Header title="MENU" coins={coins} />

      <View style={styles.mainContainer}>
        <View
          style={[
            styles.contentCard,
            {
              maxWidth: containerMaxWidth,
              alignSelf: "center",
              width: "100%",
            },
          ]}
        >
          <Text style={styles.title}>Paste your Instagram post link</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="https://www.instagram.com/..."
              value={link}
              onChangeText={setLink}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInput}
            />
            <PrimaryButton
              title="Paste"
              onPress={async () => {
                const text = await Clipboard.getStringAsync();
                setLink(text);
              }}
              style={styles.pasteButton}
              textStyle={styles.pasteButtonText}
            />
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.purple}
              style={{ marginTop: 20 }}
            />
          ) : (
            <PrimaryButton
              title="NEXT STEP"
              onPress={startGiveaway}
              style={styles.nextButton}
              disabled={!link}
            />
          )}

          <Text style={styles.disclaimerText}>
            You won't be charged until you start the giveaway in the next step.
          </Text>
        </View>
      </View>
    </GradientScreen>
  );
}

const styles = {
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Platform.OS === "web" ? 20 : 16,
    paddingVertical: 20,
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: Platform.OS === "web" ? 24 : 16,
    marginBottom: 22,
    boxShadow:
      Platform.OS === "web" ? "0 4px 20px rgba(0,0,0,0.1)" : undefined,
    elevation: Platform.OS === "web" ? 0 : 4,
  },
  title: {
    fontWeight: "900",
    fontSize: Platform.OS === "web" ? 20 : 15,
    marginBottom: 16,
    textAlign: "left",
    color: "#8b3a99",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
  },
  pasteButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    minWidth: 70,
    height: 40,
  },
  pasteButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  nextButton: {
    marginTop: 20,
  },
  disclaimerText: {
    marginTop: 12,
    textAlign: "center",
    color: "#666",
    fontSize: 13,
  },
};
