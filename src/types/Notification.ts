export enum NotificationEntityType {
    transcript = "transcript",
    participantStatus = "participantStatus",
    annotation = "annotation",
    bringAllTo = "bringAllTo",
    deposition = "deposition",
    joinResponse = "joinResponse",
    lockBreakRoom = "lockBreakRoom",
    endDeposition = "endDeposition",
    exhibit = "exhibit",
}

export enum NotificationAction {
    create = "create",
    update = "update",
    delete = "delete",
    start = "start",
    error = "error",
}

export interface NotificationParticipantStatusContent {
    isMuted: boolean;
    email: string;
}

export type Notification = {
    entityType: NotificationEntityType;
    action: NotificationAction;
    content: NotificationParticipantStatusContent;
};

interface UploadNotificationContent {
    data: string;
    message: string;
}

export interface UploadNotification {
    entityType: NotificationEntityType;
    action: NotificationAction;
    content: UploadNotificationContent;
}
