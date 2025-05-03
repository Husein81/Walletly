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
    <View className="dark:bg-shark bg-lightGray  rounded-lg flex-row w-full p-1 gap-4 mb-8">
      <Button
        className={cn(
          "flex-1 dark:bg-shark bg-lightGray",
          !isActive && "dark:bg-white bg-shark"
        )}
        onPress={() => setIsActive(false)}
      >
        <Text
          className={cn(
            "text-center font-semibold text-white dark:text-shark",
            isActive && "text-primary dark:text-white"
          )}
        >
          Login
        </Text>
      </Button>
      <Button
        className={cn(
          "flex-1 dark:bg-shark bg-lightGray",
          isActive && "dark:bg-white bg-shark"
        )}
        onPress={() => setIsActive(true)}
      >
        <Text
          className={cn(
            "text-center font-semibold text-white dark:text-shark",
            !isActive && "text-primary dark:text-white"
          )}
        >
          Register
        </Text>
      </Button>
    </View>
  );
};
export default AuthToggle;
