// Global imports
import { ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Local imports
import { Text } from "@/components/ui";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { PRIVACY_POLICY_SECTIONS } from "./config";
import { Header } from "@/components/ui-components/Header";

const PrivacyPolicy = () => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header title="Privacy Policy" canGoBack />

        {/* Last Updated */}
        <View className="px-5 pb-4">
          <Text className="text-muted-foreground text-xs">
            Last Updated: January 31, 2026
          </Text>
        </View>

        {/* Content */}
        <View className="px-5">
          {PRIVACY_POLICY_SECTIONS.map((section, sectionIndex) => (
            <View key={sectionIndex} className="mb-6">
              {/* Section Title */}
              <Text className="text-foreground text-lg font-bold mb-3">
                {section.title}
              </Text>

              {/* Section Content */}
              {section.content && (
                <Text className="text-muted-foreground text-sm leading-6 mb-4">
                  {section.content}
                </Text>
              )}

              {/* Subsections */}
              {section.subsections && (
                <View className="space-y-3">
                  {section.subsections.map((subsection, subIndex) => (
                    <View
                      key={subIndex}
                      style={{
                        backgroundColor: isDarkColorScheme
                          ? "rgba(63, 63, 70, 0.3)"
                          : "rgba(228, 228, 231, 0.3)",
                        borderWidth: 1,
                        borderColor: isDarkColorScheme
                          ? "rgba(82, 82, 91, 0.2)"
                          : "rgba(212, 212, 216, 0.3)",
                      }}
                      className="p-3 rounded-lg mb-3"
                    >
                      <Text className="text-foreground text-sm font-semibold mb-2">
                        {subsection.subtitle}
                      </Text>
                      <Text className="text-muted-foreground text-xs leading-5">
                        {subsection.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Info Box */}
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
            className="p-4 rounded-xl flex-row gap-3 mb-8"
          >
            <Icon name="Shield" size={20} color="#14B8A6" />
            <View className="flex-1">
              <Text className="text-foreground text-sm font-semibold mb-1">
                Your Privacy Matters
              </Text>
              <Text className="text-muted-foreground text-xs leading-4">
                We take your privacy seriously and are committed to maintaining
                the confidentiality and security of your personal information.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
