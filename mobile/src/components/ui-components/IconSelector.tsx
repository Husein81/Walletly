import React, { useState } from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import { FlatList } from "react-native-gesture-handler";

// Local imports
import { NAV_THEME } from "~/lib/constants";
import { getColorByIndex } from "~/lib/functions";
import { iconsRecord } from "~/lib/icons/constants";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

type Props = {
  selectedIcon: string;
  setSelectedIcon: React.Dispatch<React.SetStateAction<string>>;
};
const IconSelector = ({ selectedIcon, setSelectedIcon }: Props) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="mb-4 border-2 p-2 border-primary rounded-lg">
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
                "p-2 rounded-lg mx-1",
                isSelected && "border-2 border-primary"
              )}
              style={{ backgroundColor }}
            >
              <Icon
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

export default IconSelector;
