import React from "react";
import { View, Text } from "react-native";

// Local Imports
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthToggle: React.FC<Props> = ({ isActive, setIsActive }) => {
  return (
    <View className="bg-secondary rounded-lg flex-row w-full p-1 gap-4 mb-8">
      <Button
        className={cn("flex-1 bg-secondary", !isActive && "bg-primary")}
        onPress={() => setIsActive(false)}
      >
        <Text
          className={cn(
            "text-center font-semibold text-secondary",
            isActive && "text-primary"
          )}
        >
          Login
        </Text>
      </Button>
      <Button
        className={cn("flex-1 bg-secondary", isActive && "bg-primary")}
        onPress={() => setIsActive(true)}
      >
        <Text
          className={cn(
            "text-center font-semibold text-secondary",
            !isActive && "text-primary"
          )}
        >
          Register
        </Text>
      </Button>
    </View>
  );
};
export default AuthToggle;
