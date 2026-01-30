// Global Imports
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Text, View, ViewStyle } from "react-native";

// Local Imports
import { useColorScheme } from "@/lib/useColorScheme";
import { Account, Category } from "@/types";
import { NAV_THEME } from "@/lib/theme";

type T = Account | Category;

type BottomSheetProps = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  title?: string;
  contentContainerStyle?: ViewStyle;
};

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

const BottomSheet = forwardRef(
  (
    {
      data,
      renderItem,
      title = "Items",
      contentContainerStyle,
    }: BottomSheetProps,
    ref: React.Ref<BottomSheetRef>,
  ) => {
    const { isDarkColorScheme } = useColorScheme();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["50%", "75%", "80%"], []);

    // Expose present/dismiss to parent
    useImperativeHandle(ref, () => ({
      present: () => bottomSheetModalRef.current?.present(),
      dismiss: () => bottomSheetModalRef.current?.dismiss(),
    }));

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing
        handleStyle={{
          backgroundColor: isDarkColorScheme
            ? NAV_THEME.dark.colors.card
            : NAV_THEME.light.colors.card,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backdropFilter: "blur(10px)",
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkColorScheme
            ? NAV_THEME.dark.colors.primary
            : NAV_THEME.light.colors.primary,
        }}
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close" // This makes tapping outside close the sheet
            opacity={0.5}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)", // optional customization
            }}
          />
        )}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: isDarkColorScheme
              ? NAV_THEME.dark.colors.card
              : NAV_THEME.light.colors.card,
            ...(contentContainerStyle || {}),
          }}
        >
          <BottomSheetView className="p-4">
            <Text className="text-black dark:text-white text-center text-4xl font-semibold mb-4">
              {title}
            </Text>
            <View>{data.map((item, index) => renderItem(item, index))}</View>
          </BottomSheetView>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

export default BottomSheet;
