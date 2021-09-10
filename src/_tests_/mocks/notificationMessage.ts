import { NotificationAction, NotificationEntityType } from "../../types/Notification";

export const annotationsNotificationMessageWithContent = {
    entityType: NotificationEntityType.annotation,
    content: {
        author: {
            id: "1",
        },
        details: "details",
    },
};

export const transcriptNotificationMessageWithContent = {
    entityType: NotificationEntityType.transcript,
    content: {
        author: {
            id: "1",
        },
        details: "details",
    },
};

export const bringToMeMessageWithContent = {
    entityType: NotificationEntityType.bringAllTo,
    content: {
        author: {
            id: "1",
        },
        details: 3,
    },
};

export const bringToMeMessageWithNoDetails = {
    entityType: NotificationEntityType.bringAllTo,
    content: {
        author: {
            id: "1",
        },
    },
};

export const stampNotificationMessageWithContent = {
    entityType: NotificationEntityType.stamp,
    content: {
        stampLabel: "stampLabel",
    },
};

export const stampNotificationMessageWithError = {
    entityType: NotificationEntityType.stamp,
    action: NotificationAction.error,
    content: {
        message: "Error",
    },
};
