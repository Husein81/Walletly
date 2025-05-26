import { Stack } from "expo-router";
import { View, Text } from "react-native";
const UserLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user" />
    </Stack>
  );
};
export default UserLayout;
