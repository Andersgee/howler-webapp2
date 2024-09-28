import { type StateCreator } from "zustand";

export type NotificationSlice = {
  notificationIsSupported: boolean | undefined;
  notificationPermission: NotificationPermission;
  pushSubscription: PushSubscription | null | undefined;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
  isStandalone: boolean | undefined;
  setNotificationIsSupported: (notificationIsSupported: boolean) => void;
  setNotificationPermission: (notificationPermission: NotificationPermission) => void;
  setPushSubscription: (x: PushSubscription | null) => void;
  setServiceWorkerRegistration: (x: ServiceWorkerRegistration | null) => void;
  setIsStandalone: (isStandalone: boolean) => void;
};

export const createNotificationSlice: StateCreator<NotificationSlice, [], [], NotificationSlice> = (set, _get) => ({
  notificationIsSupported: undefined,
  notificationPermission: "default",
  pushSubscription: undefined,
  serviceWorkerRegistration: null,
  isStandalone: undefined,
  setNotificationIsSupported: (notificationIsSupported) => set({ notificationIsSupported }),
  setNotificationPermission: (notificationPermission) => set({ notificationPermission }),
  setPushSubscription: (pushSubscription) => set({ pushSubscription }),
  setServiceWorkerRegistration: (serviceWorkerRegistration) => set({ serviceWorkerRegistration }),
  setIsStandalone: (isStandalone) => set({ isStandalone }),
});
