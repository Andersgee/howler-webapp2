export async function requestNotificationPermission(onDenied: () => void, onGranted: () => void) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    // return true;
  } else if (Notification.permission === "denied") {
    onDenied();
  } else {
    //Notification.permission === "default"
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      onGranted();
    } else if (permission === "denied") {
      onDenied();
    } else {
      //permission === "default"
      //
    }
  }
}

export function getNotificationsIsAlreadyGranted() {
  if (typeof window === "undefined") return false;
  if ("Notification" in window && Notification.permission === "granted") return true;
  return false;
}
