// Global imports
import {
  ScrollView,
  View,
  Pressable,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Local imports
import { Text } from "@/components/ui";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { FAQ_ITEMS } from "./config";
import { Header } from "@/components/ui-components/Header";

const HelpSupport = () => {
  const { isDarkColorScheme } = useColorScheme();

  const contactOptions = [
    {
      icon: "Mail",
      title: "Email Support",
      subtitle: "support@walletly.app",
      action: () => handleEmail("support@walletly.app"),
    },
    {
      icon: "MessageCircle",
      title: "Live Chat",
      subtitle: "Chat with our support team",
      action: () => Alert.alert("Coming Soon", "Live chat support coming soon"),
    },
    {
      icon: "Globe",
      title: "Website",
      subtitle: "Visit our website",
      action: () => handleLink("https://walletly.app"),
    },
  ];

  const handleEmail = async (email: string) => {
    const url = `mailto:${email}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", "Unable to open email client");
    }
  };

  const handleLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", "Unable to open link");
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header title="Help & Support" canGoBack />

        {/* Contact Options */}
        <View className="px-5 mb-8">
          <Text className="text-muted-foreground text-sm font-medium mb-4">
            GET IN TOUCH
          </Text>
          {contactOptions.map((option, index) => (
            <Pressable key={index} onPress={option.action} className="mb-3">
              <View
                style={{
                  backgroundColor: isDarkColorScheme
                    ? "rgba(20, 184, 166, 0.1)"
                    : "rgba(20, 184, 166, 0.05)",
                  borderWidth: 1,
                  borderColor: isDarkColorScheme
                    ? "rgba(20, 184, 166, 0.2)"
                    : "rgba(20, 184, 166, 0.15)",
                }}
                className="flex-row items-center justify-between p-4 rounded-xl"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    style={{
                      backgroundColor: isDarkColorScheme
                        ? "rgba(20, 184, 166, 0.15)"
                        : "rgba(20, 184, 166, 0.1)",
                    }}
                    className="p-3 rounded-lg"
                  >
                    <Icon name={option.icon as any} size={20} color="#14B8A6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-sm font-semibold">
                      {option.title}
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                      {option.subtitle}
                    </Text>
                  </View>
                </View>
                <Icon name="ArrowRight" size={20} color="#14B8A6" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* FAQ Section */}
        <View className="px-5 mb-6">
          <Text className="text-muted-foreground text-sm font-medium mb-4">
            FREQUENTLY ASKED QUESTIONS
          </Text>
          {FAQ_ITEMS.map((item, index) => (
            <View key={index} className="mb-4">
              <View
                style={{
                  backgroundColor: isDarkColorScheme
                    ? "rgba(63, 63, 70, 0.5)"
                    : "rgba(228, 228, 231, 0.5)",
                  borderWidth: 1,
                  borderColor: isDarkColorScheme
                    ? "rgba(82, 82, 91, 0.3)"
                    : "rgba(212, 212, 216, 0.5)",
                }}
                className="p-4 rounded-xl"
              >
                <Text className="text-foreground font-semibold text-sm mb-2">
                  {item.question}
                </Text>
                <Text className="text-muted-foreground text-xs leading-5">
                  {item.answer}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View className="px-5 pb-8">
          <View
            style={{
              backgroundColor: isDarkColorScheme
                ? "rgba(20, 184, 166, 0.05)"
                : "rgba(20, 184, 166, 0.02)",
              borderWidth: 1,
              borderColor: isDarkColorScheme
                ? "rgba(20, 184, 166, 0.15)"
                : "rgba(20, 184, 166, 0.1)",
            }}
            className="p-4 rounded-xl flex-row gap-3"
          >
            <Icon name="Lightbulb" size={20} color="#14B8A6" />
            <View className="flex-1">
              <Text className="text-foreground text-sm font-semibold mb-1">
                Pro Tip
              </Text>
              <Text className="text-muted-foreground text-xs leading-4">
                Check the app's main sections regularly to stay updated on new
                features and improvements.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupport;
