import { Input } from "@/components/ui/input";
import React, { useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

type OtpInputProps = {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
} & Omit<TextInputProps, "onChangeText">;

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChangeText,
  autoFocus = true,
  ...props
}) => {
  const inputsRef = useRef<(TextInput | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    // Only handle single character input
    if (text.length > 1) {
      // Handle paste - distribute characters across inputs
      const pastedText = text.slice(0, length);
      const newValue = pastedText.padEnd(length, "").slice(0, length);
      onChangeText(newValue);

      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedText.length, length - 1);
      setTimeout(() => {
        inputsRef.current[nextIndex]?.focus();
      }, 10);
      return;
    }

    // Replace only the character at current index
    const valueArray = value.split("");
    valueArray[index] = text;
    const newValue = valueArray.join("").slice(0, length);

    onChangeText(newValue);

    // Move to next input if text was entered and not the last input
    if (text && index < length - 1) {
      setTimeout(() => {
        inputsRef.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty, move to previous input
        const valueArray = value.split("");
        valueArray[index - 1] = "";
        onChangeText(valueArray.join(""));

        setTimeout(() => {
          inputsRef.current[index - 1]?.focus();
        }, 10);
      } else if (value[index]) {
        // Clear current input
        const valueArray = value.split("");
        valueArray[index] = "";
        onChangeText(valueArray.join(""));
      }
    }
  };

  return (
    <View className="flex-row justify-between gap-2 mb-4">
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(ref) => {
            inputsRef.current[i] = ref;
          }}
          value={value[i] || ""}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          className="flex-1 aspect-square max-w-[56px] text-center text-2xl font-semibold"
          {...props}
        />
      ))}
    </View>
  );
};

export default OtpInput;
