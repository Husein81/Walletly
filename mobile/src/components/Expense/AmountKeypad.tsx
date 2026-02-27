import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { Keypad } from "@/components/ui-components";
import { Button } from "@/components/ui/button";
import { useBottomSheetStore } from "@/store";
import { useAuthStore } from "@/store/authStore";

type AmountKeypadProps = {
  initialValue: string;
  onConfirm: (value: string) => void;
};

export const AmountKeypad = ({
  initialValue,
  onConfirm,
}: AmountKeypadProps) => {
  const [value, setValue] = useState(initialValue || "");
  const [history, setHistory] = useState<string | null>(null);
  const { onClose } = useBottomSheetStore();
  const { user } = useAuthStore();

  const handlePress = (key: string) => {
    if (key === "=") {
      if (!value) return;
      const result = evaluate(value);
      if (result !== null) {
        setHistory(value + " =");
        setValue(result);
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid expression",
        });
      }
      return;
    }

    const isOperator = ["+", "-", "*", "/"].includes(key);

    if (history && !isOperator) {
      setHistory(null);
      if (key !== ".") {
        setValue(key === "00" ? "0" : key);
        return;
      }
    } else if (history && isOperator) {
      setHistory(null);
    }

    const lastChar = value.slice(-1);
    const isLastCharOperator = ["+", "-", "*", "/"].includes(lastChar);

    if (isOperator) {
      if (value === "" || value === "-") return;
      if (isLastCharOperator) {
        setValue((prev) => prev.slice(0, -1) + key);
        return;
      }
    }

    if (key === ".") {
      const parts = value.split(/[\+\-\*\/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
    }

    if (key === "00") {
      if (value === "" || value === "0" || isLastCharOperator) {
        setValue((prev) => (prev === "0" ? "0" : prev + "0"));
      } else {
        setValue((prev) => prev + "00");
      }
      return;
    }

    if (value === "0" && !isOperator && key !== ".") {
      setValue(key);
    } else {
      setValue((prev) => prev + key);
    }
  };

  const handleDelete = () => {
    setValue((prev) => {
      if (history) {
        setHistory(null);
        return prev;
      }
      return prev.slice(0, -1);
    });
  };

  const handleClear = () => {
    setValue("");
    setHistory(null);
  };

  const evaluate = (expr: string) => {
    try {
      // Remove any trailing operators before evaluating
      const sanitized = expr.replace(/[\+\-\*\/]$/, "");
      if (!sanitized) return "0";

      // Use Function constructor for safe simple arithmetic
      const result = new Function(`return ${sanitized}`)();
      return Number(result)
        .toFixed(2)
        .replace(/\.?0+$/, "");
    } catch (e) {
      return null;
    }
  };

  const handleConfirm = () => {
    const result = evaluate(value);
    if (result !== null) {
      onConfirm(result);
      onClose();
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid expression",
      });
    }
  };

  return (
    <View className="flex-1 p-4 bg-background">
      <Text className="text-center text-muted-foreground text-xl font-medium mb-1">
        Amount
      </Text>
      <View className="items-center justify-center mb-4 bg-muted/30 rounded-3xl border border-border h-32">
        <View className="absolute top-4 right-6">
          <Text className="text-muted-foreground text-lg font-medium text-right">
            {history || " "}
          </Text>
        </View>
        <View className="flex-row items-center mt-4">
          <Text className="text-2xl font-bold text-foreground opacity-60">
            {user?.currency?.symbol || "$"}
          </Text>
          <Text
            className="text-4xl font-bold text-foreground ml-2"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {value || "0"}
          </Text>
        </View>
      </View>

      <Keypad
        onPress={handlePress}
        onDelete={handleDelete}
        onClear={handleClear}
      />

      <Button className="mt-6 py-4 rounded-xl h-14" onPress={handleConfirm}>
        <Text className="text-primary-foreground font-bold text-lg">
          Confirm Amount
        </Text>
      </Button>
    </View>
  );
};
