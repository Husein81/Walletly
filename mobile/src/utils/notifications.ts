import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const registerForPushNotifications = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

const scheduleReminderNotification = async (
  date: Notifications.NotificationTriggerInput,
  title: string,
  body: string
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: date,
  });
};
