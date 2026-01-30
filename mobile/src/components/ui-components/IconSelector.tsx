import React from "react";
import { Pressable, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

// Local imports
import { iconsRecord } from "@/lib/config";
import { getColorByIndex } from "@/functions";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { NAV_THEME } from "@/lib/theme";

type Props = {
  selectedIcon: string;
  setSelectedIcon: React.Dispatch<React.SetStateAction<string>>;
};

export const IconSelector = ({ selectedIcon, setSelectedIcon }: Props) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="bg-card shadow-lg border-2 border-border p-3 rounded-2xl">
      <FlatList
        data={Object.entries(iconsRecord)}
        keyExtractor={([key]) => key}
        renderItem={({ item: [key, value] }) => {
          const isSelected = selectedIcon === key;
          return (
            <Pressable
              onPress={() => setSelectedIcon(key)}
              className={cn(
                "bg-primary/10 p-2 rounded-xl mx-1 mt-0.5",
                isSelected && "border-2 border-primary",
              )}
            >
              <Icon
                onPress={() => setSelectedIcon(key)}
                name={value}
                color={
                  isDarkColorScheme
                    ? NAV_THEME.dark.colors.primary
                    : NAV_THEME.light.colors.primary
                }
                size={28}
              />
              {isSelected && (
                <View className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                  <Icon name="Check" size={10} color={"#fff"} />
                </View>
              )}
            </Pressable>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
