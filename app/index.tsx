import { JSX, useState } from "react";
import { Dimensions, Platform, Text, TextInput, View } from "react-native";
import GradientScreen from "../components/GradientScreen";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import { colors, radius } from "../utils/theme";

const { width: screenWidth } = Dimensions.get('window');

export default function Giveaway(): JSX.Element {
  const [link, setLink] = useState<string>("");

  const startGiveaway = async () => {
    alert(`Giveaway started for: ${link}`);
  };

  // Web ke liye responsive styles
  const isWeb = Platform.OS === 'web';
  const containerMaxWidth = isWeb ? Math.min(screenWidth * 0.9, 500) : '100%';

  return (
    <GradientScreen>
      <Header title="MENU" coins={15} />

      <View style={styles.mainContainer}>
        <View
          style={[
            styles.contentCard,
            {
              maxWidth: containerMaxWidth,
              alignSelf: 'center',
              width: '100%',
            }
          ]}
        >
          <Text style={styles.title}>
            Paste your Instagram post link
          </Text>

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
              onPress={() => { }}
              style={styles.pasteButton}
              textStyle={styles.pasteButtonText}
            />
          </View>

          <PrimaryButton
            title="NEXT STEP"
            onPress={startGiveaway}
            style={styles.nextButton}
            disabled={!link}
          />

          <Text style={styles.disclaimerText}>
            You won't be charged until you start the giveaway in the next step.
          </Text>

          <Text style={styles.helpText}>
            How to Giveaway?
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
    paddingHorizontal: Platform.OS === 'web' ? 20 : 16,
    paddingVertical: 20,
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: Platform.OS === 'web' ? 24 : 16,
    marginBottom: 22,
    minHeight: Platform.OS === 'web' ? 'auto' : undefined,
    boxShadow: Platform.OS === 'web' ? '0 4px 20px rgba(0,0,0,0.1)' : undefined,
    elevation: Platform.OS === 'web' ? 0 : 4,
  },
  title: {
    fontWeight: "900",
    fontSize: Platform.OS === 'web' ? 20 : 18,
    marginBottom: Platform.OS === 'web' ? 16 : 10,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
    color: colors.textDark || '#333',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: Platform.OS === 'web' ? 16 : 0,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    height: Platform.OS === 'web' ? 52 : 48,
    fontSize: Platform.OS === 'web' ? 16 : 14,
    outline: Platform.OS === 'web' ? 'none' : undefined,
    border: Platform.OS === 'web' ? '1px solid #E5E5E5' : undefined,
  },
  pasteButton: {
    paddingHorizontal: Platform.OS === 'web' ? 16 : 12,
    paddingVertical: Platform.OS === 'web' ? 8 : 6,
    minWidth: Platform.OS === 'web' ? 80 : 70,
    height: Platform.OS === 'web' ? 40 : 36,
  },
  pasteButtonText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '600',
  },
  nextButton: {
    marginTop: Platform.OS === 'web' ? 20 : 14,
    height: Platform.OS === 'web' ? 52 : undefined,
  },
  disclaimerText: {
    marginTop: Platform.OS === 'web' ? 16 : 12,
    textAlign: "center",
    color: colors.textLight || '#666',
    fontSize: Platform.OS === 'web' ? 14 : 13,
    lineHeight: Platform.OS === 'web' ? 20 : undefined,
  },
  helpText: {
    marginTop: Platform.OS === 'web' ? 12 : 10,
    textAlign: "center",
    fontWeight: "800",
    color: colors.purple || '#8B3A99',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    textDecorationLine: Platform.OS === 'web' ? 'underline' : undefined,
    cursor: Platform.OS === 'web' ? 'pointer' : undefined,
  },
};