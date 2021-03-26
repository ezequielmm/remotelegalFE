import { NotificationEntityType } from "../../types/Notification";

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
