import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type KeypadProps = {
  onPress: (key: string) => void;
  onDelete: () => void;
  onClear?: () => void;
  className?: string;
};

export const Keypad = ({
  onPress,
  onDelete,
  onClear,
  className,
}: KeypadProps) => {
  const renderKey = (
    key: string,
    type: "num" | "operator" | "delete" | "clear" | "equal" = "num",
  ) => {
    const isDelete = type === "delete";
    const isClear = type === "clear";
    const isOperator = type === "operator";
    const isEqual = type === "equal";

    const opText =
      key === "/"
        ? "÷"
        : key === "*"
          ? "×"
          : key === "-"
            ? "−"
            : key === "+"
              ? "+"
              : "=";

    return (
      <TouchableOpacity
        key={key}
        onPress={() =>
          isDelete ? onDelete() : isClear ? onClear && onClear() : onPress(key)
        }
        onLongPress={() => isDelete && onClear && onClear()}
        activeOpacity={0.8}
        className={cn(
          "h-16 items-center justify-center m-1 rounded-xl flex-1",
          isEqual
            ? "bg-primary"
            : isOperator
              ? "bg-primary/10 border border-primary/20"
              : isDelete
                ? "bg-destructive/10 border border-destructive/20"
                : isClear
                  ? "bg-muted dark:bg-muted-foreground"
                  : "bg-card border border-border",
        )}
      >
        {isDelete ? (
          <Icon name="Delete" size={22} color="#ef4444" />
        ) : isClear ? (
          <Text className="text-lg font-semibold text-muted-foreground dark:text-muted">
            AC
          </Text>
        ) : (
          <Text
            className={cn(
              "text-2xl font-semibold",
              isEqual
                ? "text-primary-foreground"
                : isOperator
                  ? "text-primary"
                  : "text-foreground",
            )}
          >
            {isOperator || isEqual ? opText : key}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const numberRows = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["0", ".", "00"],
  ];

  const operatorKeys = ["/", "*", "-", "+", "="];

  return (
    <View className={cn("w-full pb-4 flex-row", className)}>
      {/* LEFT SIDE — Numbers */}
      <View className="flex-1">
        {/* Top row (AC + Delete) */}

        {numberRows.map((row, i) => (
          <View key={i} className="flex-row">
            {row.map((key) => renderKey(key))}
          </View>
        ))}
        <View className="flex-row">
          {renderKey("AC", "clear")}
          {renderKey("del", "delete")}
        </View>
      </View>

      {/* RIGHT SIDE — Operators */}
      <View className="w-18 ml-2 justify-between">
        {operatorKeys.map((key) =>
          renderKey(key, key === "=" ? "equal" : "operator"),
        )}
      </View>
    </View>
  );
};
