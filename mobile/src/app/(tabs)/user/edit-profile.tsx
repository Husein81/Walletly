// Global imports
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  View,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Local imports
import { Text } from "@/components/ui";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { useAuthStore } from "@/store";
import { useUpdateProfile } from "@/hooks/auth";
import Toast from "react-native-toast-message";
import { useForm } from "@tanstack/react-form";
import { InputField } from "@/components/ui-components";

const EditProfile = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();
  const updateProfile = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProfile.mutateAsync({ userId: user?.id || "", ...value });
        Toast.show({
          type: "success",
          text1: "Profile updated successfully",
        });
        router.back();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Update failed:",
          text2: (error as Error)?.message,
        });
      }
    },
  });

  const handleCancel = () => {
    if (
      form.getFieldValue("name") !== user?.name ||
      form.getFieldValue("email") !== user?.email
    ) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ],
      );
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    form.handleSubmit();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <View className="bg-card rounded-full p-2 border border-border">
          <Icon
            name="ChevronLeft"
            color={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
            size={24}
            onPress={handleCancel}
            className="text-foreground"
          />
        </View>
        <Text className="text-foreground text-xl font-bold">Edit Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
        }}
      >
        {/* Profile Picture Section */}
        <View className="px-5 pt-6 pb-4 items-center">
          <View className="relative">
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text className="text-white text-5xl font-bold">
                {form.getFieldValue("name").charAt(0).toUpperCase() || "U"}
              </Text>
            </LinearGradient>
            <Pressable
              className="absolute bottom-0 right-0 bg-primary rounded-full p-3 border-4 border-background active:scale-95"
              onPress={() => {
                // TODO: Implement image picker
                Toast.show({
                  type: "info",
                  text1: "Coming Soon",
                  text2: "Profile picture upload will be available soon",
                });
              }}
            >
              <Icon name="Camera" size={18} color="#000" />
            </Pressable>
          </View>
          <Text className="text-muted-foreground text-sm mt-4">
            Tap to change profile picture
          </Text>
        </View>

        {/* Form Section */}
        <View className="px-5 pt-6 gap-6">
          {/* Name Field */}
          <form.Field name="name">
            {(field) => (
              <InputField
                placeholder="Enter your full name"
                label="Full Name *"
                icon="User"
                field={field}
              />
            )}
          </form.Field>

          {/* Email Field */}
          <form.Field name="email">
            {(field) => (
              <InputField
                placeholder="Enter your email"
                label="Email Address"
                icon="Mail"
                field={field}
              />
            )}
          </form.Field>

          {/* Phone Field (Read-only) */}
          <View className="gap-2">
            <Text className="text-foreground text-sm font-semibold">
              Phone Number
            </Text>
            <View className="bg-muted/55  rounded-2xl border border-border overflow-hidden">
              <View className="flex-row items-center px-4">
                <Icon
                  name="Phone"
                  size={20}
                  color={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
                  className="text-muted-foreground"
                />
                <TextInput
                  value={user?.phone}
                  placeholder="Phone number"
                  placeholderTextColor={
                    isDarkColorScheme ? "#71717a" : "#a1a1aa"
                  }
                  className="flex-1 px-3 py-4 text-muted-foreground text-base"
                  editable={false}
                />
                <View className="bg-muted px-2 py-1 rounded-full">
                  <Text className="text-muted-foreground text-xs font-medium">
                    Verified
                  </Text>
                </View>
              </View>
            </View>
            <Text className="text-muted-foreground text-xs">
              Phone number cannot be changed
            </Text>
          </View>

          {/* Info Card */}
          <View className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
            <View className="flex-row items-start gap-3">
              <Icon
                name="Info"
                color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
                size={20}
                className="text-blue-500"
              />
              <View className="flex-1">
                <Text className="text-blue-500 text-sm font-semibold mb-1">
                  Profile Information
                </Text>
                <Text className="text-blue-500/80 text-xs">
                  Your profile information is used to personalize your
                  experience. Only your name will be visible to others.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="mb-4" />
        {/* Fixed Bottom Actions */}
        <View className="px-5 py-4 bg-background border-t border-border">
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleCancel}
              className="flex-1 active:scale-95"
            >
              <View className="bg-card rounded-2xl py-4 items-center justify-center border border-border">
                <Text className="text-foreground text-base font-semibold">
                  Cancel
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={updateProfile.isPending}
              className="flex-1 active:scale-95"
            >
              <LinearGradient
                colors={["#3b82f6", "#2563eb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 16,
                  paddingVertical: 16,
                  opacity: updateProfile.isPending ? 0.6 : 1,
                }}
              >
                <Text className="text-white text-base font-semibold text-center">
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
