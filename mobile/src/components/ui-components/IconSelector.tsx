import React from "react";
import { Pressable, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

// Local imports
import { iconsRecord, NAV_THEME } from "~/lib/config";
import { getColorByIndex } from "~/functions";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

type Props = {
  selectedIcon: string;
  setSelectedIcon: React.Dispatch<React.SetStateAction<string>>;
};

export const IconSelector = ({ selectedIcon, setSelectedIcon }: Props) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="mb-4 border-2 p-2 border-primary rounded-xl">
      <FlatList
        data={Object.entries(iconsRecord)}
        keyExtractor={([key]) => key}
        renderItem={({ item: [key, value] }) => {
          const isSelected = selectedIcon === key;
          const backgroundColor = getColorByIndex(key);

          return (
            <Pressable
              onPress={() => setSelectedIcon(key)}
              className={cn(
                "p-2 rounded-xl mx-1",
                isSelected && "border-2 border-primary"
              )}
              style={{ backgroundColor }}
            >
              <Icon
                onPress={() => setSelectedIcon(key)}
                name={value}
                color={
                  isDarkColorScheme
                    ? NAV_THEME.dark.primary
                    : NAV_THEME.light.primary
                }
                size={28}
              />
            </Pressable>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
