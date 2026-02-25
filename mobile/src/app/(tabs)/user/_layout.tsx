import { Stack } from "expo-router";

const UserLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="currency-sign" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
};
export default UserLayout;
