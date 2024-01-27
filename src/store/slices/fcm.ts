import type { StateCreator } from "zustand";
import type { MessagePayload } from "firebase/messaging";
import { useStore } from "..";
import { getNotificationsIsAlreadyGranted, requestNotificationPermission } from "#src/utils/notification-permission";

export type Fcmslice = {
  notificationsIsGranted: boolean;
  fcmMessagePayload: MessagePayload | null;
  maybeRequestNotifications: (onDenied: () => void) => Promise<void>;
};

export const createFcmSlice: StateCreator<Fcmslice, [], [], Fcmslice> = (set, get) => ({
  notificationsIsGranted: getNotificationsIsAlreadyGranted(),
  fcmMessagePayload: null,
  maybeRequestNotifications: async (onDenied) => {
    //const onDenied = () => alert(
    //  "Notifications are blocked. Please open your browser preferences or click the lock near the address bar to change your notification preferences."
    //);

    if (!get().notificationsIsGranted) {
      const onGranted = () => set({ notificationsIsGranted: true });
      await requestNotificationPermission(onDenied, onGranted);
    }
  },
});

export function payloadDispatch(payload: MessagePayload) {
  useStore.setState({ fcmMessagePayload: payload });
}

//export function setNotificationsIsGranted(notificationsIsGranted: boolean) {
//  useStore.setState({ notificationsIsGranted });
//}
