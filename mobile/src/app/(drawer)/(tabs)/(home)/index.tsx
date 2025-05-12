// Global imports
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Local imports
import { Button } from "~/components/ui";
import { Modal } from "~/components/ui-components";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import useModalStore from "~/store/modalStore";

const Home = () => {
  const offsetY = useSharedValue(0);
  const visibility = useSharedValue(1);

  const { isDarkColorScheme } = useColorScheme();
  const { onOpen, onClose } = useModalStore();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentOffset = event.contentOffset.y;
      if (currentOffset > offsetY.value) {
        // Scrolling down
        visibility.value = withTiming(0, { duration: 300 });
      } else {
        // Scrolling up
        visibility.value = withTiming(1, { duration: 300 });
      }
      offsetY.value = currentOffset;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(visibility.value === 1 ? 0 : 100, {
            duration: 300,
          }),
        },
      ],
      opacity: visibility.value,
    };
  });

  const handlePress = () => {
    onOpen(
      <View className="flex-1 ">
        <Button onPress={onClose} className="bg-primary">
          <Text>close</Text>
        </Button>
      </View>,
      "Test",
      false
    );
  };

  return (
    <SafeAreaView className="flex-1 ">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text>Records</Text>
      </Animated.ScrollView>
      <Modal />
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 32,
            right: 16,
            borderRadius: 9999,
            padding: 8,
            backgroundColor: isDarkColorScheme ? "#fff" : "#000",
          },
          animatedStyle,
        ]}
      >
        <Icon
          name="Plus"
          size={32}
          onPress={handlePress}
          color={isDarkColorScheme ? "#000" : "#fff"}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
export default Home;
