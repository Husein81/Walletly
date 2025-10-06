import { View, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Rn, Separator, Text } from "../ui";
import { useAuthStore } from "@/store";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { router } from "expo-router";

const UserDropdown = () => {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const { user, clearAuth } = useAuthStore();
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <Rn.DropdownMenu>
      <Rn.DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="w-12 h-12 rounded-2xl">
          <Rn.Avatar alt="User Avatar" className="w-9 h-9">
            <Rn.AvatarImage
              source={{
                uri: `https://ui-avatars.com/api/?name=${
                  user?.name || "User"
                }&size=100&background=3b82f6&color=fff`,
              }}
            />
            <Rn.AvatarFallback
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-primary/30"
            >
              <Text style={{ color: "#3b82f6" }} className="font-bold text-sm">
                {getInitials(user?.name)}
              </Text>
            </Rn.AvatarFallback>
          </Rn.Avatar>
        </Button>
      </Rn.DropdownMenuTrigger>
      <Rn.DropdownMenuContent
        insets={contentInsets}
        className="w-64 rounded-2xl"
      >
        {/* User Info Header */}
        <View className="px-2 py-3 border-b border-border/50">
          <Text className="text-foreground font-bold text-base capitalize">
            {user?.name || "User"}
          </Text>
          <Text className="text-muted-foreground text-sm mt-0.5">
            {user?.phone}
          </Text>
        </View>

        {/* Profile Menu Item */}
        <Rn.DropdownMenuItem onPress={() => router.push("/user")}>
          <View className="flex-row items-center gap-3 py-1">
            <View className="bg-primary/10 p-2 rounded-lg">
              <Icon name="User" size={16} color="#3b82f6" />
            </View>
            <Text className="text-foreground font-medium">View Profile</Text>
          </View>
        </Rn.DropdownMenuItem>

        {/* Theme Toggle */}
        <Rn.DropdownMenuItem onPress={toggleColorScheme}>
          <View className="flex-row items-center gap-3 py-1">
            <View className="bg-primary/10 p-2 rounded-lg">
              <Icon
                name={isDarkColorScheme ? "Moon" : "Sun"}
                size={16}
                color="#3b82f6"
              />
            </View>
            <Text className="text-foreground font-medium">
              {isDarkColorScheme ? "Dark Mode" : "Light Mode"}
            </Text>
          </View>
        </Rn.DropdownMenuItem>

        <Separator className="my-1" />

        {/* Logout */}
        <Rn.DropdownMenuItem onPress={handleLogout}>
          <View className="flex-row items-center gap-3 py-1">
            <View className="bg-destructive/10 p-2 rounded-lg">
              <Icon name="LogOut" size={16} color="#ef4444" />
            </View>
            <Text className="text-destructive font-medium">Logout</Text>
          </View>
        </Rn.DropdownMenuItem>
      </Rn.DropdownMenuContent>
    </Rn.DropdownMenu>
  );
};
export default UserDropdown;
