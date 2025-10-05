import * as ProgressPrimitive from "@rn-primitives/progress";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  indicatorClassName,
  indicatorColor,
  ...props
}: ProgressPrimitive.RootProps & {
  ref?: React.RefObject<ProgressPrimitive.RootRef>;
  indicatorClassName?: string;
  indicatorColor?: string;
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <Indicator
        value={value}
        color={indicatorColor}
        className={indicatorClassName}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };

function Indicator({
  value,
  className,
  color = "#000",
}: {
  value: number | undefined | null;
  className?: string;
  color?: string;
}) {
  const animatedValue = useRef(new Animated.Value(value ?? 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ?? 0,
      useNativeDriver: false, // we're animating width, which can't use native driver
      bounciness: 10,
      speed: 10,
    }).start();
  }, [value]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["1%", "100%"],
    extrapolate: "clamp",
  });

  if (Platform.OS === "web") {
    return (
      <View
        className={cn(
          "h-full w-full flex-1 bg-primary web:transition-all",
          className
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      >
        <ProgressPrimitive.Indicator
          style={{ backgroundColor: color }}
          className={cn("h-full w-full", className)}
        />
      </View>
    );
  }

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View
        style={{
          width: widthInterpolated,
          backgroundColor: color,
        }}
        className={cn("h-full bg-foreground", className)}
      />
    </ProgressPrimitive.Indicator>
  );
}
